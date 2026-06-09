# CURRENT PRODUCTION REALITY — 2026-06-09

> **Disclaimer:** This document describes the live production baseline as confirmed by
> current git HEAD + smoke test results. Repo technical inventory docs (e.g.
> `sectorcalc-tam-yapi-raporu.txt`, `sectorcalc-system-dna.txt`) are **not** live
> reality by themselves — always cross-check with this file and smoke output.

> *This report is a repo technical inventory; production reality must be evaluated
> together with the current live commit, deploy, and smoke test results.*

## Canonical Live Domain

- **Live canonical:** https://sectorcalc.com
- **Firebase fallback/test:** https://sectorcalc-bf412.web.app
- **Audit/smoke scripts must default to:** https://sectorcalc.com

## Current Known Stable Baseline

| Marker | Commit | Description |
|--------|--------|-------------|
| P0 revert baseline | `6775934` | IA/categories/header changes reverted |
| Premium route collision fix | `8d63660` | EN premium 500s fixed |
| Production audit/smoke lock | `b01dc9d` | Audit scripts + production reality docs |
| **Current HEAD** | `b01dc9d` | `origin/main` aligned |

Do not assume reverted WIP is live unless current git confirms it.

## Last P0 Incident Summary

- User reported white pages and extreme slowness after broad IA/header/categories changes.
- Broad changes after `067212d` were reverted.
- Production smoke after revert showed core pages 200 and no fatal markers.
- Targeted premium route collision fix deployed as `8d63660`.

## Known Risks

- `/tr` first-hit can be slow due to SSR cold-start (>5s warning, >10s critical).
- Browser hydration issues cannot be fully detected by curl-only smoke.
- `audit:revenue-tools` must not use `/en` prefix for default English.
- `sectorcalc-bf412.web.app` should not be the default audit host.
- **12 local stashes** exist — do not apply or deploy without review.

## Not Safe To Treat As Live Unless Current HEAD Confirms

| Item | Status |
|------|--------|
| Regional Unit & Parameter Engine | P2/P3 debt — foundation only, not production-wide |
| Enterprise footer v2 | Reverted / WIP |
| Header manifesto IA | Reverted (`257d151`) |
| Categories function-index | Reverted (`6775934`) |
| Campaign/locale WIP | Not deployed |
| Smart Form global wrapper | Governance/spec/pilot — **NOT production-wide** |
| Verify backend lookup | Placeholder UI — **NOT full backend** |
| AI assistant | Lib boundary only — **NOT live product** |
| Case study proof layer | 8 representative drafts — **NOT 27/27 complete** |
| Trust Trace Export | Not live |

## Cursor Path Safety

**DO NOT USE** `src/lib/calculation-intelligence/`. **This path does not exist.**

All Dual-Core / Mind 1 / Mind 2 implementation lives under:

`src/lib/formula-governance/`

## Smart Form Maturity

| Component | Status |
|-----------|--------|
| `SmartToolForm.tsx` | PILOT / SPEC-DRIVEN — not universal production UI |
| `DynamicPremiumCalculator.tsx` | Schema-driven premium component — not universal Smart Form |
| `RuntimeTrustTracePanel.tsx` | Production trust trace display (pilot slugs) |
| Production-wide Smart Form Architecture | **NOT LIVE** |
| Most production calculator UIs | Manually wired forms |
| Akıl 2 dynamic form generation | Not universally visible in production |

**WARNING:** Do not claim SectorCalc currently has universal production Smart Forms.
Smart Form architecture exists as governance/spec/pilot infrastructure. Full production rollout is pending.

## Regional Unit & Parameter Engine

**STATUS: P2/P3 DEBT / NOT PRODUCTION-WIDE LIVE**

- `CalculationVariable.unit` exists as ontology metadata.
- Unit utilities and locale currency definitions may exist in repo.
- Production-wide regional unit conversion and country-specific parameter engine is **NOT LIVE**.
- Formula calculations must continue using canonical deterministic values.
- LLM must never invent regional coefficients, benchmarks, units, standards, or formula assumptions.

## Free Tool & Route Counts (registry-derived)

| Layer | Count | Route pattern |
|-------|------:|---------------|
| Legacy calculators | 10 | `/tools/[tier]/[slug]` |
| Free traffic catalog | 100 | `/tools/free/[slug]` |
| Revenue free tools | 27 | `/tools/free/[slug]` |
| Overlap (traffic ∩ revenue) | 12 | same slug in both registries |
| **Unique `/tools/free/[slug]` routes** | **115** | `listAllFreeToolSlugs()` |
| Overall calculator inventory | **125** | 10 legacy + 115 free-route slugs |

