# arsa messenger

پیام‌رسان خصوصی شرکت arsa — Private messenger for arsa (≤100 users, email-code login, fa/en UI).

## Features
- Email login with a 6-digit code (no passwords). Only allowed emails/domains can register.
- 1:1 chats, groups, channels (admins post, members read), replies, edit, delete, emoji reactions
- Photos, files, voice messages (up to 25 MB), paste-an-image-to-send
- Typing indicator, online/last-seen, read ticks, unread badges, browser notifications
- Persian (RTL) and English UI, switchable per user; installable as an app (PWA)
- Admin panel: allowed emails, ban/unban, promote admins; an automatic "General" group for everyone

## Deploy on Railway
1. Push this folder to a GitHub repo, then Railway → **New Project → Deploy from GitHub repo** (the Dockerfile is detected automatically).
2. **Add a Volume** to the service with mount path `/data` (keeps the database and uploads).
3. Set **Variables**:

| Variable | Example | Notes |
|---|---|---|
| `APP_SECRET` | long random string | required |
| `ADMIN_EMAILS` | `you@arsa.ir` | first admins (can always sign in) |
| `ALLOWED_DOMAINS` | `arsa.ir` | anyone with this email domain may register |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.example.com` / `587` | for sending login codes |
| `SMTP_USER` / `SMTP_PASS` | … | |
| `SMTP_FROM` | `arsa <no-reply@arsa.ir>` | |
| `SMTP_SECURE` | `false` | `true` for port 465 |
| `MAX_USERS` | `100` | optional |

4. **Settings → Networking → Generate Domain** (or attach your own). Open it, enter an admin email, receive the code, done.

Without SMTP the login code is only printed in the service logs (fine for a first test).

## Run locally
```
npm install
node server.js        # http://localhost:3000, codes print in the terminal
```
Requires Node >= 22.13.

## Persian font
For the best Persian text, download **Vazirmatn.woff2** (variable) and place it at `public/fonts/Vazirmatn.woff2`. It is served from your own server (no Google Fonts needed). Tahoma is the fallback.

## Notes
- Messages are encrypted in transit (HTTPS) but not end-to-end encrypted; they are stored in SQLite at `/data/arsa.db`. Back up the volume.
- Realtime uses Server-Sent Events, which is plenty for 100 users on one instance. Run a single replica.
