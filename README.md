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

## Deploy to Netlify

Netlify currently supports modern Next.js App Router apps with zero-config through its OpenNext adapter. This project is compatible with that flow.

### 1. Push the project to GitHub

Commit your code and push it to a Git repository connected to Netlify.

### 2. Create the site in Netlify

In Netlify:

1. Choose **Add new site**.
2. Import the Git repository.
3. Keep the default publish behavior for Next.js.
4. Use the build command from `netlify.toml`, which runs:

```bash
npm run build
```

### 3. Add environment variables

Add these in the Netlify UI, not only in `.env`:

- `DATABASE_URL`
- `JWT_SECRET`

For server-rendered routes and route handlers, make sure the variables are available to both **Builds** and **Functions**.

### 4. Prepare PostgreSQL

Use a hosted PostgreSQL database such as Neon, Supabase, Railway, Prisma Postgres, or Render Postgres. Do not rely on local PostgreSQL for production deploys.

Recommended default:

- Neon or Prisma Postgres if you want the smoothest serverless-style workflow
- Supabase if you also want dashboard tooling and auth/storage options later

### 5. Add a migration workflow secret set

If you want GitHub Actions to run production migrations and then trigger Netlify automatically, add these GitHub repository secrets:

- `DATABASE_URL`
- `JWT_SECRET`
- `NETLIFY_BUILD_HOOK`

You can create a Netlify build hook in:

`Site configuration -> Build & deploy -> Build hooks`

### 6. Run Prisma migrations

Netlify will build the app, but you still need your production database schema applied. Run this against your production database before or during your release workflow:

```bash
npx prisma migrate deploy
```

If you want demo users in production, also run:

```bash
npx prisma db seed
```

The repo now includes a GitHub Actions workflow at [netlify-deploy.yml](C:/Users/rtham/GuideWire/.github/workflows/netlify-deploy.yml) that can do this automatically on pushes to `main` or on manual dispatch.

### 7. Redeploy

Trigger a fresh Netlify deploy after the environment variables are added and the production database is migrated.

### Netlify notes

- The app uses Next.js route handlers under `app/api`, which Netlify supports for modern Next.js deployments.
- Prisma works on Netlify, but for production you should prefer a pooled Postgres provider because serverless functions can open many short-lived connections.
- The build script now runs `prisma generate` before `next build`, which helps Netlify generate Prisma Client during deployment.
- Prisma now uses [prisma.config.ts](C:/Users/rtham/GuideWire/prisma.config.ts), which removes the deprecated `package.json#prisma` setup.
- The Prisma client generator includes `rhel-openssl-3.0.x` so Linux deploy environments such as Netlify can load the correct engine binary.

## Production checklist

1. Put production `DATABASE_URL` and `JWT_SECRET` into Netlify.
2. Put `DATABASE_URL`, `JWT_SECRET`, and `NETLIFY_BUILD_HOOK` into GitHub Actions secrets if using the workflow.
3. Make sure your production database is PostgreSQL, not SQLite.
4. Run `npx prisma migrate deploy` against production before the first live release.
5. Optionally run `npx prisma db seed` if you want demo users in production.
6. Trigger a Netlify deploy.
7. Test login, signup, dashboard load, logout, and one protected API route after deploy.

## Demo credentials

- Worker: `worker@gigshield.ai` / `Password123!`
- Admin: `admin@gigshield.ai` / `Password123!`

## Notes

- Environmental data is simulated but isolated behind services so it can be replaced with a real provider.
- Payouts are automatic. There is intentionally no manual claims flow.
- Fraud and trust logic is mocked but structured for future model-based expansion.

## References

- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify environment variables](https://docs.netlify.com/environment-variables/get-started/)
- [Framework environment variables on Netlify](https://docs.netlify.com/frameworks/environment-variables/)
- [Prisma deploy to Netlify](https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-netlify)
