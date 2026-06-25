# SectorCalc

Global sector-specific calculation and decision-tool platform.

## Quick Start

```bash
npm install
npm run dev
```

## Build & Test

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Structure

- `src/app/*` — Next.js App Router pages
- `src/components/*` — UI components
- `src/lib/*` — Business logic, formulas, tools
- `src/data/*` — Tool definitions
- `messages/*` — i18n locale files
- `functions/*` — Cloud Functions (admin, Stripe)
- `scripts/*` — Build & audit utilities
- `public/*` — Static assets & sitemap

## Deploy

```bash
firebase deploy --only hosting --project sectorcalc-bf412
firebase deploy --only functions --project sectorcalc-bf412
```
