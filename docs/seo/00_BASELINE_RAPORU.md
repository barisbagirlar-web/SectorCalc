# SectorCalc SEO V3 — Phase 0 Baseline Report

Source mandate: `SEO SARTNAMESI_V3_.txt`. This report is the read-only Phase 0 discovery artifact. It does not change runtime code.

## Framework and architecture summary

- Site: `https://sectorcalc.com`
- Site ID: `sectorcalc`
- Application: Vite static build with vanilla JavaScript and Lit components.
- Hosting: Firebase Hosting.
- SEO SSOT: `seo/registry.mjs` plus `seo/registry-data.mjs`.
- Registry baseline: 90 indexable URLs and 25 published calculators.
- Render model: build-time static HTML / SSG for the crawlable surface. Calculator interactions may run client-side while titles, descriptions, explanatory content, canonical metadata and crawlable links are emitted in build output.

## Route and page inventory

| Segment | Source | State |
|---|---|---|
| Home / hub / pricing / site pages | `seo/registry-data.mjs` | Registry SSOT |
| Calculator pages | `*-pro.html` sources to pretty `/calculator/...` canonicals | 25 published calculators |
| Other indexable content | Registry records | 90 total indexable baseline |
| Legacy calculator paths | Registry `legacyPaths` | Protected by canonical/redirect guards |

The complete route list remains in `seo/registry-data.mjs`; this report does not create a second route source of truth.

## SEO mechanism discovery

| Check | Result |
|---|---|
| robots.txt | PRESENT; protected by crawler policy and release guards |
| sitemap.xml / sitemap generation | PRESENT; `scripts/generate-sitemap.mjs` plus sitemap integrity guard |
| SEO config | PRESENT; `sites/sectorcalc/seo.config.json`, schema/defaults and V6 governance |
| SEO registry | PRESENT; `seo/registry.mjs` is the single source of truth |
| Canonical generation | PRESENT; registry `canonicalPath` plus SEO injection/verification chain |
| Structured data | PRESENT; schema generation/validation scripts and build guards |
| Title/meta description | PRESENT; registry plus SEO injection chain |
| Internal link guard | PRESENT; `verify:seo:links` and related build guards |
| SEO preflight/conformance | PRESENT; `seo:preflight`, `seo:conformance`, invariant registry |
| Cold-start / external-data safety | PRESENT; missing verified GSC/GA4 evidence stays fail-closed / low confidence |

## Concrete V3 gaps

- **MISSING — Medium:** The V3-named Phase 0–10 artifact set is incomplete.
- **MISSING — High:** There is no single `npm run seo:full-audit` orchestrator; controls are distributed across multiple mature commands.
- **MISSING — Medium:** The V3 `src/seo/types.ts` and page-state contract names do not map one-to-one to the existing SSOT. The correct fix is an adapter over `seo/registry.mjs`, not a parallel registry.
- **MISSING — Medium:** Phase 4 lacks one V3 command/report combining raw first-HTML and hydration-parity checks.
- **MISSING — Medium:** Phase 5 lacks one V3-format combined quality-contract, cannibalization and entity validation report; existing quality data uses a different model.
- **MISSING — Medium:** Phase 8 has no verified server/CDN log dataset in the repository. Tooling can be installed, but crawl-waste and discovery-lag measurements cannot be reported as PASS without real logs.
- **MISSING — High / external data:** Phase 9 has no verified GSC + GA4 + BigQuery connection in this repository session. SQL and contracts can be installed, but revenue/incrementality results must not be fabricated.
- **MISSING — Medium:** Phase 10 lacks a single combined forbidden-pattern + migration + final score report command.

## Rules revalidated against current official Google documentation

- A `noindex` directive must remain crawlable; blocking the same URL in robots.txt can prevent Google from seeing the directive.
- Good Core Web Vitals targets remain LCP <= 2.5s, INP < 200ms and CLS < 0.1, evaluated at the 75th percentile.
- Googlebot identity must be verified through DNS/IP evidence rather than trusting a user-agent string.
- Sitemap `lastmod` should reflect a meaningful content change rather than a deployment/build timestamp.
- HowTo is no longer a supported Google Search rich-result target.

## Mandate errata / implementation boundary

V3 Phase 6 asks for a "Google Rich Results Test API" CI integration. Current official Google Search documentation exposes the Rich Results Test tool but does not document a general-purpose public Rich Results Test API contract. No private or invented endpoint will be used. Phase 6 will use deterministic local JSON-LD/schema parity validation and a documented manual/staging Rich Results Test procedure instead of reporting a fake API PASS.

## Phase 0 decision

Phase 0 discovery is complete. Existing V6 controls will remain in place, and V3 requirements will be added as adapter/guard/reporting layers without creating a parallel SEO SSOT. The user's explicit instruction in this turn to apply the complete mandate is treated as authorization to continue through Phases 1–10 after each phase gate passes.
