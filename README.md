# ZENVI — Premium Social Media Platform

ZENVI is a responsive social-media web application built with React, TypeScript, and an Express API. The project includes a multi-page social experience, theme preferences, profiles, posts, likes, comments, saved posts, stories, reels, communities, notifications, and messaging UI. Feature availability depends on the implemented API and current project state; verify each flow before presenting it as production functionality.

## Technology stack

- React 19 + TypeScript
- Vite 8
- React Router
- Express 4 + Node.js
- JSON-file persistence for this project version
- Server-Sent Events for live-event updates

> **Storage note:** This version persists application data to `server/data/db.json` by default. For hosted deployment, configure a persistent disk and set `ZENVI_DATA_DIR`. Do not deploy this JSON store to an ephemeral/serverless filesystem and expect data to persist. For high traffic or multi-instance production use, migrate to a managed database such as MongoDB or PostgreSQL.

## Requirements

- Node.js 22 or newer (recommended)
- npm

## Run locally

```bash
npm install --include=dev
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`. The Express server mounts the API at `/api` and serves the Vite app in development.

## Production build

```bash
npm ci
npm run build
NODE_ENV=production npm start
```

The production server serves `dist/` and the API from the same origin. The health endpoint is `GET /api/health`.

## Environment variables

Copy `.env.example` to `.env` for local development. Only set values that you actually use.

| Variable | Purpose | Required |
|---|---|---|
| `PORT` | HTTP port assigned by host | Host-provided / optional locally |
| `NODE_ENV` | Set to `production` in hosted deployment | Recommended |
| `ZENVI_DATA_DIR` | Directory for `db.json`; use a persistent disk path in hosting | Required for persistent hosted JSON storage |
| `ZENVI_UPLOADS_DIR` | Directory for uploaded media; use a persistent disk path in hosting | Required if uploaded media must persist |

Do not commit `.env`, credentials, API keys, or production secrets. The `.env.example` contains placeholders only.

## Deployment on Render (single service)

This repository includes `render.yaml` for a single Node web service with a persistent disk. To deploy:

1. Push the complete project to a GitHub repository, for example `Invoqe_ZENVI`.
2. In Render, choose **New → Blueprint** and select the repository containing `render.yaml`.
3. Review the service and persistent-disk settings, then create the service.
4. Wait for the build and deploy to finish. Open the service URL and check `/api/health`.
5. Test registration, login, creating a post, uploading media, and refresh/restart persistence before sharing the URL.

The included disk configuration is intended for a single instance. Do not scale this JSON-file-backed service to multiple instances; use a shared database and object storage for that architecture.

## Repository checklist

- Keep `README.md` as the main setup guide.
- Confirm the app builds with `npm run build`.
- Confirm the server starts and `/api/health` returns `status: healthy`.
- Test core interactions with a newly registered account.
- Ensure `.env`, uploaded private files, and real user data are not committed.
- Share only a public repository if your internship instructions and project license permit it.

## Security and scope

This is an internship/demo application, not a security-audited production social network. Password hashing and token generation have been hardened in this version, but a production release still needs a proper database, account recovery/email verification, moderation and abuse controls, robust authorization tests, observability, backups, and a privacy review.
