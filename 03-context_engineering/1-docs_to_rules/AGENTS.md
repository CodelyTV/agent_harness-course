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

- Hexagonal architecture: each bounded context in `src/contexts/backend/` has `domain/`, `application/` and `infrastructure/` layers.
- Domain and application code never import from `infrastructure/`. They depend on ports (abstract classes in `domain/`), and `RetailContainer` wires the infrastructure adapters.
- Each use case does one business action. If a use case does two things, split it into two use cases.

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
