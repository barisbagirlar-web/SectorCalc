# SectorCalc SEO V3 — Phase 4 Report

SectorCalc is a static Vite/SSG-oriented site. Critical calculator metadata and explanatory content are emitted in first HTML; calculation interaction may hydrate client-side.

## Machine contract

`scripts/seo/render-contract-v3.ts` checks registry-owned HTML for title, meta description, canonical, robots, H1, crawlable links, JSON-LD and a minimum visible-content floor before JavaScript execution.

## Parity strategy

- Primary title/H1/canonical are server/build output, not client-only values.
- Existing Playwright enterprise E2E remains the rendered-DOM regression layer.
- Existing production build/canonical gates remain authoritative for post-build output.
- Client calculation failures do not remove the static explanatory content from first HTML.

No second rendering framework or duplicate SEO metadata source was introduced.