Note: Theoretical 127 (100+27) overcounts 12 overlapping slugs. Use registry functions, not hardcoded totals.

## `/verify` Status

**Route exists:** `/[locale]/verify`, `/[locale]/verify/[verificationId]`

**STATUS: PLACEHOLDER / P2 DEBT — NOT full backend**

- UI renders `VerificationSeal` with `validationStatus: "lookup_pending"`.
- No Firestore/Cloud Function lookup wired for public hash verification.
- Purpose (future): verify Trust Trace transaction, report hash, formula version, timestamp, input snapshot hash, validation status.
- Constraints: no `src/app/api` route; use Server Component / Cloud Function / Firestore read model.

## Case Study Proof Layer

**STATUS: INCOMPLETE**

- Target: 27/27 sector case studies with verified proof
- Current registry: **8 representative scenarios** (`representative_*` kind — illustrative, not verified field proof)
- Sectors with case study entry: partial (welding, cnc, hvac, plumbing, etc.)
- Remaining 19+ sectors: **missing**
- Do not claim "20-year expert proof" is complete until sector case studies exist.

## AI Assistant Status

- **Current production assistant:** NOT LIVE (lib boundary + tests only: `src/lib/ai-assistant/`)
- **LLM role boundary:**
  - Allowed: explain, normalize, guide, draft report language
  - Forbidden: calculate, choose formula, invent coefficients, override validation
- **Future:** Free tier guided discovery; Premium tier result explanation + action assistant
- **No AI calculation authority**

## Unresolved Color Token Debt

**Canonical (design-craft / tailwind):**

| Token | Hex |
|-------|-----|
| Copper CTA | `#C2410C` |
| Copper hover | `#9A3412` |
| Navy/link/focus | `#1E40AF` |
| Success | `#166534` |
| Warning | `#D97706` |
| Danger | `#991B1B` |

**Known debt (review, not auto-replaced in this lock):**

| Value | Location | Note |
|-------|----------|------|
| `#E65100` | industrial-ui.css, industrial-os.css, terminal-panel.css, authority blocks | Review vs `#C2410C` |
| `#0066CC` / `#0077ED` | apple-ui.css | Review vs `#1E40AF` |
| `#000000` | was PremiumPdfTemplate NAVY | **Fixed → `#1E40AF`** in this lock |
| `#2563EB` | was VerdictPdfDocument brand | **Fixed → `#1E40AF`** in this lock |
| Status vivid tones | industrial-os vs design-craft | Terminal/HMI vs report-grade dark tones |

## Audit Standard (production lock)

| Rule | Value |
|------|-------|
| Default BASE_URL | `https://sectorcalc.com` |
| Env override | `SECTORCALC_AUDIT_BASE_URL=https://sectorcalc.com` |
| EN/default routes | **No** `/en` prefix (`localePrefix: as-needed`) |
| Locale prefixes | `tr`, `ar`, `de`, `fr`, `es` |
| Retry on | 500, 502, 503, network error, timeout |
| Attempts | 6 with backoff: 500, 1000, 1500, 2500, 4000, 6000 ms |
| Request timeout | 20s |
| Fatal detection | HTTP 404, title `404:…`, visible pre-`<script>` markers only (RSC payload excluded) |

### Scripts

```bash
npm run audit:revenue-tools
npm run smoke:premium-routes
npm run smoke:locale-routes
npm run smoke:browser-routes
node scripts/smoke-premium-routes.mjs --locale tr
```

**Browser route smoke (`smoke:browser-routes`):** Playwright is **not** a repo devDependency. The script exits with code 2 and skips when Playwright is missing. To run locally or in CI:

```bash
npm install -D @playwright/test
npx playwright install chromium
SECTORCALC_AUDIT_BASE_URL=http://localhost:3000 npm run smoke:browser-routes
```

Optional WebKit: `node scripts/smoke-browser-routes.mjs --browser webkit`

## Next Allowed Work

1. Audit/smoke lock ✓
2. Browser QA (Chrome, Safari, mobile)
3. Performance/cold-start lock
4. Grouped catalog search
5. Regional Unit Engine
6. Smart Form Architecture

## Remaining Risks

- Browser hydration crash — curl smoke cannot fully detect
- `/tr` first-hit cold-start continues
- WIP/stash must not re-enter deploy
- Smart Form still not production-wide
- Regional Engine still not production-wide
- `/verify` backend still P2 debt
- Case study proof layer still incomplete (8/27 representative only)
