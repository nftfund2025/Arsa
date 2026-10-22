'use strict';
// arsa messenger — single-file server. Node >= 22.13, one dependency (nodemailer, for SMTP).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

// ───────────────────────── config ─────────────────────────
const env = process.env;
const IS_PROD = env.NODE_ENV === 'production';
const PORT = +env.PORT || 3000;
const DATA_DIR = env.DATA_DIR || path.join(__dirname, 'data');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SECRET = env.APP_SECRET || (IS_PROD ? null : 'dev-only-secret');
if (!SECRET) { console.error('APP_SECRET is required in production'); process.exit(1); }
const APP_NAME = env.APP_NAME || 'arsa';
const MAX_USERS = +env.MAX_USERS || 100;
const MAX_UPLOAD = (+env.MAX_UPLOAD_MB || 25) * 1024 * 1024;
const list = (s) => (s || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
const ALLOWED_DOMAINS = list(env.ALLOWED_DOMAINS);
const ADMIN_EMAILS = list(env.ADMIN_EMAILS);
const SESSION_MS = 30 * 24 * 3600 * 1000;
const OTP_MS = 10 * 60 * 1000;
const EMOJI = ['👍', '❤️', '😂', '🎉', '🙏', '😮'];

fs.mkdirSync(path.join(DATA_DIR, 'uploads'), { recursive: true });

// ───────────────────────── database ─────────────────────────
const db = new DatabaseSync(path.join(DATA_DIR, 'arsa.db'));
db.exec(`
PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user', banned INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL, last_seen INTEGER);
CREATE TABLE IF NOT EXISTS allowed_emails(email TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS otps(email TEXT PRIMARY KEY, hash TEXT NOT NULL, expires INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS chats(
  id INTEGER PRIMARY KEY, type TEXT NOT NULL, title TEXT NOT NULL DEFAULT '', dm_key TEXT UNIQUE,
  created_by INTEGER, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS members(
  chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', last_read_id INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(chat_id, user_id));
CREATE TABLE IF NOT EXISTS files(
  id TEXT PRIMARY KEY, owner_id INTEGER NOT NULL, name TEXT NOT NULL, mime TEXT NOT NULL,
  size INTEGER NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL, body TEXT NOT NULL DEFAULT '', reply_to INTEGER, file_id TEXT,
  created_at INTEGER NOT NULL, edited_at INTEGER, deleted INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_msg_chat ON messages(chat_id, id);
CREATE TABLE IF NOT EXISTS reactions(
  message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE, user_id INTEGER NOT NULL,
  emoji TEXT NOT NULL, PRIMARY KEY(message_id, user_id, emoji));
CREATE TABLE IF NOT EXISTS kv(key TEXT PRIMARY KEY, value TEXT);
`);
const Q = (sql) => db.prepare(sql);
const now = () => Date.now();

// Default "everyone" group: every new user joins it automatically.
function defaultChatId() {
  const row = Q("SELECT value FROM kv WHERE key='default_chat'").get();
  if (row && Q('SELECT 1 x FROM chats WHERE id=?').get(+row.value)) return +row.value;
  const r = Q("INSERT INTO chats(type,title,created_at) VALUES('group',?,?)").run(env.DEFAULT_CHAT_TITLE || 'General · عمومی', now());
  Q("INSERT OR REPLACE INTO kv(key,value) VALUES('default_chat',?)").run(String(r.lastInsertRowid));
  return Number(r.lastInsertRowid);
}
const DEFAULT_CHAT = defaultChatId();

// ───────────────────────── helpers ─────────────────────────
class HttpError extends Error { constructor(code, msg) { super(msg); this.code = code; } }
const fail = (code, msg) => { throw new HttpError(code, msg); };
const sendJSON = (res, code, obj) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(obj));
};
const sha = (s) => crypto.createHash('sha256').update(SECRET + ':' + s).digest('hex');
const safeEq = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const clientIp = (req) => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'ip';

