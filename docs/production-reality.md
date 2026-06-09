# CURRENT PRODUCTION REALITY — 2026-06-09

> **Disclaimer:** This document describes the live production baseline as confirmed by
> current git HEAD + smoke test results. Repo technical inventory docs (e.g.
> `sectorcalc-tam-yapi-raporu.txt`, `sectorcalc-system-dna.txt`) are **not** live
> reality by themselves — always cross-check with this file and smoke output.

## 1. Canonical live domain

- **Production:** https://sectorcalc.com
- **Firebase fallback/test:** https://sectorcalc-bf412.web.app

## 2. Current live route baseline

| Marker | Commit | Description |
|--------|--------|-------------|
| P0 revert baseline | `6775934` | IA/categories/header changes reverted after white-page incident |
| Premium route collision fix | `8d63660` | EN premium tool 500s from legacy route collision fixed |
| **Current HEAD** | `8d63660` | `origin/main` aligned |

## 3. Last P0 incident

- White page / slowness reported on production
- IA / categories / header-wide changes **reverted** (commits `6775934` and prior reverts)
- Live behavior returned to stable baseline before premium collision fix
- Premium route collision fix (`8d63660`) applied after revert chain

## 4. Current stable assumptions (smoke-confirmed)

Routes expected HTTP 200 (with retry/backoff for SSR cold-start):

- `/`, `/pricing`, `/free-tools`, `/premium-tools`, `/industries`, `/categories`
- `/login`, `/account`, `/account/reports`
- `/tr` and prefixed locale routes (tr, ar, de, fr, es)
- All **27 premium** routes at `/tools/premium/{slug}` (EN/default, no `/en` prefix)
- Critical premium EN + TR routes

**Known risk:** `/tr` first-hit SSR cold-start may be slow (>5s, occasionally >10s).
Retry/backoff in audit scripts accounts for transient 500/502/503.

## 5. Do NOT treat as live unless current git confirms

These exist in repo history, stash, or docs but are **not** production behavior:

| Item | Status |
|------|--------|
| Regional Unit Engine | Foundation commit exists; not live UX |
| Enterprise footer v2 | Reverted / WIP |
| Header manifesto IA | Reverted (`257d151`) |
| Categories function-index | Reverted (`6775934`) |
| Campaign/locale WIP | Not deployed |
| Smart Form global wrapper | Pilot/governance only; not universal production UI |
| Trust Trace Export | Not live |
| Verify backend | Not live |

**Stash warning:** 12 local stashes exist — do not apply or deploy without explicit review.

## 6. Audit standard (production lock)

| Rule | Value |
|------|-------|
| Default BASE_URL | `https://sectorcalc.com` |
| Env override | `SECTORCALC_AUDIT_BASE_URL=https://sectorcalc.com` |
| EN/default routes | **No** `/en` prefix (`localePrefix: as-needed`) |
| Locale prefixes | `tr`, `ar`, `de`, `fr`, `es` only |
| Retry on | 500, 502, 503, network error, timeout |
| Attempts | 6 with backoff: 500, 1000, 1500, 2500, 4000, 6000 ms |
| Request timeout | 18s |
| Fatal detection | HTTP 404, title `404:…`, visible `Application error`, `__next_error__`, `NEXT_NOT_FOUND` (RSC flight payload excluded) |

### Scripts

```bash
npm run audit:revenue-tools      # Registry + full route smoke
npm run smoke:premium-routes     # 27 premium routes only
npm run smoke:locale-routes      # EN + 5 locales, fatal markers + timing
```

Optional locale for premium smoke:

```bash
node scripts/smoke-premium-routes.mjs --locale tr
```

## 7. Next allowed work (after this lock)

1. Browser QA (Chrome, Safari, mobile)
2. Performance cold-start lock (`/tr` focus)
3. Grouped catalog search
4. Regional Unit Engine
5. Smart Form Architecture

## 8. Remaining risks

- `/tr` SSR cold-start latency
- Manual Chrome/Safari/mobile QA not automated
- WIP/stash re-deploy risk if applied accidentally
- Reverted features documented elsewhere may look "live"
- Smoke scripts cannot detect client-side hydration crashes

## 9. Doc disclaimer (all inventory reports)

Replace any claim like *"this report is complete production reality"* with:

> *This report is a repo technical inventory; production reality must be evaluated
> together with the current live commit and smoke test results
> (`docs/production-reality.md`).*
