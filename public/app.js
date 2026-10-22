'use strict';
(() => {
  // ───────────────────────── i18n ─────────────────────────
  const I18N = {
    fa: {
      login_title: 'ورود به arsa', login_sub: 'ایمیل سازمانی خود را وارد کنید تا کد ورود برایتان ارسال شود.',
      email: 'ایمیل', send_code: 'ارسال کد', code_title: 'کد ورود را وارد کنید',
      code_sub: (e) => `کد ۶ رقمی ارسال‌شده به ${e} را وارد کنید.`, verify: 'ورود', change_email: 'تغییر ایمیل', resend: 'ارسال دوباره',
      name_title: 'نام شما چیست؟', name_sub: 'همکاران‌تان شما را با این نام می‌بینند.', name: 'نام و نام خانوادگی', continue: 'ادامه',
      search: 'جستجو', new_chat: 'گفتگوی جدید', tab_dm: 'پیام', tab_group: 'گروه', tab_channel: 'کانال',
      group_name: 'نام گروه', channel_name: 'نام کانال', create: 'ایجاد', close: 'بستن', no_users: 'کاربری پیدا نشد.',
      no_chats: 'هنوز گفتگویی ندارید. با دکمه‌ی گفتگوی جدید شروع کنید.', pick_chat: 'یک گفتگو را انتخاب کنید',
      pick_chat_sub: 'پیام‌های شما فقط بین اعضای arsa می‌ماند.', type_message: 'پیام', online: 'آنلاین',
      last_seen: (x) => `آخرین بازدید ${x}`, typing: 'در حال نوشتن…', members: (n) => `${n} عضو`, you: 'شما',
      today: 'امروز', yesterday: 'دیروز', reply: 'پاسخ', edit: 'ویرایش', copy: 'کپی', delete: 'حذف', edited: 'ویرایش‌شده',
      deleted: 'این پیام حذف شد', confirm_delete: 'این پیام حذف شود؟', editing: 'ویرایش پیام', photo: 'تصویر', voice: 'پیام صوتی',
      file: 'فایل', load_earlier: 'پیام‌های قدیمی‌تر', channel_ro: 'فقط مدیران کانال می‌توانند پیام بگذارند.',
      settings: 'تنظیمات', language: 'زبان', logout: 'خروج', save: 'ذخیره', notifications: 'اعلان‌ها', enable: 'فعال‌سازی',
      enabled: 'فعال است', admin_panel: 'پنل مدیریت', add_members: 'افزودن عضو', leave: 'ترک گفتگو', add: 'افزودن', owner: 'مالک',
      admin: 'مدیر', users_count: (n, m) => `${n} از ${m} کاربر`, allowed_emails: 'ایمیل‌های مجاز', allowed_domains: 'دامنه‌های مجاز',
      none: 'هیچ', ban: 'مسدود کردن', unban: 'رفع مسدودی', make_admin: 'ارتقا به مدیر', make_user: 'تنزل به کاربر', banned: 'مسدود',
      remove: 'حذف', uploading: 'در حال ارسال فایل…', mic_denied: 'دسترسی به میکروفن داده نشد.', copied: 'کپی شد', saved: 'ذخیره شد',
      info: 'اطلاعات', channel: 'کانال', group: 'گروه', admin_invite: 'ایمیل مجاز جدید', not_in_chat: 'عضو نیستید',
      e_bad_email: 'ایمیل معتبر نیست.', e_not_allowed: 'این ایمیل اجازه‌ی ورود ندارد. با مدیر arsa تماس بگیرید.',
      e_banned: 'حساب شما مسدود شده است.', e_rate_limited: 'درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.',
      e_bad_code: 'کد اشتباه است.', e_code_expired: 'کد منقضی شده است؛ کد جدید بگیرید.', e_too_many_attempts: 'تلاش‌های زیاد؛ کد جدید بگیرید.',
      e_full: 'ظرفیت کاربران arsa تکمیل است.', e_too_large: 'حجم فایل بیش از حد مجاز است.', e_channel_readonly: 'فقط مدیران کانال می‌توانند پیام بگذارند.',
      e_forbidden: 'اجازه‌ی این کار را ندارید.', e_server_error: 'خطای سرور؛ دوباره تلاش کنید.', e_net: 'اتصال برقرار نشد.', e_bad_name: 'نام را وارد کنید.',
    },
    en: {
      login_title: 'Sign in to arsa', login_sub: 'Enter your work email and we’ll send you a login code.',
      email: 'Email', send_code: 'Send code', code_title: 'Enter your login code',
      code_sub: (e) => `Enter the 6-digit code sent to ${e}.`, verify: 'Sign in', change_email: 'Use another email', resend: 'Resend code',
      name_title: 'What’s your name?', name_sub: 'This is how your colleagues will see you.', name: 'Full name', continue: 'Continue',
      search: 'Search', new_chat: 'New chat', tab_dm: 'Message', tab_group: 'Group', tab_channel: 'Channel',
      group_name: 'Group name', channel_name: 'Channel name', create: 'Create', close: 'Close', no_users: 'No users found.',
      no_chats: 'No conversations yet. Start one with the new chat button.', pick_chat: 'Select a conversation',
      pick_chat_sub: 'Your messages stay inside arsa.', type_message: 'Message', online: 'online',
      last_seen: (x) => `last seen ${x}`, typing: 'typing…', members: (n) => `${n} members`, you: 'You',
      today: 'Today', yesterday: 'Yesterday', reply: 'Reply', edit: 'Edit', copy: 'Copy', delete: 'Delete', edited: 'edited',
      deleted: 'This message was deleted', confirm_delete: 'Delete this message?', editing: 'Editing message', photo: 'Photo', voice: 'Voice message',
      file: 'File', load_earlier: 'Earlier messages', channel_ro: 'Only channel admins can post.',
      settings: 'Settings', language: 'Language', logout: 'Sign out', save: 'Save', notifications: 'Notifications', enable: 'Enable',
      enabled: 'Enabled', admin_panel: 'Admin panel', add_members: 'Add members', leave: 'Leave', add: 'Add', owner: 'Owner',
      admin: 'Admin', users_count: (n, m) => `${n} of ${m} users`, allowed_emails: 'Allowed emails', allowed_domains: 'Allowed domains',
      none: 'None', ban: 'Ban', unban: 'Unban', make_admin: 'Make admin', make_user: 'Make user', banned: 'banned',
      remove: 'Remove', uploading: 'Uploading…', mic_denied: 'Microphone access was denied.', copied: 'Copied', saved: 'Saved',
      info: 'Info', channel: 'Channel', group: 'Group', admin_invite: 'New allowed email', not_in_chat: 'Not a member',
      e_bad_email: 'That email address is not valid.', e_not_allowed: 'This email is not allowed to sign in. Contact your arsa admin.',
      e_banned: 'Your account has been suspended.', e_rate_limited: 'Too many requests. Try again in a moment.',
      e_bad_code: 'Wrong code.', e_code_expired: 'The code has expired. Request a new one.', e_too_many_attempts: 'Too many attempts. Request a new code.',
      e_full: 'arsa has reached its user limit.', e_too_large: 'That file is too large.', e_channel_readonly: 'Only channel admins can post.',
      e_forbidden: 'You are not allowed to do that.', e_server_error: 'Server error. Please try again.', e_net: 'Could not connect.', e_bad_name: 'Please enter your name.',
    },
  };
  let lang = localStorage.getItem('arsa_lang') || 'fa';
  const t = (k, ...a) => { const v = I18N[lang][k] ?? I18N.en[k] ?? k; return typeof v === 'function' ? v(...a) : v; };
  const loc = () => (lang === 'fa' ? 'fa-IR' : 'en-GB');
  function applyLang() { document.documentElement.lang = lang; document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'; localStorage.setItem('arsa_lang', lang); }

  // ───────────────────────── tiny DOM helpers ─────────────────────────
  const h = (tag, props, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') e.className = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const x of kids.flat(Infinity)) if (x != null && x !== false) e.append(x.nodeType ? x : document.createTextNode(String(x)));
    return e;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    back: 'M15 18l-6-6 6-6', send: 'M22 2L11 13|M22 2l-7 20-4-9-9-4z', x: 'M18 6L6 18|M6 6l12 12', menu: 'M4 6h16|M4 12h16|M4 18h16',
    clip: 'M21 12.5l-8.6 8.6a5.5 5.5 0 01-7.8-7.8l9-9a3.7 3.7 0 015.2 5.2l-9 9a1.8 1.8 0 01-2.6-2.6l8.4-8.4',
    mic: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z|M19 11a7 7 0 01-14 0|M12 18v3', pen: 'M12 20h9|M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
    file: 'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z|M14 3v5h5', check: 'M5 12l5 5L20 7',
  };
  const icon = (n) => {
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    for (const d of ICONS[n].split('|')) { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); s.append(p); }
    return s;
  };
  const iconBtn = (n, label, onclick, cls = '') => h('button', { class: 'icon-btn ' + cls, 'aria-label': label, title: label, onclick }, icon(n));

  // ───────────────────────── state & api ─────────────────────────
  const S = {
    me: null, config: null, users: new Map(), chats: new Map(), msgs: new Map(), hasMore: new Map(),
    active: null, typing: new Map(), online: new Set(), reply: null, editing: null, search: '', es: null, drafts: new Map(), connectedOnce: false,
  };
  const R = {}; // live DOM refs for the shell

  async function api(path, { method = 'GET', body } = {}) {
    let r;
    try { r = await fetch('/api' + path, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined }); }
    catch { throw Object.assign(new Error('net'), { code: 'net' }); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.error || 'error'), { status: r.status, code: j.error || 'server_error' });
    return j;
  }
  const errText = (e) => { const k = 'e_' + (e.code || 'server_error'); return I18N[lang][k] || t('e_server_error'); };
  function toast(msg) { const el = h('div', { class: 'toast', role: 'status' }, msg); document.body.append(el); setTimeout(() => el.remove(), 2600); }
  const safe = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { if (e.status === 401) return renderLogin(); toast(errText(e)); } };

  // ───────────────────────── formatting ─────────────────────────
  const COLORS = ['#22408f', '#0fa3a0', '#7a3e9d', '#b8612d', '#2f7d4f', '#b03a5b', '#3a6ea5', '#8a6d1f'];
  const userName = (id) => (S.users.get(id) || {}).name || '…';
  const isOnline = (id) => S.online.has(id);
  const peerId = (c) => (c.members.find((m) => m.user_id !== S.me.id) || {}).user_id;
  const chatTitle = (c) => (c.type === 'dm' ? userName(peerId(c)) : c.title);
  const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
  const fmtTime = (ts) => new Date(ts).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' });
  const fmtDay = (ts) => {
    const n = Date.now(); if (sameDay(ts, n)) return t('today'); if (sameDay(ts, n - 864e5)) return t('yesterday');
    const d = new Date(ts); return d.toLocaleDateString(loc(), { day: 'numeric', month: 'long', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
  };
  const fmtShort = (ts) => (sameDay(ts, Date.now()) ? fmtTime(ts) : new Date(ts).toLocaleDateString(loc(), { day: 'numeric', month: 'short' }));
  const fmtSize = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
  function avatar(name, id, { sm, dot } = {}) {
    const a = h('div', { class: 'avatar' + (sm ? ' sm' : '') }, (name || '?').trim().slice(0, 1).toUpperCase());
    a.style.background = COLORS[Math.abs(id) % COLORS.length];
    if (dot) a.append(h('i', { class: 'dot' }));
    return a;
  }
  function linkify(text) {
    const out = []; const re = /https?:\/\/[^\s<]+[^\s<.,;:!?)"'»]/g; let i = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > i) out.push(text.slice(i, m.index));
      out.push(h('a', { href: m[0], target: '_blank', rel: 'noopener noreferrer' }, m[0])); i = m.index + m[0].length;
    }
    if (i < text.length) out.push(text.slice(i));
    return out;
  }
  function previewText(m) {
    if (!m) return '';
    if (m.deleted) return t('deleted');
    if (m.file) { const k = m.file.mime.startsWith('image/') ? '🖼 ' + t('photo') : m.file.mime.startsWith('audio/') ? '🎤 ' + t('voice') : '📎 ' + m.file.name; return m.body ? k + ' · ' + m.body : k; }
    return m.body;
  }
  const typingIn = (c) => [...S.typing].filter(([k, exp]) => exp > Date.now() && k.startsWith(c.id + ':')).map(([k]) => +k.split(':')[1]);
  const readByOthers = (c, m) => c.members.some((x) => x.user_id !== S.me.id && x.last_read_id >= m.id);
  const totalUnread = () => [...S.chats.values()].reduce((n, c) => n + c.unread, 0);

  // ───────────────────────── modal / popover ─────────────────────────
  function modal(title, ...body) {
    const close = () => scrim.remove();
    const scrim = h('div', { class: 'scrim', onclick: (e) => { if (e.target === scrim) close(); } },
      h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' },
        h('div', { class: 'modal-head' }, h('h2', {}, title), iconBtn('x', t('close'), close)),
        h('div', { class: 'modal-body' }, body)));
    document.body.append(scrim);
    return { close, el: scrim };
  }
  let popEl = null;
  function closePop() { if (popEl) { popEl.remove(); popEl = null; } }
  function openPop(x, y, content) {
    closePop();
    popEl = h('div', { class: 'pop', role: 'menu' }, content);
    document.body.append(popEl);
    const r = popEl.getBoundingClientRect();
    popEl.style.left = Math.max(8, Math.min(x, innerWidth - r.width - 8)) + 'px';
    popEl.style.top = Math.max(8, Math.min(y, innerHeight - r.height - 8)) + 'px';
  }
  document.addEventListener('click', (e) => { if (popEl && !popEl.contains(e.target) && !e.target.closest('.bubble')) closePop(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (popEl) return closePop();
    const scrims = document.querySelectorAll('.scrim'); if (scrims.length) return scrims[scrims.length - 1].remove();
    if (S.reply || S.editing) { S.reply = S.editing = null; renderComposer(); }
  });

  // ───────────────────────── login ─────────────────────────
  function langToggle() {
    return h('div', { class: 'seg' },
      ['fa', 'en'].map((l) => h('button', { class: lang === l ? 'on' : '', onclick: () => { lang = l; applyLang(); S.me ? renderShell() : renderLogin(); } }, l === 'fa' ? 'فارسی' : 'English')));
  }
  function loginFrame(...content) {
    const app = document.getElementById('app'); app.replaceChildren(
      h('div', { class: 'login' }, h('div', { class: 'login-card' },
        h('div', { class: 'brand' }, h('img', { src: '/icon.svg', alt: '' }), h('b', {}, 'arsa')), content)));
  }
  function renderLogin(step = 'email', email = '') {
    S.me = null; if (S.es) { S.es.close(); S.es = null; } applyLang();
    if (step === 'email') {
      const err = h('div', { class: 'err', role: 'alert' });
      const inp = h('input', { class: 'field', type: 'email', autocomplete: 'email', inputmode: 'email', placeholder: 'name@company.com', required: true, dir: 'ltr', value: email });
      const btn = h('button', { class: 'btn', type: 'submit' }, t('send_code'));
      const form = h('form', { onsubmit: async (e) => {
        e.preventDefault(); err.textContent = ''; btn.disabled = true;
        try { await api('/auth/request', { method: 'POST', body: { email: inp.value } }); renderLogin('code', inp.value.trim().toLowerCase()); }
        catch (x) { err.textContent = errText(x); btn.disabled = false; }
      } }, h('div', {}, h('label', { class: 'lbl' }, t('email')), inp), err, btn);
      loginFrame(h('h1', {}, t('login_title')), h('p', { class: 'sub' }, t('login_sub')), form, h('div', { class: 'login-foot' }, langToggle()));
      inp.focus();
    } else if (step === 'code') {
      const err = h('div', { class: 'err', role: 'alert' });
      const inp = h('input', { class: 'field code-input', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 6, placeholder: '······', required: true });
      const btn = h('button', { class: 'btn', type: 'submit' }, t('verify'));
      const go = async () => {
        err.textContent = ''; btn.disabled = true;
        try {
          const r = await api('/auth/verify', { method: 'POST', body: { email, code: inp.value } });
          S.me = r.user; S.me.name ? start() : renderName();
        } catch (x) { err.textContent = errText(x); btn.disabled = false; inp.select(); }
      };
      inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 6); if (inp.value.length === 6) go(); });
      const form = h('form', { onsubmit: (e) => { e.preventDefault(); go(); } }, inp, err, btn);
      loginFrame(h('h1', {}, t('code_title')), h('p', { class: 'sub' }, t('code_sub', email)), form,
        h('div', { class: 'login-foot' },
          h('button', { class: 'btn ghost small', onclick: () => renderLogin('email', email) }, t('change_email')),
          h('button', { class: 'btn ghost small', onclick: safe(async () => { await api('/auth/request', { method: 'POST', body: { email } }); toast(t('resend')); }) }, t('resend'))));
      inp.focus();
    }
  }
  function renderName() {
    const err = h('div', { class: 'err', role: 'alert' });
    const inp = h('input', { class: 'field', autocomplete: 'name', maxlength: 60, required: true, value: S.me.name || '' });
    const btn = h('button', { class: 'btn', type: 'submit' }, t('continue'));
    const form = h('form', { onsubmit: async (e) => {
      e.preventDefault(); err.textContent = ''; btn.disabled = true;
      try { const r = await api('/me', { method: 'PATCH', body: { name: inp.value } }); S.me = r.user; start(); }
      catch (x) { err.textContent = errText(x); btn.disabled = false; }
    } }, h('div', {}, h('label', { class: 'lbl' }, t('name')), inp), err, btn);
    loginFrame(h('h1', {}, t('name_title')), h('p', { class: 'sub' }, t('name_sub')), form);
    inp.focus();
  }

  // ───────────────────────── boot ─────────────────────────
  async function start() {
    try {
      const [u, c, me] = await Promise.all([api('/users'), api('/chats'), api('/me')]);
      S.me = me.user; S.config = me.config;
      S.users = new Map(u.users.map((x) => [x.id, x])); S.users.set(S.me.id, S.me);
      S.chats = new Map(c.chats.map((x) => [x.id, x]));
    } catch (e) { if (e.status === 401) return renderLogin(); toast(errText(e)); return; }
    renderShell(); connect();
    const id = +location.hash.slice(1); if (id && S.chats.has(id)) selectChat(id);
  }
  async function boot() {
    applyLang();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    try {
      const r = await api('/me'); S.me = r.user; S.config = r.config;
      S.me.name ? start() : renderName();
    } catch (e) { e.status === 401 ? renderLogin() : (renderLogin(), toast(errText(e))); }
  }

  // ───────────────────────── realtime ─────────────────────────
  function connect() {
    if (S.es) S.es.close();
    const es = new EventSource('/api/stream'); S.es = es;
    const on = (name, fn) => es.addEventListener(name, (e) => { try { fn(JSON.parse(e.data)); } catch (x) { console.error(x); } });
    on('hello', (d) => { S.online = new Set(d.online); if (S.connectedOnce) sync(); S.connectedOnce = true; renderSide(); renderHead(); });
    on('presence', (d) => {
      d.online ? S.online.add(d.user_id) : S.online.delete(d.user_id);
      const u = S.users.get(d.user_id); if (u && d.last_seen) u.last_seen = d.last_seen;
      renderSide(); renderHead();
    });
    on('user', (u) => { S.users.set(u.id, { ...(S.users.get(u.id) || {}), ...u }); renderSide(); renderHead(); renderMsgs(); });
    on('chat', (c) => { const old = S.chats.get(c.id); if (old && S.active === c.id) c.unread = 0; S.chats.set(c.id, c); renderSide(); if (S.active === c.id) { renderHead(); renderComposer(); } });
    on('chat_removed', (d) => { S.chats.delete(d.id); S.msgs.delete(d.id); if (S.active === d.id) selectChat(null); renderSide(); });
    on('message', onMessage);
    on('message_update', (m) => {
      const list = S.msgs.get(m.chat_id); if (list) { const i = list.findIndex((x) => x.id === m.id); if (i >= 0) list[i] = m; }
      const c = S.chats.get(m.chat_id); if (c && c.last && c.last.id === m.id) c.last = m;
      if (S.active === m.chat_id) renderMsgs(); renderSide();
    });
    on('read', (d) => {
      const c = S.chats.get(d.chat_id); if (!c) return;
      const mem = c.members.find((x) => x.user_id === d.user_id); if (mem) mem.last_read_id = Math.max(mem.last_read_id, d.message_id);
      if (d.user_id === S.me.id && c.last && d.message_id >= c.last.id) c.unread = 0;
      renderSide(); if (S.active === d.chat_id) renderMsgs();
    });
    on('typing', (d) => {
      S.typing.set(d.chat_id + ':' + d.user_id, Date.now() + 4000);
      renderSide(); renderHead(); setTimeout(() => { renderSide(); renderHead(); }, 4100);
    });
    es.onerror = async () => {
      if (es.readyState !== 2) return;
      try { await api('/me'); setTimeout(connect, 3000); } catch (e) { if (e.status === 401) renderLogin(); else setTimeout(connect, 5000); }
    };
  }
  async function sync() {
    try {
      const c = await api('/chats'); S.chats = new Map(c.chats.map((x) => [x.id, x]));
      if (S.active && S.chats.has(S.active)) { const r = await api(`/chats/${S.active}/messages`); S.msgs.set(S.active, r.messages); S.hasMore.set(S.active, r.has_more); markRead(); }
      renderSide(); renderHead(); renderMsgs();
    } catch { /* will retry on next hello */ }
  }
  async function onMessage(m) {
    if (!S.users.has(m.sender_id)) { try { const u = await api('/users'); S.users = new Map(u.users.map((x) => [x.id, x])); } catch {} }
    let c = S.chats.get(m.chat_id);
    if (!c) { try { await sync(); } catch {} c = S.chats.get(m.chat_id); if (!c) return; }
    addMessage(m);
    S.typing.delete(m.chat_id + ':' + m.sender_id);
    const mine = m.sender_id === S.me.id;
    const watching = S.active === m.chat_id && !document.hidden;
    if (!mine) { if (watching) { c.unread = 0; markRead(); } else { c.unread += 1; notify(c, m); } }
    renderSide(); if (S.active === m.chat_id) renderMsgs({ stick: mine || nearBottom() });
  }
  function addMessage(m) {
    const list = S.msgs.get(m.chat_id);
    if (list && !list.some((x) => x.id === m.id)) { list.push(m); list.sort((a, b) => a.id - b.id); }
    const c = S.chats.get(m.chat_id); if (c && (!c.last || m.id >= c.last.id)) c.last = m;
  }
  function notify(c, m) {
    document.title = (totalUnread() ? `(${totalUnread()}) ` : '') + 'arsa';
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const n = new Notification(chatTitle(c), { body: `${userName(m.sender_id)}: ${previewText(m)}`, icon: '/icon.svg', tag: 'chat' + c.id });
    n.onclick = () => { window.focus(); selectChat(c.id); n.close(); };
  }

  // ───────────────────────── shell ─────────────────────────
  function renderShell() {
    applyLang();
    R.list = h('div', { class: 'chat-list', role: 'list' });
    R.search = h('input', { class: 'search', type: 'search', placeholder: t('search'), 'aria-label': t('search'), oninput: (e) => { S.search = e.target.value; renderSide(); } });
    R.head = h('div', { class: 'chat-head' });
    R.msgs = h('div', { class: 'msgs', onscroll: closePop });
    R.composer = h('div');
    R.main = h('section', { class: 'main' });
    R.shell = h('div', { class: 'shell' },
      h('aside', { class: 'side' },
        h('div', { class: 'side-top' }, h('img', { class: 'logo', src: '/icon.svg', alt: 'arsa' }), R.search,
          iconBtn('pen', t('new_chat'), openNewChat), iconBtn('menu', t('settings'), openSettings)),
        R.list),
      R.main);
    document.getElementById('app').replaceChildren(R.shell);
    renderSide(); selectChat(S.active, true);
  }

  function renderSide() {
    if (!R.list) return;
    const term = S.search.trim().toLowerCase();
    let chats = [...S.chats.values()].sort((a, b) => (b.last ? b.last.id : 0) - (a.last ? a.last.id : 0) || b.id - a.id);
    if (term) chats = chats.filter((c) => chatTitle(c).toLowerCase().includes(term));
    const nodes = chats.map((c) => {
      const title = chatTitle(c); const peer = c.type === 'dm' ? peerId(c) : null;
      const typers = typingIn(c);
      let prev = '';
      if (typers.length) prev = t('typing');
      else if (c.last) {
        const who = c.last.sender_id === S.me.id ? t('you') + ': ' : c.type !== 'dm' ? userName(c.last.sender_id).split(' ')[0] + ': ' : '';
        prev = who + previewText(c.last);
      }
      return h('button', { class: 'chat-item' + (S.active === c.id ? ' active' : ''), role: 'listitem', onclick: () => selectChat(c.id) },
        avatar(title, peer || c.id, { dot: peer && isOnline(peer) }),
        h('div', { class: 'mid' },
          h('div', { class: 'row' }, h('span', { class: 'name' }, (c.type === 'channel' ? '📢 ' : '') + title), c.last && h('span', { class: 'meta' }, fmtShort(c.last.created_at))),
          h('div', { class: 'row' }, h('span', { class: 'prev' + (typers.length ? ' typing' : '') }, prev), c.unread > 0 && h('span', { class: 'badge' }, c.unread > 99 ? '99+' : c.unread))));
    });
    if (term) {
      const people = [...S.users.values()].filter((u) => u.id !== S.me.id && u.name.toLowerCase().includes(term) && ![...S.chats.values()].some((c) => c.type === 'dm' && peerId(c) === u.id));
      for (const u of people) nodes.push(h('button', { class: 'chat-item', onclick: safe(() => startDm(u.id)) }, avatar(u.name, u.id, { dot: isOnline(u.id) }), h('div', { class: 'mid' }, h('div', { class: 'name' }, u.name), h('div', { class: 'prev' }, u.email))));
    }
    R.list.replaceChildren(...(nodes.length ? nodes : [h('div', { class: 'empty' }, t('no_chats'))]));
    const n = totalUnread(); document.title = (n ? `(${n}) ` : '') + 'arsa';
  }

  function selectChat(id, silent) {
    S.active = id; S.reply = S.editing = null;
    if (!silent) { const want = id ? '#' + id : ''; if (location.hash !== want) history.pushState(null, '', want || location.pathname); }
    R.shell.classList.toggle('chat-open', !!id);
    renderSide();
    if (!id || !S.chats.has(id)) { S.active = null; R.shell.classList.remove('chat-open'); R.main.replaceChildren(h('div', { class: 'main-empty' }, h('div', {}, h('img', { src: '/icon.svg', alt: '' }), h('h2', {}, t('pick_chat')), h('p', {}, t('pick_chat_sub'))))); return; }
    R.main.replaceChildren(R.head, R.msgs, R.composer);
    renderHead(); renderComposer(); R.msgs.replaceChildren();
    loadMessages(id);
  }
  window.addEventListener('popstate', () => { const id = +location.hash.slice(1) || null; if (R.shell && id !== S.active) selectChat(id && S.chats.has(id) ? id : null, true); });

  const loadMessages = safe(async (id) => {
    if (!S.msgs.has(id)) { const r = await api(`/chats/${id}/messages`); S.msgs.set(id, r.messages); S.hasMore.set(id, r.has_more); }
    if (S.active !== id) return;
    renderMsgs({ stick: true }); markRead();
  });
  const loadEarlier = safe(async () => {
    const id = S.active, list = S.msgs.get(id); if (!list || !list.length) return;
    const r = await api(`/chats/${id}/messages?before=${list[0].id}`);
    S.msgs.set(id, [...r.messages, ...list]); S.hasMore.set(id, r.has_more);
    const prevH = R.msgs.scrollHeight; renderMsgs(); R.msgs.scrollTop = R.msgs.scrollHeight - prevH;
  });
  const startDm = safe(async (uid) => {
    const r = await api('/chats', { method: 'POST', body: { type: 'dm', user_id: uid } });
    S.chats.set(r.chat.id, r.chat); S.search = ''; if (R.search) R.search.value = ''; selectChat(r.chat.id);
  });
  function markRead() {
    const c = S.chats.get(S.active); if (!c || document.hidden || !c.last) return;
    const me = c.members.find((m) => m.user_id === S.me.id);
    if (me && me.last_read_id >= c.last.id && c.unread === 0) return;
    if (me) me.last_read_id = c.last.id; c.unread = 0; renderSide();
    api(`/chats/${c.id}/read`, { method: 'POST', body: { message_id: c.last.id } }).catch(() => {});
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) markRead(); });
  window.addEventListener('focus', markRead);

  // ───────────────────────── header ─────────────────────────
  function subtitle(c) {
    const typers = typingIn(c);
    if (typers.length) return { text: c.type === 'dm' ? t('typing') : typers.map(userName).join(', ') + ' · ' + t('typing'), live: true };
    if (c.type === 'dm') {
      const id = peerId(c); const u = S.users.get(id);
      if (isOnline(id)) return { text: t('online'), live: true };
      return { text: u && u.last_seen ? t('last_seen', fmtShort(u.last_seen)) : '', live: false };
    }
    return { text: (c.type === 'channel' ? t('channel') + ' · ' : '') + t('members', c.members.length), live: false };
  }
  function renderHead() {
    const c = S.chats.get(S.active); if (!c || !R.head) return;
    const peer = c.type === 'dm' ? peerId(c) : null; const sub = subtitle(c);
    R.head.replaceChildren(
      iconBtn('back', 'Back', () => selectChat(null), 'back'),
      h('button', { class: 'chat-item', style: 'padding:0;width:auto;flex:1;min-width:0', onclick: () => openInfo(c) },
        avatar(chatTitle(c), peer || c.id, { dot: peer && isOnline(peer) }),
        h('div', { class: 'who' }, h('b', {}, chatTitle(c)), h('span', { class: sub.live ? 'live' : '' }, sub.text))));
  }

  // ───────────────────────── messages ─────────────────────────
  const nearBottom = () => !R.msgs || R.msgs.scrollHeight - R.msgs.scrollTop - R.msgs.clientHeight < 140;
  function renderMsgs({ stick } = {}) {
    const c = S.chats.get(S.active), list = S.msgs.get(S.active); if (!c || !list || !R.msgs) return;
    const keep = R.msgs.scrollTop, wasBottom = nearBottom();
    const nodes = [];
    if (S.hasMore.get(c.id)) nodes.push(h('button', { class: 'btn ghost small more', onclick: loadEarlier }, t('load_earlier')));
    list.forEach((m, i) => {
      const prev = list[i - 1];
      if (!prev || !sameDay(prev.created_at, m.created_at)) nodes.push(h('div', { class: 'day' }, fmtDay(m.created_at)));
      nodes.push(msgNode(m, c, prev));
    });
    R.msgs.replaceChildren(...nodes);
    R.msgs.scrollTop = stick || wasBottom ? R.msgs.scrollHeight : keep;
  }
  function fileView(f) {
    const url = `/api/files/${f.id}`;
    if (/^image\/(png|jpeg|gif|webp)/.test(f.mime)) return h('a', { href: url, target: '_blank', rel: 'noopener' }, h('img', { class: 'pic', src: url, alt: f.name, loading: 'lazy' }));
    if (/^audio\//.test(f.mime)) return h('audio', { controls: true, preload: 'none', src: url });
    if (/^video\/(mp4|webm)/.test(f.mime)) return h('video', { controls: true, preload: 'metadata', src: url });
    return h('a', { class: 'file-chip', href: url, download: f.name }, h('span', { class: 'ic' }, icon('file')), h('span', {}, f.name, h('small', {}, fmtSize(f.size))));
  }
  function msgNode(m, c, prev) {
    const own = m.sender_id === S.me.id;
    const b = h('div', { class: 'bubble', onclick: (e) => { if (e.target.closest('a,audio,video,.reply-q,.react')) return; openMenu(e, m, c); } });
    const firstOfRun = !prev || prev.sender_id !== m.sender_id || !sameDay(prev.created_at, m.created_at);
    if (!own && c.type !== 'dm' && firstOfRun) b.append(h('div', { class: 'sender' }, userName(m.sender_id)));
    if (m.reply) {
      b.append(h('div', { class: 'reply-q', onclick: () => jumpTo(m.reply.id) },
        h('b', {}, userName(m.reply.sender_id)),
        h('span', {}, m.reply.deleted ? t('deleted') : m.reply.body || (m.reply.has_file ? '📎 ' + t('file') : ''))));
    }
    if (m.deleted) b.append(h('div', { class: 'text deleted-text' }, t('deleted')));
    else {
      if (m.file) b.append(fileView(m.file));
      if (m.body) b.append(h('div', { class: 'text' }, linkify(m.body)));
    }
    const foot = h('div', { class: 'foot' }, m.edited_at && !m.deleted && h('span', {}, t('edited')), h('span', {}, fmtTime(m.created_at)));
    if (own && c.type !== 'channel' && !m.deleted) { const seen = readByOthers(c, m); foot.append(h('span', { class: 'ticks' + (seen ? ' seen' : '') }, seen ? '✓✓' : '✓')); }
    b.append(foot);
    if (m.reactions.length) {
      b.append(h('div', { class: 'reacts' }, m.reactions.map((r) => h('button', { class: 'react' + (r.user_ids.includes(S.me.id) ? ' mine' : ''), title: r.user_ids.map(userName).join(', '), onclick: () => react(m, r.emoji) }, r.emoji + (r.user_ids.length > 1 ? ' ' + r.user_ids.length : '')))));
    }
    return h('div', { class: 'msg ' + (own ? 'own' : 'other'), 'data-id': m.id }, b);
  }
  function jumpTo(id) {
    const el = R.msgs.querySelector(`[data-id="${id}"] .bubble`); if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.style.outline = '2px solid var(--turq)'; setTimeout(() => { el.style.outline = ''; }, 1400);
  }
  const react = safe((m, emoji) => api(`/messages/${m.id}/react`, { method: 'POST', body: { emoji } }));
  function openMenu(e, m, c) {
    if (m.deleted) return;
    const me = c.members.find((x) => x.user_id === S.me.id);
    const manage = me && (me.role === 'owner' || me.role === 'admin') || S.me.role === 'admin';
    const canPost = !(c.type === 'channel' && me && me.role === 'member');
    const own = m.sender_id === S.me.id;
    const items = [];
    if (canPost) items.push(h('button', { class: 'item', onclick: () => { closePop(); S.reply = m; S.editing = null; renderComposer(true); } }, t('reply')));
    if (m.body) items.push(h('button', { class: 'item', onclick: () => { closePop(); navigator.clipboard.writeText(m.body).then(() => toast(t('copied'))).catch(() => {}); } }, t('copy')));
    if (own && (m.body || !m.file)) items.push(h('button', { class: 'item', onclick: () => { closePop(); S.editing = m; S.reply = null; renderComposer(true); } }, t('edit')));
    if (own || manage) items.push(h('button', { class: 'item danger', onclick: safe(async () => { closePop(); if (confirm(t('confirm_delete'))) await api(`/messages/${m.id}`, { method: 'DELETE' }); }) }, t('delete')));
    openPop(e.clientX, e.clientY, [
      h('div', { class: 'emojis' }, S.config.emoji.map((em) => h('button', { 'aria-label': em, onclick: () => { closePop(); react(m, em); } }, em))), items]);
  }

  // ───────────────────────── composer ─────────────────────────
  let rec = null;
  function renderComposer(focus) {
    const c = S.chats.get(S.active); if (!c || !R.composer) return;
    const me = c.members.find((x) => x.user_id === S.me.id);
    if (c.type === 'channel' && me && me.role === 'member') { R.composer.replaceChildren(h('div', { class: 'ro' }, t('channel_ro'))); return; }
    const ctxMsg = S.editing || S.reply;
    const ta = h('textarea', { rows: 1, placeholder: t('type_message'), 'aria-label': t('type_message'), enterkeyhint: 'send' });
    ta.value = S.editing ? S.editing.body : S.drafts.get(c.id) || '';
    const fileInput = h('input', { type: 'file', class: 'hidden', onchange: () => { if (fileInput.files[0]) sendFile(fileInput.files[0], ta.value); fileInput.value = ''; } });
    const sendBtn = iconBtn('send', 'Send', doSend, 'send hidden');
    const micBtn = iconBtn('mic', t('voice'), startRec, '');
    const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'; const has = ta.value.trim().length > 0; sendBtn.classList.toggle('hidden', !has); micBtn.classList.toggle('hidden', has || !!S.editing); };
    let lastTyping = 0;
    ta.addEventListener('input', () => {
      grow(); if (!S.editing) S.drafts.set(c.id, ta.value);
      if (Date.now() - lastTyping > 3000 && ta.value) { lastTyping = Date.now(); api(`/chats/${c.id}/typing`, { method: 'POST' }).catch(() => {}); }
    });
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !matchMedia('(pointer:coarse)').matches) { e.preventDefault(); doSend(); } });
    ta.addEventListener('paste', (e) => { const f = [...(e.clipboardData ? e.clipboardData.files : [])][0]; if (f) { e.preventDefault(); sendFile(f, ta.value); } });
    async function doSend() {
      const body = ta.value.trim(); if (!body) return;
      try {
        if (S.editing) { await api(`/messages/${S.editing.id}`, { method: 'PATCH', body: { body } }); S.editing = null; renderComposer(true); return; }
        const reply = S.reply; S.reply = null; S.drafts.delete(c.id); ta.value = ''; grow();
        const r = await api(`/chats/${c.id}/messages`, { method: 'POST', body: { body, reply_to: reply ? reply.id : undefined } });
        addMessage(r.message); renderSide(); renderMsgs({ stick: true }); renderComposer(true);
      } catch (e) { if (e.status === 401) return renderLogin(); toast(errText(e)); }
    }
    R.composer.replaceChildren(h('div', { class: 'composer' },
      ctxMsg && h('div', { class: 'ctx' }, h('div', { class: 'bar' }),
        h('div', { class: 't' }, h('b', {}, S.editing ? t('editing') : userName(ctxMsg.sender_id)), h('span', {}, previewText(ctxMsg))),
        iconBtn('x', t('close'), () => { S.reply = S.editing = null; renderComposer(true); })),
      h('div', { class: 'comp-row' }, iconBtn('clip', t('file'), () => fileInput.click()), fileInput, ta, micBtn, sendBtn)));
    grow(); if (focus || !matchMedia('(pointer:coarse)').matches) ta.focus();
  }
  const sendFile = safe(async (file, caption) => {
    const c = S.chats.get(S.active); if (!c) return;
    if (file.size > S.config.max_upload_mb * 1048576) return toast(t('e_too_large'));
    toast(t('uploading'));
    const r = await fetch('/api/upload?name=' + encodeURIComponent(file.name || 'file'), { method: 'POST', headers: { 'content-type': file.type || 'application/octet-stream' }, body: file });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw Object.assign(new Error(j.error), { code: j.error, status: r.status });
    const reply = S.reply; S.reply = null; S.drafts.delete(c.id);
    const m = await api(`/chats/${c.id}/messages`, { method: 'POST', body: { body: (caption || '').trim(), file_id: j.file.id, reply_to: reply ? reply.id : undefined } });
    addMessage(m.message); renderSide(); renderMsgs({ stick: true }); renderComposer(true);
  });
  async function startRec() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((x) => window.MediaRecorder && MediaRecorder.isTypeSupported(x)) || '';
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); const chunks = []; let cancelled = false; const t0 = Date.now();
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((x) => x.stop()); clearInterval(timer); rec = null; renderComposer(true);
        if (cancelled || Date.now() - t0 < 600) return;
        const type = (mr.mimeType || 'audio/webm').split(';')[0];
        sendFile(new File(chunks, 'voice.' + (type.includes('mp4') ? 'm4a' : 'webm'), { type }), '');
      };
      const clock = h('span', { style: 'flex:1;text-align:center;font-variant-numeric:tabular-nums;color:var(--danger);font-weight:700' }, '0:00');
      const timer = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); clock.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 250);
      rec = mr; mr.start();
      R.composer.replaceChildren(h('div', { class: 'composer' }, h('div', { class: 'comp-row' },
        iconBtn('x', t('close'), () => { cancelled = true; mr.stop(); }), clock, iconBtn('send', 'Send', () => mr.stop(), 'rec'))));
    } catch { toast(t('mic_denied')); }
  }

  // ───────────────────────── dialogs ─────────────────────────
  function picker({ multi, exclude = [], onPick }) {
    const sel = new Set(); const listEl = h('div', { class: 'ulist' });
    const q = h('input', { class: 'field', type: 'search', placeholder: t('search'), oninput: draw });
    function draw() {
      const term = q.value.trim().toLowerCase();
      const users = [...S.users.values()].filter((u) => u.id !== S.me.id && !exclude.includes(u.id) && (!term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)));
      listEl.replaceChildren(...(users.length ? users.map((u) => h('button', { class: 'urow' + (sel.has(u.id) ? ' sel' : ''), onclick: () => { if (multi) { sel.has(u.id) ? sel.delete(u.id) : sel.add(u.id); draw(); } else onPick(u); } },
        avatar(u.name, u.id, { sm: true, dot: isOnline(u.id) }), h('div', { class: 'grow' }, h('b', {}, u.name), h('small', {}, u.email)),
        multi && h('span', { class: 'check' }, sel.has(u.id) ? icon('check') : null))) : [h('div', { class: 'empty' }, t('no_users'))]));
    }
    draw(); return { el: h('div', { style: 'display:grid;gap:10px' }, q, listEl), selected: () => [...sel] };
  }
  function openNewChat() {
    let tab = 'dm'; const body = h('div', { style: 'display:grid;gap:14px' });
    const m = modal(t('new_chat'), body);
    const draw = () => {
      const tabs = h('div', { class: 'tabs' }, ['dm', 'group', 'channel'].map((k) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, t('tab_' + k))));
      if (tab === 'dm') { body.replaceChildren(tabs, picker({ onPick: safe(async (u) => { m.close(); await startDm(u.id); }) }).el); return; }
      const title = h('input', { class: 'field', placeholder: t(tab === 'group' ? 'group_name' : 'channel_name'), maxlength: 80 });
      const p = picker({ multi: true });
      const go = h('button', { class: 'btn', onclick: safe(async () => {
        if (!title.value.trim()) return title.focus();
        const r = await api('/chats', { method: 'POST', body: { type: tab, title: title.value, member_ids: p.selected() } });
        S.chats.set(r.chat.id, r.chat); m.close(); selectChat(r.chat.id);
      }) }, t('create'));
      body.replaceChildren(tabs, title, p.el, go);
    };
    draw();
  }
  async function refreshChats() { const r = await api('/chats'); S.chats = new Map(r.chats.map((x) => [x.id, x])); renderSide(); }
  function openInfo(c) {
    const me = c.members.find((x) => x.user_id === S.me.id);
    const manage = (me && (me.role === 'owner' || me.role === 'admin') || S.me.role === 'admin') && c.type !== 'dm';
    const body = h('div', { style: 'display:grid;gap:14px' });
    const m = modal(c.type === 'dm' ? t('info') : c.title, body);
    const draw = () => {
      const cur = S.chats.get(c.id); if (!cur) return m.close();
      const rows = cur.members.map((mem) => { const u = S.users.get(mem.user_id) || { name: '…', email: '' };
        return h('div', { class: 'urow' }, avatar(u.name, mem.user_id, { sm: true, dot: isOnline(mem.user_id) }),
          h('div', { class: 'grow' }, h('b', {}, u.name + (mem.user_id === S.me.id ? ` (${t('you')})` : '')), h('small', {}, u.email)),
          mem.role !== 'member' && h('span', { class: 'chip' }, mem.role === 'owner' ? t('owner') : t('admin')),
          manage && mem.user_id !== S.me.id && !cur.is_default && h('button', { class: 'btn ghost small', onclick: safe(async () => { await api(`/chats/${cur.id}/members/${mem.user_id}`, { method: 'DELETE' }); await refreshChats(); draw(); }) }, t('remove'))); });
      body.replaceChildren(
        h('div', { class: 'ulist' }, rows),
        manage && h('button', { class: 'btn ghost', onclick: () => { const p = picker({ multi: true, exclude: cur.members.map((x) => x.user_id) });
          body.replaceChildren(p.el, h('button', { class: 'btn', onclick: safe(async () => { await api(`/chats/${cur.id}/members`, { method: 'POST', body: { user_ids: p.selected() } }); await refreshChats(); draw(); }) }, t('add'))); } }, t('add_members')),
        cur.type !== 'dm' && !cur.is_default && h('button', { class: 'btn danger', onclick: safe(async () => { await api(`/chats/${cur.id}/members/${S.me.id}`, { method: 'DELETE' }); m.close(); }) }, t('leave')));
    };
    draw();
  }
  function openSettings() {
    const name = h('input', { class: 'field', value: S.me.name, maxlength: 60 });
    const notif = 'Notification' in window;
    const notifBtn = h('button', { class: 'btn small' + (notif && Notification.permission === 'granted' ? ' ghost' : ''), disabled: !notif || Notification.permission === 'granted' || Notification.permission === 'denied',
      onclick: async () => { const p = await Notification.requestPermission(); notifBtn.textContent = p === 'granted' ? t('enabled') : t('enable'); notifBtn.disabled = true; } },
      notif && Notification.permission === 'granted' ? t('enabled') : t('enable'));
    const m = modal(t('settings'),
      h('div', {}, h('label', { class: 'lbl' }, t('name')), h('div', { style: 'display:flex;gap:8px' }, name,
        h('button', { class: 'btn', onclick: safe(async () => { const r = await api('/me', { method: 'PATCH', body: { name: name.value } }); S.me = r.user; S.users.set(S.me.id, S.me); renderSide(); toast(t('saved')); }) }, t('save')))),
      h('div', { class: 'setting-row' }, h('span', {}, t('language')), langToggle()),
      h('div', { class: 'setting-row' }, h('span', {}, t('notifications')), notifBtn),
      S.me.role === 'admin' && h('button', { class: 'btn ghost', onclick: () => { m.close(); openAdmin(); } }, t('admin_panel')),
      h('button', { class: 'btn danger', onclick: async () => { await api('/auth/logout', { method: 'POST' }).catch(() => {}); S.chats.clear(); S.msgs.clear(); S.active = null; m.close(); history.replaceState(null, '', location.pathname); renderLogin(); } }, t('logout')));
  }
  const openAdmin = safe(async () => {
    const body = h('div', { style: 'display:grid;gap:16px' }); const m = modal(t('admin_panel'), body);
    const draw = safe(async () => {
      const d = await api('/admin/overview');
      const email = h('input', { class: 'field', type: 'email', dir: 'ltr', placeholder: 'name@company.com' });
      body.replaceChildren(
        h('b', {}, t('users_count', d.users.filter((u) => !u.banned).length, d.max_users)),
        h('div', { class: 'ulist' }, d.users.map((u) => h('div', { class: 'urow' }, avatar(u.name || u.email, u.id, { sm: true, dot: isOnline(u.id) }),
          h('div', { class: 'grow' }, h('b', {}, u.name || '—'), h('small', {}, u.email)),
          u.role === 'admin' && h('span', { class: 'chip' }, t('admin')), u.banned && h('span', { class: 'chip red' }, t('banned')),
          u.id !== S.me.id && h('button', { class: 'btn ghost small', onclick: safe(async () => { await api(`/admin/users/${u.id}`, { method: 'PATCH', body: { banned: !u.banned } }); draw(); }) }, u.banned ? t('unban') : t('ban')),
          u.id !== S.me.id && !u.banned && h('button', { class: 'btn ghost small', onclick: safe(async () => { await api(`/admin/users/${u.id}`, { method: 'PATCH', body: { role: u.role === 'admin' ? 'user' : 'admin' } }); draw(); }) }, u.role === 'admin' ? t('make_user') : t('make_admin'))))),
        h('div', {}, h('label', { class: 'lbl' }, t('allowed_domains')), h('div', {}, d.allowed_domains.length ? d.allowed_domains.map((x) => h('span', { class: 'chip', dir: 'ltr', style: 'margin-inline-end:6px' }, '@' + x)) : t('none'))),
        h('div', {}, h('label', { class: 'lbl' }, t('allowed_emails')),
          h('div', { class: 'ulist' }, d.allowed_emails.map((x) => h('div', { class: 'urow' }, h('div', { class: 'grow', dir: 'ltr', style: 'text-align:start' }, x), h('button', { class: 'btn ghost small', onclick: safe(async () => { await api('/admin/allowed/remove', { method: 'POST', body: { email: x } }); draw(); }) }, t('remove'))))),
          h('div', { style: 'display:flex;gap:8px;margin-top:8px' }, email, h('button', { class: 'btn', onclick: safe(async () => { if (!email.value) return; await api('/admin/allowed', { method: 'POST', body: { email: email.value } }); draw(); }) }, t('add')))));
    });
    draw();
  });

  boot();
})();