const hits = new Map();
function limit(key, max, windowMs) {
  const t = now();
  const arr = (hits.get(key) || []).filter((x) => t - x < windowMs);
  if (arr.length >= max) { hits.set(key, arr); fail(429, 'rate_limited'); }
  arr.push(t); hits.set(key, arr);
}
setInterval(() => { const t = now(); for (const [k, v] of hits) if (!v.length || t - v[v.length - 1] > 3600e3) hits.delete(k); }, 600e3).unref();

// ───────────────────────── email ─────────────────────────
let transporter = null;
if (env.SMTP_HOST) {
  try {
    transporter = require('nodemailer').createTransport({
      host: env.SMTP_HOST, port: +env.SMTP_PORT || 587, secure: env.SMTP_SECURE === 'true',
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  } catch (e) { console.error('nodemailer not installed:', e.message); }
}
if (IS_PROD && !transporter) console.warn('WARNING: SMTP is not configured — login codes will only be printed to the log.');
async function sendCode(email, code) {
  if (!transporter) { console.log(`[login code] ${email}: ${code}`); return; }
  await transporter.sendMail({
    from: env.SMTP_FROM || `${APP_NAME} <no-reply@localhost>`,
    to: email,
    subject: `${code} — ${APP_NAME}`,
    text: `کد ورود شما به ${APP_NAME}: ${code}\nاین کد ۱۰ دقیقه اعتبار دارد.\n\nYour ${APP_NAME} login code: ${code}\nIt expires in 10 minutes.`,
    html: `<div style="font-family:Tahoma,Arial,sans-serif;max-width:420px;margin:auto;padding:24px;text-align:center">
      <h2 style="color:#22408f;margin:0 0 8px">${APP_NAME}</h2>
      <p style="color:#555">کد ورود شما · Your login code</p>
      <div style="font-size:34px;letter-spacing:8px;font-weight:700;background:#e8edf3;border-radius:12px;padding:14px 0;direction:ltr">${code}</div>
      <p style="color:#888;font-size:13px">۱۰ دقیقه اعتبار دارد · Expires in 10 minutes</p></div>`,
  });
}

// ───────────────────────── auth ─────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function isAllowed(email) {
  if (Q('SELECT 1 x FROM users WHERE email=?').get(email)) return true;
  if (ADMIN_EMAILS.includes(email)) return true;
  if (Q('SELECT 1 x FROM allowed_emails WHERE email=?').get(email)) return true;
  if (ALLOWED_DOMAINS.includes(email.split('@')[1])) return true;
  // Local development with nothing configured: open.
  return !IS_PROD && !ALLOWED_DOMAINS.length && !ADMIN_EMAILS.length && !Q('SELECT 1 x FROM allowed_emails').get();
}
function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function userFromReq(req) {
  const token = parseCookies(req).arsa_session;
  if (!token) return null;
  const row = Q(`SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=? AND s.created_at>? AND u.banned=0`).get(sha(token), now() - SESSION_MS);
  return row || null;
}
const online = (id) => streams.has(id);
const userOut = (u, admin = false) => ({
  id: u.id, name: u.name, email: u.email, role: u.role, online: online(u.id), last_seen: u.last_seen,
  ...(admin ? { banned: !!u.banned, created_at: u.created_at } : {}),
});

// ───────────────────────── realtime (SSE) ─────────────────────────
const streams = new Map(); // userId -> Set<res>
function emit(userIds, event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const id of userIds) { const s = streams.get(id); if (s) for (const r of s) r.write(payload); }
}
setInterval(() => { for (const s of streams.values()) for (const r of s) r.write(': ping\n\n'); }, 25000).unref();

function openStream(req, res, user) {
  res.writeHead(200, {
    'content-type': 'text/event-stream', 'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive', 'x-accel-buffering': 'no',
  });
  res.write('retry: 3000\n\n');
  const first = !streams.has(user.id);
  if (first) streams.set(user.id, new Set());
  streams.get(user.id).add(res);
  res.write(`event: hello\ndata: ${JSON.stringify({ online: [...streams.keys()] })}\n\n`);
  if (first) emit(streams.keys(), 'presence', { user_id: user.id, online: true });
  req.on('close', () => {
    const set = streams.get(user.id);
    if (!set) return;
    set.delete(res);
    if (!set.size) {
      streams.delete(user.id);
      const t = now();
      Q('UPDATE users SET last_seen=? WHERE id=?').run(t, user.id);
      emit(streams.keys(), 'presence', { user_id: user.id, online: false, last_seen: t });
    }
  });
}
function kick(userId) {
  const set = streams.get(userId);
  if (set) for (const r of set) r.end();
}

