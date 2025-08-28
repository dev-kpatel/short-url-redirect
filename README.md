<<<<<<< HEAD
# short-url-redirect
Short URL Redirect with React + Node.js + Express + PostgreSQL
=======
# Short URL Redirect (React + Node + Express + PostgreSQL)

A portfolio-grade short link service with:
- **Redirect links** (`/:slug`)
- **A/B test links** (equal split, server-side)
- **Calendar links** + **ICS download** (`/c/:t/:slug`, t = g|y|o|d)
- **React** dashboard (Tailwind) with **Create Link** modal and **Links list**
- Single-hop backend redirects (always one 302 to the final URL)

> Status: **V1 complete** (core create + list + redirect flows). See **ROADMAP.md** for V2+.

---

## Stack
- **Frontend:** React + TypeScript + Vite + Tailwind
- **Backend:** Node.js + TypeScript + Express
- **DB:** PostgreSQL

---

## Project Structure
```

frontend/
  public/
    vite.svg
  src/
    app/
        App.tsx
    components/
      ui/
        index.ts
        Button.tsx
        Modal.tsx
        InputError.tsx
        Select.tsx
        Input.tsx
      layout/
        Shell.tsx
        Header.tsx
        index.ts
        Navigation.tsx
    features/
      shortlink
        components/
          RedirectForm.tsx
          CalendarForm.tsx
          ABForm.tsx
          index.ts
    pages
      HomePage/
        index.tsx
      AbLinkPage/
        index.tsx
      RedirectPage/
        index.tsx
      RedirectLinkPage/
        index.tsx
      CalendarLinkPage/
        index.tsx
      index.ts
    services/
      api.ts
      links.ts
    shared/
      lib/
        cn.ts
        findInputError.ts
        index.ts
        isFormInvalid.ts
        validateSlug.ts
    types/
      global.d.ts
    App.jsx
    index.css
    main.tsx
  .env.example
  Dockerfile
  eslint.config.js
  index.html
  package-lock.json
  package.json
  tailwind.config.js
  tsconfig.json
  tsconfig.node.json
  vite.config.js

backend/
  src/
    config/
      env.ts
    db/
      pool.ts
    modules/
      resolve/
        strategies/
          calendar.ts
          redirect.ts
          ab.ts
          url-builders.ts
        resolver.ts
        router.ts
        types.ts
      links/
        routes.ts
        repository.ts
        types.ts
        service.ts
    app.ts
    index.ts
  .env.example
  sql/
    schema.sql         # single schema file

.gitignore
docker-compose.yml
README.md
BACKEND_API.md
ROADMAP.md
CONTRIBUTING.md
LICENSE
```

---

## Quick Start (Local)

### 1) Database
Create a Postgres DB and apply the **single schema**:

```bash
psql "$DATABASE_URL" -f backend/sql/schema.sql
```

### 2) Backend
```bash
cd backend
cp .env.example .env
# edit .env with your DATABASE_URL and PORT
npm i
npm run dev
```

### 3) Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL should point to your backend (e.g., http://localhost:4000/api)
npm i
npm run dev
```

Open: `http://localhost:5173` (Vite default)

---

## Environment

### `backend/.env.example`
```
PORT=4000
DATABASE_URL=postgres://user:pass@localhost:5432/shorturl
PUBLIC_RESOLVER_ORIGIN=http://localhost:4000
```

### `frontend/.env.example`
```
VITE_API_URL=http://localhost:4000/api
VITE_RESOLVER_ORIGIN=http://localhost:4000
```

---

## Key Features (V1)

- **Create Links** (modal in Links page)
  - Redirect: `slug`, `redirect` URL (+ optional `description`)
  - A/B: `slug`, two+ variant URLs (equal split, server-controlled)
  - Calendar: `slug` + event summary (details live in `calendar` table)
- **List Links**: `/app/links`
- **Redirects**
  - `/:slug` → resolves and issues **one 302** to final URL
  - `/ab/:slug` → A/B route (learning/debug)
  - `/c/:t/:slug` → Calendar providers:
    - `t=g` Google, `t=y` Yahoo, `t=o` Outlook, `t=d` ICS download

---

## Scripts

**Backend**
- `npm run dev` – dev server
- `npm run build && npm start` – production

**Frontend**
- `npm run dev` – Vite dev server
- `npm run build && npm run preview` – prod build & preview

---

## Deployment (optional)

- Containerize backend + frontend and deploy to a hosting of your choice.
- Use Docker Compose for local all-in-one spin up (DB + backend + frontend).
>>>>>>> aff6681 (feat(v1): initial Short URL Redirect (frontend+backend) + docs)
