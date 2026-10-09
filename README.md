# Sentinel × Carry1st — Gamers World

A mobile-first gaming community and affiliate storefront built with Next.js, React, and TypeScript.

## Current scope
- Sentinel / Gamers World landing page and responsive visual identity.
- Community links for Discord and WhatsApp.
- Carry1st affiliate destination for partner purchases.
- Clear affiliate disclosure.

## Purchase and reporting rules
- Customers complete purchases on Carry1st; Sentinel does not collect payment details or process partner purchases.
- The configured affiliate destination is `https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3`.
- An outbound click is not proof of a purchase or commission. Only report commissions when verified through an official affiliate report or reliable imported data.
- Do not display invented prices, stock levels, sales, or earnings.

## Local development
Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev` — local development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — lint source files

## Next implementation milestones
1. Product catalogue schema and editable admin interface.
2. Secure admin authentication and role-based authorization.
3. Database-backed catalogue and audit trail.
4. Affiliate click tracking with privacy-conscious analytics.
5. Verified commission import/reconciliation and reporting.
6. Automated checks and deployment configuration.

Admin tools must not be exposed as public write endpoints. Add authentication, server-side authorization, validation, and secrets via environment variables before connecting any persistent data store.

## Project links
- Carry1st affiliate shop: `https://carry1st.sng.link/Dz248/s3c7?paffid=2824295&_smtype=3`
- Discord: `https://discord.gg/QUeHC9eN`
- WhatsApp: `https://wa.me/2349063389697`