// ───────────────────────── chat model ─────────────────────────
const memberRow = (chatId, uid) => Q('SELECT * FROM members WHERE chat_id=? AND user_id=?').get(chatId, uid);
const memberIds = (chatId) => Q('SELECT user_id FROM members WHERE chat_id=?').all(chatId).map((r) => r.user_id);
function needMember(chatId, uid) { const m = memberRow(chatId, uid); if (!m) fail(404, 'not_found'); return m; }
const canManage = (m, user) => m.role === 'owner' || m.role === 'admin' || user.role === 'admin';

function msgOut(m) {
  const out = {
    id: m.id, chat_id: m.chat_id, sender_id: m.sender_id, created_at: m.created_at, edited_at: m.edited_at,
    deleted: !!m.deleted, body: m.deleted ? '' : m.body, reply_to: m.reply_to, file: null, reply: null, reactions: [],
  };
  if (!m.deleted && m.file_id) {
    const f = Q('SELECT id,name,mime,size FROM files WHERE id=?').get(m.file_id);
    if (f) out.file = f;
  }
  if (m.reply_to) {
    const r = Q('SELECT * FROM messages WHERE id=?').get(m.reply_to);
    if (r) out.reply = { id: r.id, sender_id: r.sender_id, deleted: !!r.deleted, has_file: !!r.file_id, body: r.deleted ? '' : r.body.slice(0, 120) };
  }
  const map = new Map();
  for (const r of Q('SELECT emoji,user_id FROM reactions WHERE message_id=?').all(m.id)) {
    if (!map.has(r.emoji)) map.set(r.emoji, []);
    map.get(r.emoji).push(r.user_id);
  }
  out.reactions = [...map].map(([emoji, user_ids]) => ({ emoji, user_ids }));
  return out;
}
function chatOut(chatId, uid) {
  const c = Q('SELECT * FROM chats WHERE id=?').get(chatId);
  const mem = Q('SELECT user_id,role,last_read_id FROM members WHERE chat_id=?').all(chatId);
  const me = mem.find((m) => m.user_id === uid);
  const last = Q('SELECT * FROM messages WHERE chat_id=? ORDER BY id DESC LIMIT 1').get(chatId);
  const unread = Q('SELECT COUNT(*) n FROM messages WHERE chat_id=? AND id>? AND sender_id!=? AND deleted=0').get(chatId, me ? me.last_read_id : 0, uid).n;
  return {
    id: c.id, type: c.type, title: c.title, created_by: c.created_by, members: mem,
    my_role: me ? me.role : null, unread, last: last ? msgOut(last) : null, is_default: c.id === DEFAULT_CHAT,
  };
}
function pushChat(chatId) { for (const uid of memberIds(chatId)) emit([uid], 'chat', chatOut(chatId, uid)); }

function createUser(email) {
  if (Q('SELECT COUNT(*) n FROM users').get().n >= MAX_USERS) fail(403, 'full');
  const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
  const r = Q('INSERT INTO users(email,role,created_at) VALUES(?,?,?)').run(email, role, now());
  const id = Number(r.lastInsertRowid);
  Q('INSERT OR IGNORE INTO members(chat_id,user_id,role) VALUES(?,?,?)').run(DEFAULT_CHAT, id, 'member');
  return Q('SELECT * FROM users WHERE id=?').get(id);
}

// ───────────────────────── routes ─────────────────────────
const routes = [];
const route = (method, pattern, handler, opts = {}) => {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  routes.push({ method, re, keys, handler, ...opts });
};
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v) => { const n = Number(v); return Number.isInteger(n) ? n : null; };

