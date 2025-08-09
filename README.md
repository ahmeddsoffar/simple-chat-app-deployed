### Simple Socket.IO Chat App

A tiny real-time chat built with Node.js, Express, and Socket.IO. I used this project to learn how to build chat apps and how to deploy them. Deployed on Railway.

## Features

- **Realtime chat**: broadcast messages to all connected clients
- **Join/leave notices**: system messages when users enter/exit
- **Online users list**: live usernames
- **Username modal**: simple popup to join (no AJAX)
- **Health check**: `GET /healthz` returns 200 "ok"
- **LAN testing**: listens on `0.0.0.0` so phones on the same Wi‑Fi can connect

## Stack

- Node.js + Express
- Socket.IO (server + client)
- Vanilla HTML/CSS/JS

## Run locally

```bash
npm ci
npm start
# open http://localhost:3000
```

Production mode (adds caching for static files):

```bash
npm run start:prod
# health: http://localhost:3000/healthz -> ok
```

Test on your phone (same Wi‑Fi):

- Find your PC IPv4 (Windows PowerShell: `ipconfig` → Wi‑Fi → IPv4)
- Open `http://<your-ip>:3000` on your phone

## Deploy (Railway)

1. Create a Railway project and connect this GitHub repo
2. Add env var: `NODE_ENV=production`
3. Start command: `npm run start:prod`
4. Open the assigned domain (HTTPS)
5. Verify `/healthz` shows "ok"

Notes:

- App uses `process.env.PORT`
- Railway supports WebSockets out of the box

## Structure

- `server.js` — Express + Socket.IO, `/healthz`, static serving
- `public/` — client HTML/CSS/JS
- `.gitignore` — standard Node ignores

---

Learning project for sockets + deployment.
