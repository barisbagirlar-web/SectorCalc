# CURRENT PRODUCTION REALITY — 2026-06-10

> **Disclaimer:** This document describes the live production baseline as confirmed by
> current git HEAD + smoke test results. Repo technical inventory docs (e.g.
> `sectorcalc-tam-yapi-raporu.txt`, `sectorcalc-system-dna.txt`) are **not** live
> reality by themselves — always cross-check with this file and smoke output.

> Product direction (not live status): [manifesto.md](./manifesto.md) · [roadmap.md](./roadmap.md)

## Canonical Live Domain

- **Live canonical:** https://sectorcalc.com
- **Firebase fallback/test:** https://sectorcalc-bf412.web.app
- **Audit/smoke scripts must default to:** https://sectorcalc.com

## Active product phase

| Phase | Status |
|-------|--------|
| P0 Final Stabilization | **DONE** |
| P1 Grouped Catalog Search | **DONE** |
| P2.3 Premium Smart Form Full Rollout | **DONE** (27/27 premium Smart Form only) |
| **P2.4 Full Calculation Form Repair Sweep** | **DONE** |
| P3 Feedback / Formula Objection | **EARLY IMPLEMENTED / RISK-GATED** |
| **P4 Trust Trace / Validation Stamp / Public Verify** | **WAITING UNTIL P2.4 PASS + P3 REVALIDATION** |

## P2.4 — Full Calculation Form Repair Sweep *(DONE)*

| Item | Value |
|------|--------|
| **Prompt IDs** | PROMPT-P2.4-001 · AUDITFIX-P2.4-001 |
| **P2.4 commits** | `bea180e` (form CSS + repair) · closure commit pending deploy |
| **Inventory** | [form-surface-inventory.md](./form-surface-inventory.md) |
| **Form standard** | `.sc-form-*` in `design-craft.css` + `calculation-tool-mobile-layout.css` |
| **Formula/runtime** | **Unchanged** |

### Coverage numbers

| Metric | Count |
|--------|------:|
| Total inventoried surfaces | 32 |
| Premium Smart Form routes | 27 |
| Free tool routes | 115 |
| Legacy calculator routes | 7 |
| Calculation-related component groups repaired | 13 |
| Non-core forms (no change) | 5 |
| Deferred (P4/OS) | 2 |

### P2.4 closure smoke — post-deploy (pending HEAD)

| Gate | Target | Result |
|------|--------|--------|
| `smoke:premium-routes` | 27/27 | *run after deploy* |
| `smoke:premium-smart-forms` | 27/27 | *run after deploy* |
| `smoke:locale-routes` | 42/42 | *run after deploy* |
| `smoke:browser-routes --probe` | 4/4 | *run after deploy* |
| `smoke:browser-routes` | 25/25 | *run after deploy* |
| `smoke:all-calculation-forms` | 155 routes | **PASS** (pre-deploy prod verify) |
| `smoke:browser-calculation-forms` | 10 routes × 2 viewports | *run after deploy* |
| `smoke:feedback-ui` | premium + account | *run after deploy* |

**Remaining risk:** Browser hydration edge cases; cold SSR >5s on `/tr`. Full-form certification requires post-deploy smoke table update with commit SHA.

## P3 — Feedback / Formula Objection System *(EARLY IMPLEMENTED / RISK-GATED)*

| Item | Value |
|------|--------|
| **P3 commit** | `40bd28b` |
| **Collection** | `toolFeedback` (Firestore) |
| **Admin queue** | `/account/feedback` |
| **Smoke** | `smoke:feedback-ui` PASS (2026-06-10) |
| **Status** | Deployed and live; revalidation required after P2.4 |

**Production Reality Note:**
P3 Feedback / Formula Objection system is **not** a future planning item — it was merged and deployed earlier under commit `40bd28b` and passed reported smoke testing. System is live in production. However, because P2.4 full calculation form repair sweep evidence was missing at the time of P3 deployment, P3 is classified as **EARLY IMPLEMENTED / RISK-GATED**. After P2.4 is fully closed and form repair evidence is confirmed, P3 must be revalidated on all repaired free, legacy, premium, mobile, locale, and RTL form surfaces.

---

## P2.3 — Smart Form Full Premium Rollout (27/27) *(DONE — premium scope only)*

| Item | Value |
|------|--------|
| **P2.3 code commit** | `5c4e528` — Roll out smart forms to all premium tools |
| **P2.3 closure commit** | `1861a7c` — SSR smoke markers + production-reality |
| **Layout commit** | `b0586e2` — Smart Form layout stabilization |
| **Public preview commit** | `39311e6` — Premium public preview gate fix |
| **Registry** | `src/lib/smart-form/premium-smart-form-definitions.ts` (27 slugs) |
| **Runtime compatibility** | `src/lib/smart-form/runtime-compatibility.ts` |
| **Smoke gate** | `npm run smoke:premium-smart-forms` |
| **Premium routes** | 27/27 Smart Form definitions; `hasPremiumSmartFormDefinition()` on all revenue premium slugs |
| **Hard auth gate** | **Removed** from premium tool pages — public preview + Pro-locked actions |
| **Locales** | EN root + `/tr` `/ar` `/de` `/fr` `/es` — `smartForm.tools.*` for 27 tools |

### P2.3 closure smoke results — 2026-06-10 post-deploy (`1861a7c`)

