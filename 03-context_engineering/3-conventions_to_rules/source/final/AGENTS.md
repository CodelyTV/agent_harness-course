# Useful commands

```bash
npm install
npm run db:up        # start PostgreSQL (Docker)
npm run db:reset     # wait for DB, load schema + seed
npm run dev          # local dev server (http://localhost:3000)
npm run build        # production build
npm run typecheck    # type-check only
npm run lint
npm run test         # unit tests
npm run test:integration
```

# Architecture

- Onion architecture: each bounded context in `src/contexts/backend/` has `domain/`, `application/` and `infrastructure/` layers.
- Each use case does one business action. If a use case does two things, split it into two use cases.