// — auth —
route('POST', '/api/auth/request', async ({ req, body }) => {
  const email = str(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) fail(400, 'bad_email');
  limit('ip:' + clientIp(req), 20, 10 * 60e3);
  limit('mail:' + email, 3, 10 * 60e3);
  if (!isAllowed(email)) fail(403, 'not_allowed');
  const u = Q('SELECT banned FROM users WHERE email=?').get(email);
  if (u && u.banned) fail(403, 'banned');
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  Q('INSERT OR REPLACE INTO otps(email,hash,expires,attempts) VALUES(?,?,?,0)').run(email, sha(email + ':' + code), now() + OTP_MS);
  await sendCode(email, code);
  return { ok: true };
}, { auth: false });

route('POST', '/api/auth/verify', ({ req, res, body }) => {
  const email = str(body.email, 254).toLowerCase();
  const code = str(body.code, 12).replace(/\D/g, '');
  limit('vip:' + clientIp(req), 30, 10 * 60e3);
  const row = Q('SELECT * FROM otps WHERE email=?').get(email);
  if (!row || row.expires < now()) fail(400, 'code_expired');
  if (row.attempts >= 5) { Q('DELETE FROM otps WHERE email=?').run(email); fail(429, 'too_many_attempts'); }
  if (!safeEq(row.hash, sha(email + ':' + code))) {
    Q('UPDATE otps SET attempts=attempts+1 WHERE email=?').run(email);
    fail(400, 'bad_code');
  }
  Q('DELETE FROM otps WHERE email=?').run(email);
  if (!isAllowed(email)) fail(403, 'not_allowed');
  let user = Q('SELECT * FROM users WHERE email=?').get(email);
  if (user && user.banned) fail(403, 'banned');
  if (!user) user = createUser(email);
  const token = crypto.randomBytes(32).toString('base64url');
  Q('INSERT INTO sessions(hash,user_id,created_at) VALUES(?,?,?)').run(sha(token), user.id, now());
  res.setHeader('set-cookie', `arsa_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MS / 1000}${IS_PROD ? '; Secure' : ''}`);
  if (user.role !== 'admin' && ADMIN_EMAILS.includes(email)) { Q("UPDATE users SET role='admin' WHERE id=?").run(user.id); user.role = 'admin'; }
  return { user: userOut(user), is_new: !user.name };
}, { auth: false });

