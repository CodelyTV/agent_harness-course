# Useful commands

```bash
npm install
npm run db:up        # start PostgreSQL (Docker)
npm run db:reset     # wait for DB, load schema + seed
npm run dev          # local dev server (http://localhost:3000)
npm run build        # production build
npm run typecheck    # type-check only
npm run test         # unit tests
npm run test:integration
```

# Architecture

- Next.js 16 (App Router), Hexagonal Architecture, DDD.
- Frontend routes and server actions in `src/app/` (`src/app/actions/`).
- Backend business logic in `src/contexts/backend/`, split by bounded context (`products`, `checkout`, `orders`, `reviews`, `users`), each with `domain/application/infrastructure`.
- Shared domain primitives in `src/contexts/shared/`.

# Documentation

- Detailed conventions with examples live in `docs/`.
- **Do NOT read all docs upfront.**
- When working on a task, use this map to find and read only the docs relevant to your task:

```
docs/
├── architecture/
│   └── domain-and-application-do-not-read-the-system-time.md
└── code-quality/
    └── code-reveals-its-intent.md
```
