# Sentinel Carry1st Gaming

Responsive static storefront for browsing game top-ups and continuing to affiliate partner checkout.

## Included files
- `index.html` — landing page and catalog layout
- `styles.css` — responsive storefront styling
- `app.js` — product packages, price display, currency switcher and category filters
- `catalog.json` — machine-readable catalog
- `vercel.json` — static hosting security headers

## Products and pricing
The catalog includes Call of Duty: Mobile COD Points, Free Fire Diamonds, Mobile Legends Diamonds and PUBG Mobile UC. NGN package prices were taken from Carry1st's publicly indexed Nigeria product listings on 14 October 2026. Product availability, promotions and checkout prices can change.

USD values in the storefront are indicative conversions using **₦1,330 = $1**, a market reference observed on 14 October 2026. They are not official Carry1st USD prices and are not used to process payments.

## Affiliate destinations
- Carry1st: https://shop.carry1st.com/?aff=peter9j
- Gaming coins: https://tolt.link/coins

The catalog buttons send customers to partner pages. This storefront does not collect payments or place orders. Affiliate commissions are not guaranteed and must be verified in the affiliate provider's reporting.

## Vercel setup
Use the existing Vercel project `sentinel-gamers-world` and set **Root Directory** to `sentinel-carry1st`. Framework preset: Other; Build Command: leave blank; Output Directory: `.`; Install Command: leave blank. Deploy only after the Vercel account has authorized access to the intended repository.

## Important limitations
- This folder is a static storefront. It does not contain a secure private admin backend, order database, authenticated product editor, or server-side commission reconciliation.
- Do not publish customer credentials or API secrets in this repository.
- Before production, verify that affiliate parameters are retained through each direct product URL and test the full outbound flow on mobile.
- The connected Shopify catalog drafts are separate from this static repository catalog.
