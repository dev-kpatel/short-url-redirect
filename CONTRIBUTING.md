# Contributing / Local Dev

## Requirements
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm
- (Optional) Docker

## Setup
1) Create DB, run schema:
```bash
psql "$DATABASE_URL" -f backend/sql/schema.sql
```
2) Backend:
```bash
cd backend && cp .env.example .env && npm i && npm run dev
```
3) Frontend:
```bash
cd frontend && cp .env.example .env && npm i && npm run dev
```

## Git Flow (solo-friendly)
- Branch from `main`:
  ```bash
  git checkout -b feat/links-list
  ```
- Commit with clear messages:
  ```bash
  git commit -m "feat(frontend): create link modal + list page"
  ```
- Push:
  ```bash
  git push -u origin feat/links-list
  ```

## Docker (optional sketch)
```yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: shorturl
    ports: ["5432:5432"]
    volumes: [db:/var/lib/postgresql/data]

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/shorturl
      PORT: 4000
    ports: ["4000:4000"]
    depends_on: [db]

  frontend:
    build: ./frontend
    environment:
      VITE_API_URL: http://localhost:4000/api
      VITE_RESOLVER_ORIGIN: http://localhost:4000
    ports: ["5173:5173"]
    depends_on: [backend]

volumes:
  db:
```