route('POST', '/api/auth/logout', ({ req, res }) => {
  const token = parseCookies(req).arsa_session;
  if (token) Q('DELETE FROM sessions WHERE hash=?').run(sha(token));
  res.setHeader('set-cookie', 'arsa_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  return { ok: true };
}, { auth: false });

// — profile / directory —
route('GET', '/api/me', ({ user }) => ({
  user: userOut(user),
  config: { app_name: APP_NAME, max_upload_mb: MAX_UPLOAD / 1048576, default_chat_id: DEFAULT_CHAT, emoji: EMOJI },
}));
route('PATCH', '/api/me', ({ user, body }) => {
  const name = str(body.name, 60);
  if (!name) fail(400, 'bad_name');
  Q('UPDATE users SET name=? WHERE id=?').run(name, user.id);
  emit(streams.keys(), 'user', userOut({ ...user, name }));
  return { user: userOut({ ...user, name }) };
});
route('GET', '/api/users', () => ({
  users: Q("SELECT * FROM users WHERE banned=0 AND name!='' ORDER BY name COLLATE NOCASE").all().map((u) => userOut(u)),
}));

// — chats —
route('GET', '/api/chats', ({ user }) => {
  const ids = Q('SELECT chat_id FROM members WHERE user_id=?').all(user.id).map((r) => r.chat_id);
  const chats = ids.map((id) => chatOut(id, user.id));
  chats.sort((a, b) => (b.last ? b.last.id : 0) - (a.last ? a.last.id : 0) || b.id - a.id);
  return { chats };
});
route('POST', '/api/chats', ({ user, body }) => {
  const type = body.type;
  if (type === 'dm') {
    const peer = int(body.user_id);
    const p = peer && Q('SELECT * FROM users WHERE id=? AND banned=0').get(peer);
    if (!p || p.id === user.id) fail(400, 'bad_user');
    const key = [user.id, p.id].sort((a, b) => a - b).join(':');
    let c = Q('SELECT id FROM chats WHERE dm_key=?').get(key);
    if (!c) {
      const r = Q("INSERT INTO chats(type,dm_key,created_by,created_at) VALUES('dm',?,?,?)").run(key, user.id, now());
      c = { id: Number(r.lastInsertRowid) };
      Q('INSERT INTO members(chat_id,user_id) VALUES(?,?)').run(c.id, user.id);
      Q('INSERT INTO members(chat_id,user_id) VALUES(?,?)').run(c.id, p.id);
      pushChat(c.id);
    }
    return { chat: chatOut(c.id, user.id) };
  }
  if (type === 'group' || type === 'channel') {
    const title = str(body.title, 80);
    if (!title) fail(400, 'bad_title');
    const ids = [...new Set((Array.isArray(body.member_ids) ? body.member_ids : []).map(int).filter((x) => x && x !== user.id))].slice(0, MAX_USERS);
    const valid = ids.filter((id) => Q('SELECT 1 x FROM users WHERE id=? AND banned=0').get(id));
    const r = Q('INSERT INTO chats(type,title,created_by,created_at) VALUES(?,?,?,?)').run(type, title, user.id, now());
    const cid = Number(r.lastInsertRowid);
    Q("INSERT INTO members(chat_id,user_id,role) VALUES(?,?,'owner')").run(cid, user.id);
    for (const id of valid) Q('INSERT INTO members(chat_id,user_id) VALUES(?,?)').run(cid, id);
    pushChat(cid);
    return { chat: chatOut(cid, user.id) };
  }
  fail(400, 'bad_type');
});
route('POST', '/api/chats/:id/members', ({ user, params, body }) => {
  const cid = int(params.id);
  const m = needMember(cid, user.id);
  const chat = Q('SELECT * FROM chats WHERE id=?').get(cid);
  if (chat.type === 'dm' || !canManage(m, user)) fail(403, 'forbidden');
  for (const raw of Array.isArray(body.user_ids) ? body.user_ids : []) {
    const id = int(raw);
    if (id && Q('SELECT 1 x FROM users WHERE id=? AND banned=0').get(id)) Q('INSERT OR IGNORE INTO members(chat_id,user_id) VALUES(?,?)').run(cid, id);
  }
  pushChat(cid);
  return { chat: chatOut(cid, user.id) };
});
route('DELETE', '/api/chats/:id/members/:uid', ({ user, params }) => {
  const cid = int(params.id), target = int(params.uid);
  const m = needMember(cid, user.id);
  const chat = Q('SELECT * FROM chats WHERE id=?').get(cid);
  if (chat.type === 'dm' || cid === DEFAULT_CHAT) fail(403, 'forbidden');
  if (target !== user.id && !canManage(m, user)) fail(403, 'forbidden');
  Q('DELETE FROM members WHERE chat_id=? AND user_id=?').run(cid, target);
  emit([target], 'chat_removed', { id: cid });
  if (!memberIds(cid).length) Q('DELETE FROM chats WHERE id=?').run(cid);
  else pushChat(cid);
  return { ok: true };
});

// — messages —
route('GET', '/api/chats/:id/messages', ({ user, params, url }) => {
  const cid = int(params.id);
  needMember(cid, user.id);
  const before = int(url.searchParams.get('before')) || 1e12;
  const rows = Q('SELECT * FROM messages WHERE chat_id=? AND id<? ORDER BY id DESC LIMIT 50').all(cid, before);
  return { messages: rows.reverse().map(msgOut), has_more: rows.length === 50 };
});
route('POST', '/api/chats/:id/messages', ({ user, params, body }) => {
  const cid = int(params.id);
  const m = needMember(cid, user.id);
  const chat = Q('SELECT * FROM chats WHERE id=?').get(cid);
  if (chat.type === 'channel' && m.role === 'member') fail(403, 'channel_readonly');
  limit('msg:' + user.id, 60, 60e3);
  const text = typeof body.body === 'string' ? body.body.trim().slice(0, 4000) : '';
  let fileId = null;
  if (body.file_id) {
    const f = Q('SELECT * FROM files WHERE id=? AND owner_id=?').get(String(body.file_id), user.id);
    if (!f || Q('SELECT 1 x FROM messages WHERE file_id=?').get(f.id)) fail(400, 'bad_file');
    fileId = f.id;
  }
  if (!text && !fileId) fail(400, 'empty');
  let replyTo = null;
  if (body.reply_to) {
    const r = Q('SELECT id FROM messages WHERE id=? AND chat_id=?').get(int(body.reply_to), cid);
    if (r) replyTo = r.id;
  }
  const r = Q('INSERT INTO messages(chat_id,sender_id,body,reply_to,file_id,created_at) VALUES(?,?,?,?,?,?)').run(cid, user.id, text, replyTo, fileId, now());
  const id = Number(r.lastInsertRowid);
  Q('UPDATE members SET last_read_id=? WHERE chat_id=? AND user_id=?').run(id, cid, user.id);
  const out = msgOut(Q('SELECT * FROM messages WHERE id=?').get(id));
  emit(memberIds(cid), 'message', out);
  return { message: out };
});
function loadOwnMessage(user, id, allowManage) {
  const msg = Q('SELECT * FROM messages WHERE id=?').get(int(id));
  if (!msg) fail(404, 'not_found');
  const m = needMember(msg.chat_id, user.id);
  const own = msg.sender_id === user.id;
  if (!own && !(allowManage && canManage(m, user))) fail(403, 'forbidden');
  return msg;
}
route('PATCH', '/api/messages/:id', ({ user, params, body }) => {
  const msg = loadOwnMessage(user, params.id, false);
  const text = str(body.body, 4000);
  if (msg.deleted || !text) fail(400, 'empty');
  Q('UPDATE messages SET body=?, edited_at=? WHERE id=?').run(text, now(), msg.id);
  const out = msgOut(Q('SELECT * FROM messages WHERE id=?').get(msg.id));
  emit(memberIds(msg.chat_id), 'message_update', out);
  return { message: out };
});
route('DELETE', '/api/messages/:id', ({ user, params }) => {
  const msg = loadOwnMessage(user, params.id, true);
  if (msg.file_id) {
    try { fs.unlinkSync(path.join(DATA_DIR, 'uploads', msg.file_id)); } catch {}
    Q('DELETE FROM files WHERE id=?').run(msg.file_id);
  }
  Q('UPDATE messages SET deleted=1, body=\'\', file_id=NULL WHERE id=?').run(msg.id);
  Q('DELETE FROM reactions WHERE message_id=?').run(msg.id);
  const out = msgOut(Q('SELECT * FROM messages WHERE id=?').get(msg.id));
  emit(memberIds(msg.chat_id), 'message_update', out);
  return { ok: true };
});
route('POST', '/api/messages/:id/react', ({ user, params, body }) => {
  const msg = Q('SELECT * FROM messages WHERE id=?').get(int(params.id));
  if (!msg || msg.deleted) fail(404, 'not_found');
  needMember(msg.chat_id, user.id);
  if (!EMOJI.includes(body.emoji)) fail(400, 'bad_emoji');
  const had = Q('SELECT 1 x FROM reactions WHERE message_id=? AND user_id=? AND emoji=?').get(msg.id, user.id, body.emoji);
  if (had) Q('DELETE FROM reactions WHERE message_id=? AND user_id=? AND emoji=?').run(msg.id, user.id, body.emoji);
  else Q('INSERT INTO reactions(message_id,user_id,emoji) VALUES(?,?,?)').run(msg.id, user.id, body.emoji);
  const out = msgOut(msg);
  emit(memberIds(msg.chat_id), 'message_update', out);
  return { ok: true };
});
route('POST', '/api/chats/:id/read', ({ user, params, body }) => {
  const cid = int(params.id);
  needMember(cid, user.id);
  const mid = int(body.message_id);
  if (!mid) fail(400, 'bad_message');
  Q('UPDATE members SET last_read_id=MAX(last_read_id,?) WHERE chat_id=? AND user_id=?').run(mid, cid, user.id);
  emit(memberIds(cid), 'read', { chat_id: cid, user_id: user.id, message_id: mid });
  return { ok: true };
});
route('POST', '/api/chats/:id/typing', ({ user, params }) => {
  const cid = int(params.id);
  needMember(cid, user.id);
  limit('typing:' + user.id, 20, 10e3);
  emit(memberIds(cid).filter((x) => x !== user.id), 'typing', { chat_id: cid, user_id: user.id });
  return { ok: true };
});

// — files —
const INLINE_MIME = /^(image\/(png|jpeg|gif|webp)|audio\/(webm|ogg|mpeg|mp4|wav|x-m4a)|video\/(mp4|webm)|application\/pdf)(;.*)?$/i;
route('POST', '/api/upload', ({ user, req, url }) => new Promise((resolve, reject) => {
  const declared = +req.headers['content-length'];
  if (!declared || declared > MAX_UPLOAD) return reject(new HttpError(413, 'too_large'));
  limit('up:' + user.id, 30, 60e3);
  let name = 'file';
  try { name = decodeURIComponent(url.searchParams.get('name') || 'file'); } catch {}
  name = path.basename(name.replace(/[\u0000-\u001f]/g, '')).slice(0, 120) || 'file';
  const id = crypto.randomBytes(16).toString('hex');
  const mime = (req.headers['content-type'] || 'application/octet-stream').slice(0, 100);
  const target = path.join(DATA_DIR, 'uploads', id);
  const out = fs.createWriteStream(target);
  let size = 0, dead = false;
  req.on('data', (c) => {
    size += c.length;
    if (size > MAX_UPLOAD && !dead) { dead = true; out.destroy(); fs.unlink(target, () => {}); reject(new HttpError(413, 'too_large')); req.destroy(); }
  });
  req.pipe(out);
  out.on('finish', () => {
    if (dead) return;
    Q('INSERT INTO files(id,owner_id,name,mime,size,created_at) VALUES(?,?,?,?,?,?)').run(id, user.id, name, mime, size, now());
    resolve({ file: { id, name, mime, size } });
  });
  out.on('error', (e) => { if (!dead) reject(e); });
}), { raw: true });

route('GET', '/api/files/:id', ({ user, params, res }) => {
  const f = Q('SELECT * FROM files WHERE id=?').get(params.id);
  if (!f || !/^[a-f0-9]{32}$/.test(f.id)) fail(404, 'not_found');
  let ok = f.owner_id === user.id;
  if (!ok) {
    const msg = Q('SELECT chat_id FROM messages WHERE file_id=?').get(f.id);
    ok = !!(msg && memberRow(msg.chat_id, user.id));
  }
  if (!ok) fail(404, 'not_found');
  const p = path.join(DATA_DIR, 'uploads', f.id);
  if (!fs.existsSync(p)) fail(404, 'not_found');
  const inline = INLINE_MIME.test(f.mime);
  res.writeHead(200, {
    'content-type': inline ? f.mime : 'application/octet-stream',
    'content-length': f.size,
    'content-disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(f.name)}`,
    'x-content-type-options': 'nosniff',
    'content-security-policy': 'sandbox',
    'cache-control': 'private, max-age=86400',
  });
  fs.createReadStream(p).pipe(res);
  return undefined;
}, { stream: true });

// — admin —
const needAdmin = (u) => { if (u.role !== 'admin') fail(403, 'forbidden'); };
route('GET', '/api/admin/overview', ({ user }) => {
  needAdmin(user);
  return {
    max_users: MAX_USERS,
    users: Q('SELECT * FROM users ORDER BY created_at').all().map((u) => userOut(u, true)),
    allowed_emails: Q('SELECT email FROM allowed_emails ORDER BY email').all().map((r) => r.email),
    allowed_domains: ALLOWED_DOMAINS,
  };
});
route('PATCH', '/api/admin/users/:id', ({ user, params, body }) => {
  needAdmin(user);
  const id = int(params.id);
  const target = Q('SELECT * FROM users WHERE id=?').get(id);
  if (!target) fail(404, 'not_found');
  if (id === user.id) fail(400, 'cannot_edit_self');
  if (typeof body.banned === 'boolean') {
    Q('UPDATE users SET banned=? WHERE id=?').run(body.banned ? 1 : 0, id);
    if (body.banned) { Q('DELETE FROM sessions WHERE user_id=?').run(id); kick(id); }
  }
  if (body.role === 'admin' || body.role === 'user') Q('UPDATE users SET role=? WHERE id=?').run(body.role, id);
  return { user: userOut(Q('SELECT * FROM users WHERE id=?').get(id), true) };
});
route('POST', '/api/admin/allowed', ({ user, body }) => {
  needAdmin(user);
  const email = str(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) fail(400, 'bad_email');
  Q('INSERT OR IGNORE INTO allowed_emails(email) VALUES(?)').run(email);
  return { ok: true };
});
route('POST', '/api/admin/allowed/remove', ({ user, body }) => {
  needAdmin(user);
  Q('DELETE FROM allowed_emails WHERE email=?').run(str(body.email, 254).toLowerCase());
  return { ok: true };
});

route('GET', '/api/stream', ({ req, res, user }) => { openStream(req, res, user); return undefined; }, { stream: true });
route('GET', '/healthz', () => ({ ok: true }), { auth: false });

// ───────────────────────── http server ─────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};
const SEC_HEADERS = {
  'content-security-policy': "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'DENY',
  ...(IS_PROD ? { 'strict-transport-security': 'max-age=31536000' } : {}),
};

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || !path.extname(rel)) rel = '/index.html';
  const file = path.join(PUBLIC_DIR, path.normalize(rel));
  if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, SEC_HEADERS); return res.end('Not found');
  }
  const ext = path.extname(file);
  res.writeHead(200, {
    ...SEC_HEADERS,
    'content-type': MIME[ext] || 'application/octet-stream',
    'cache-control': ext === '.html' || ext === '.js' || ext === '.css' ? 'no-cache' : 'public, max-age=86400',
  });
  fs.createReadStream(file).pipe(res);
}