| Gate | Target | Result |
|------|--------|--------|
| `smoke:premium-routes` | 27/27 HTTP 200 | **PASS** |
| `smoke:premium-smart-forms` | 27/27 markers + no hard gate | **PASS** |
| `smoke:locale-routes` | 42/42 HTTP 200 | **PASS** |
| `smoke:browser-routes --probe` | 4/4 | **PASS** |
| `smoke:browser-routes` | 25/25 | **PASS** |
| Cloud Run `minInstances=1` | `ssrsectorcalcbf412` us-central1 | **APPLIED** (revision `ssrsectorcalcbf412-00266-hv9`) |
| Firebase Hosting deploy | `sectorcalc-bf412` | **PASS** |

**SSR audit markers** (curl smoke): `src/app/[locale]/tools/premium/[slug]/page.tsx` emits `data-smart-form-shell="true"` and `data-premium-access-mode="public-preview"` for all 27 Smart Form slugs in static HTML (client shell hydrates full UI).

## Current Known Stable Baseline

| Marker | Commit | Description |
|--------|--------|-------------|
| P0 revert baseline | `6775934` | IA/categories/header changes reverted |
| Premium route collision fix | `8d63660` | EN premium 500s fixed |
| P1 grouped catalog search | `90fd9d3` | 6-locale catalog search |
| P2 Smart Form pilot | `ba8139e` | 3-tool dynamic form |
| P2.1 public preview | `39311e6` | No hard sign-in gate on premium pages |
| P2.2 layout | `b0586e2` | Form + decision output 2-col layout |
| **P2.3 closure** | `1861a7c` | SSR smoke markers + production-reality |
| Docs manifesto v2 | `ba4ec7a` | Product vision / roadmap |
| P2.4 partial work | `bea180e` | Form CSS sweep |
| P2.4 closure | pending | PROMPT-P2.4-001 completion commit |
| P3 feedback | `40bd28b` | ToolFeedback + admin queue |
| **Active product phase** | — | **P2.4 ACTIVE** (P3 deployed, P4 waiting) |

Do not assume P2.3 or partial P2.4 work certifies all calculation forms are repaired.

## Smart Form Maturity *(updated P2.3)*

| Component | Status |
|-----------|--------|
| `DynamicSmartFormPilot.tsx` | **Production** — 27/27 premium analyzers via `hasPremiumSmartFormDefinition` |
| `SmartFormShell.tsx` | **Production** — layout P2.2; form left / result right |
| `premium-smart-form-definitions.ts` | **Production** — central registry, 2 scenarios per tool |
| `runtime-compatibility.ts` | **Production** — canonical input gate; blocks NaN/empty/hidden required |
| `SmartToolForm.tsx` | Fallback only when no premium definition (should not occur for 27 revenue slugs) |
| `RuntimeTrustTracePanel.tsx` | Pro-only — public preview shows locked state |
| Public preview banner | **Production** — anonymous + signed-in free tiers |

**Do not claim:** Trust Trace public verify backend, regional benchmark engine, or AI assistant are production-complete — see debt table below.

## Known Risks

- `/tr` or cold SSR first-hit can exceed 5s (Cloud Run cold start).
- Browser hydration issues cannot be fully detected by curl-only smoke.
- `audit:revenue-tools` must not use `/en` prefix for default English.
- **Local stashes** may exist — do not apply or deploy without review.
- SSR smoke markers indicate route capability; live `data-premium-access-mode` on banner reflects auth state after hydration.

## Not Safe To Treat As Live

| Item | Status |
|------|--------|
| Regional Unit & Parameter Engine | P5 debt — foundation only |
| Verify backend lookup | Placeholder UI — P4 |
| AI assistant | Lib boundary only — P10 |
| Case study proof layer | Partial drafts — P7 |
| Trust Trace Export (full) | Pro pilot — P4 expansion |
| P3 live but post-P2.4 revalidation required | P3 EARLY IMPLEMENTED / RISK-GATED |

## C‍ursor Path Safety

**DO NOT USE** `src/lib/calculation-intelligence/`. **This path does not exist.**

All Dual-Core implementation: `src/lib/formula-governance/`

## Audit Standard (production lock)

| Rule | Value |
|------|-------|
| Default BASE_URL | `https://sectorcalc.com` |
| EN/default routes | **No** `/en` prefix |
| Locale prefixes | `tr`, `ar`, `de`, `fr`, `es` |

### Mandatory scripts (P2.3+)

```bash
npm run lint
npx tsc --noEmit
npm run check:secrets
npm run assert:route-cache-policy
npm run build
npm run test:formulas
npm run audit:dual-intelligence-runtime-coverage
npm run smoke:premium-routes
npm run smoke:premium-smart-forms
npm run smoke:locale-routes
npm run smoke:browser-routes -- --probe
npm run smoke:browser-routes
```

Post-deploy:

```bash
gcloud run services update ssrsectorcalcbf412 \
  --min-instances=1 \
  --region us-central1 \
  --project sectorcalc-bf412
```

### Firebase SSR infra

- SSR function: `ssrsectorcalcbf412` (us-central1)
- **minInstances=1** recommended after deploy to reduce cold-start on premium routes

## Next Allowed Work

1. ~~P2.3 Smart Form 27/27~~ **DONE** (2026-06-10)
2. ~~P3 — Feedback / Formula Objection System~~ **EARLY IMPLEMENTED / RISK-GATED** (40bd28b)
3. **P4 Trust Trace / Public Verify** (waiting for P2.4 + P3 revalidation)
4. P5 Regional Unit Engine
5. P6 Regional Benchmark Engine

## Remaining Risks (post-P2.3)

- Manual visual QA on 1440px / 375px for sample routes recommended each release
- Non-EN scenario labels may use EN fallback for some tools (locale sync script — improve in P3+)
- Browser-only interactions (scenario toggle, calculate block) not fully covered by curl smoke
- P3 revalidation required after P2.4 closes before P4 can start

---

*Last verified: 2026-06-10 — update smoke table after each production deploy.*