# GigShield AI

GigShield AI is a production-shaped MVP for automatic income protection payouts for gig workers when heavy rain, extreme heat, or hazardous air quality prevent safe work.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- ShadCN-style UI primitives
- Framer Motion
- Prisma ORM with PostgreSQL
- JWT auth using signed cookies

## Project structure

```text
.
|-- app
|   |-- api
|   |   |-- admin
|   |   |-- auth
|   |   |-- environment
|   |   |-- fraud
|   |   |-- payout
|   |   |-- plan
|   |   `-- user
|   |-- dashboard
|   |   `-- admin
|   |-- login
|   |-- plans
|   |-- signup
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   |-- auth
|   |-- dashboard
|   |-- layout
|   |-- plans
|   |-- sections
|   `-- ui
|-- lib
|   |-- auth
|   |-- services
|   `-- validators
|-- prisma
|   |-- schema.prisma
|   `-- seed.ts
|-- .env.example
|-- package.json
`-- README.md
```

## API surface

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/user/profile`
- `GET /api/user/dashboard`
- `POST /api/plan/subscribe`
- `GET /api/plan/status`
- `GET /api/environment/current`
- `POST /api/environment/simulate`
- `POST /api/payout/run`
- `GET /api/payout/history`
- `GET /api/fraud/check`
- `GET /api/admin/users`
- `POST /api/admin/flag-user`

## Prisma models

- `User`
- `Subscription`
- `Payout`
- `EnvironmentData`
- `RiskScore`
- `FraudFlag`

## Local run

1. Copy `.env.example` to `.env` and set a PostgreSQL `DATABASE_URL` plus `JWT_SECRET`.
2. Install dependencies with `npm.cmd install`.
3. Generate Prisma client with `npm.cmd run prisma:generate`.
4. Run migrations with `npm.cmd run prisma:migrate`.
5. Seed demo data with `npm.cmd run prisma:seed`.
6. Start the app with `npm.cmd run dev`.

## Demo credentials

- Worker: `worker@gigshield.ai` / `Password123!`
- Admin: `admin@gigshield.ai` / `Password123!`

## Notes

- Environmental data is simulated but isolated behind services so it can be replaced with a real provider.
- Payouts are automatic. There is intentionally no manual claims flow.
- Fraud and trust logic is mocked but structured for future model-based expansion.