function readJSON(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > 1e6) { reject(new HttpError(413, 'too_large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { const v = JSON.parse(Buffer.concat(chunks).toString('utf8')); resolve(v && typeof v === 'object' ? v : {}); }
      catch { reject(new HttpError(400, 'bad_json')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const pathname = url.pathname;
  try {
    if (!pathname.startsWith('/api/') && pathname !== '/healthz') {
      if (req.method !== 'GET' && req.method !== 'HEAD') fail(405, 'method_not_allowed');
      return serveStatic(req, res, pathname);
    }
    // CSRF guard: state-changing requests must be same-origin.
    if (req.method !== 'GET' && req.headers.origin) {
      const o = new URL(req.headers.origin).host;
      if (o !== req.headers.host) fail(403, 'bad_origin');
    }
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = r.re.exec(pathname);
      if (!m) continue;
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      let user = null;
      if (r.auth !== false) { user = userFromReq(req); if (!user) fail(401, 'unauthorized'); }
      if (user && !user.name && !pathname.startsWith('/api/me') && pathname !== '/api/stream') fail(403, 'profile_incomplete');
      const body = r.raw || r.stream || req.method === 'GET' ? {} : await readJSON(req);
      const out = await r.handler({ req, res, user, params, body, url });
      if (r.stream) return undefined;
      return sendJSON(res, 200, out);
    }
    fail(404, 'not_found');
  } catch (e) {
    if (res.headersSent) return res.end();
    if (e instanceof HttpError) return sendJSON(res, e.code, { error: e.message });
    console.error(e);
    sendJSON(res, 500, { error: 'server_error' });
  }
});
server.keepAliveTimeout = 65000;
server.listen(PORT, '0.0.0.0', () => console.log(`${APP_NAME} listening on :${PORT} (data: ${DATA_DIR})`));

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => { server.close(); try { db.close(); } catch {} process.exit(0); });
}
