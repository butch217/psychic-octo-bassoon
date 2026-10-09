# Sentinel × Carry1st — Gamers World

A mobile-first gaming community and affiliate storefront for Nigeria and the wider gaming community. Built with Next.js 15, React 19, TypeScript, Prisma, and MySQL.

## Features in this branch

- Responsive Sentinel / Gamers World storefront with searchable gaming categories.
- Discord and WhatsApp community links.
- Carry1st affiliate purchase redirects; Sentinel does not process customer payments.
- Affiliate disclosure and no fabricated prices, inventory, sales, or commission amounts.
- MySQL schema and initial migration for catalogue products and affiliate events.
- Repeatable seed for the six starter catalogue categories.
- Public active-catalogue API and authenticated admin product API.
- Admin login with signed, expiring, HttpOnly session cookie.
- Admin catalogue dashboard with create, publish/unpublish, search, refresh, and delete.
- Outbound affiliate click events are tracked when the database is available. A click is not proof of a sale.
- GitHub Actions lint/build validation workflow.

## Purchase and reporting rules

Customers complete purchases on Carry1st. The configured affiliate destination is:

`https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3`

Sentinel must not collect card details or implement a parallel payment flow for these partner purchases. Commission totals remain blank until verified partner data is imported. The current implementation does not claim access to a Carry1st conversion/commission API.

## Requirements

- Node.js 20+
- npm
- MySQL 8+ database (local or hosted)
- GitHub repository access for branch updates

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set:
   - `DATABASE_URL`: MySQL connection URL for the Sentinel database.
   - `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters.
   - `ADMIN_PASSWORD_HASH`: a scrypt password hash in `salt:128-character-hex` format.

3. Generate a password hash on a trusted local terminal (do not commit the result). On macOS/Linux with Bash:

   ```bash
   read -s -p "Admin password: " ADMIN_PASSWORD; echo
   export ADMIN_PASSWORD
   node -e 'const c=require("node:crypto");const p=process.env.ADMIN_PASSWORD;if(!p||p.length<12)throw Error("Use at least 12 characters");const s=c.randomBytes(16).toString("hex");console.log(s+":"+c.scryptSync(p,s,64).toString("hex"))'
   unset ADMIN_PASSWORD
   ```

   Put the printed value in your private `ADMIN_PASSWORD_HASH` environment setting. Do not share or commit it. Use a password manager to keep the password.

4. Apply the schema and load the starter catalogue:

   ```bash
   npm run db:generate
   npm run db:deploy
   npm run db:seed
   ```

   For first-time local development, `npm run db:migrate` creates a development migration if the schema changes; the initial migration is already committed.

5. Run checks and start the app:

   ```bash
   npm run lint
   npm run build
   npm run dev
   ```

   Open `http://localhost:3000`. The admin login is at `/admin/login`.

## Environment variables

See `.env.example`. Real values belong only in a local ignored environment file or the hosting provider's secret manager. Never commit production credentials.

## API routes

- `GET /api/products` — active catalogue only.
- `GET /api/admin/products` — list catalogue (admin session required).
- `POST /api/admin/products` — create draft product (admin session required).
- `PATCH /api/admin/products/:id` — update product (admin session required).
- `DELETE /api/admin/products/:id` — delete product (admin session required).
- `GET /api/outbound/:slug` — record an outbound click when possible, then redirect to the configured partner destination.
- `POST /api/admin/login` and `POST /api/admin/logout` — admin session lifecycle.

## Deployment checklist

Before public launch:

1. Provision a MySQL database and set all three environment variables in the host's secret manager.
2. Run `npm run db:deploy` as a release/deployment step, then run `npm run db:seed` once or whenever starter records need reconciliation.
3. Confirm GitHub Actions passes lint and production build checks; verify the actual hosted build as well.
4. Configure hosting (for example, Vercel) with the correct repository and development branch, then promote through a reviewed pull request to `main`.
5. Test login, session expiry, sign-out, product create/update/delete, storefront redirects, mobile layout, and database outage behavior.
6. Add a persistent rate limiter at the edge/hosting layer for login attempts before public production use.
7. Configure backups, database least-privilege credentials, monitoring, and a documented recovery procedure.
8. Integrate only an official Carry1st affiliate report/API (if available to this account) before showing confirmed orders or commissions. Reconcile duplicate partner references and retain an audit trail.

## Known launch blockers / not yet verified

- This branch has not been run through a real dependency install, lint, or production build in this workspace; CI results must be checked after GitHub Actions runs.
- No production database or hosting environment has been provisioned from this repository.
- Affiliate click records are not confirmed purchases; verified commission import/reconciliation is not implemented.
- Login rate limiting and production operational controls still need deployment configuration.
- Product artwork currently uses CSS illustrations; replace with licensed/official assets only when available and permitted.

## Project links

- Carry1st affiliate destination: `https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3`
- Discord: `https://discord.gg/QUeHC9eN`
- WhatsApp: `https://wa.me/2349063389697`
