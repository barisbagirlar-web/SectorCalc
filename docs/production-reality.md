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
| **P2.4 Full Calculation Form Repair Sweep** | **ACTIVE / OPEN** |
| P3 Feedback / Formula Objection | **BLOCKED UNTIL P2.4 DONE** |
| P4 Trust Trace / Validation Stamp / Public Verify | **WAITING** |

### Phase gate (EN)

P2.3 closed only the premium Smart Form rollout scope. It does not certify that every calculation-related form in the product is visually repaired, mobile-safe, locale-safe, and layout-stable. Therefore P2.4 — Full Calculation Form Repair Sweep is now the active phase and P3 must not start before P2.4 closure evidence is produced.

### Faz kapısı (TR)

P2.3 yalnızca premium Smart Form kapsamını kapatır. Bu kapanış, sitedeki tüm hesaplama formlarının düzeldiği anlamına gelmez. Free tool formları, legacy calculator formları, eski hesaplama componentleri ve locale/mobile kaynaklı form kırıkları P2.4 kapsamında ayrıca taranıp kapatılacaktır. P2.4 kapanmadan P3 başlatılmayacaktır.

## P2.4 — Full Calculation Form Repair Sweep *(ACTIVE / OPEN)*

| Item | Value |
|------|--------|
| **Phase status** | **ACTIVE / OPEN** — not closed |
| **Scope** | All calculation-related forms beyond 27/27 premium Smart Form |
| **Partial repo work** | May include `.sc-form-*` CSS, form shell wiring, `smoke:all-calculation-forms` scaffold — **not closure evidence** |
| **Formula/runtime** | Must remain **unchanged** |

### P2.4 scope coverage

| Scope                       | Status | Closure Evidence                     |
| --------------------------- | ------ | ------------------------------------ |
| Premium Smart Forms         | DONE   | 27/27 premium smart forms smoke PASS |
| Free Tool Forms             | OPEN   | Inventory + repair + smoke pending   |
| Legacy Calculator Forms     | OPEN   | Inventory + repair + smoke pending   |
| Calculation Result Panels   | OPEN   | Layout QA pending                    |
| Mobile 375px Forms          | OPEN   | QA pending                           |
| Locale Long Labels          | OPEN   | TR/AR/DE/FR/ES QA pending            |
| RTL Arabic Forms            | OPEN   | QA pending                           |
| All Calculation Forms Smoke | OPEN   | smoke:all-calculation-forms pending  |

### P2.4 can be closed only if

1. All calculation-related form surfaces are inventoried.
2. Form surfaces are classified as: `premium_smart_form`, `free_tool_form`, `legacy_calculator_form`, `report/calculation-related form`, `account/pricing/contact` non-core form.
3. Premium Smart Forms remain 27/27 PASS.
4. Free tool forms are checked and repaired.
5. Legacy calculator forms are checked and repaired.
6. Mobile 375px overflow is checked.
7. Desktop 1440px layout is checked.
8. Arabic RTL is checked.
9. German/French/Spanish long label behavior is checked.
10. No formula logic changes.
11. No runtime calculation changes.
12. No route/slug changes.
13. No `/en` prefix.
14. `smoke:all-calculation-forms` PASS.
15. Browser smoke remains 25/25 PASS.
16. Locale smoke remains 42/42 PASS.
17. This file contains final coverage numbers (surfaces found, surfaces repaired, smoke results).

**Coverage numbers:** *Pending P2.4 closure — do not treat P2.3 smoke as full-form certification.*

## P3 — Feedback / Formula Objection System *(BLOCKED)*

> **EN:** P3 Feedback / Formula Objection is blocked until P2.4 completes. Feedback UI must not be added on top of broken forms.
>
> **TR:** P3, P2.4 tamamlanmadan başlatılmayacak. Kırık formların üzerine feedback UI eklenmeyecek.

| Item | Value |
|------|--------|
| **Product phase** | **BLOCKED UNTIL P2.4 DONE** |
| **Do not start** | No new P3 work until P2.4 closure evidence in this file |

*Historical note:* Commits `40bd28b` / `7e01776` may exist in git from prior exploratory P3 work. That does **not** close product phase P3 or override the P2.4 gate.

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
| P2.4 partial work | `bea180e` | Form CSS sweep — **P2.4 not closed** |
| **Active product phase** | — | **P2.4 OPEN** — see roadmap gate |

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
| Feedback / formula objection queue | P3 — not started |

## Cursor Path Safety

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
2. **P3 — Feedback / Formula Objection System**
3. P4 Trust Trace / Public Verify
4. P5 Regional Unit Engine
5. P6 Regional Benchmark Engine

## Remaining Risks (post-P2.3)

- Manual visual QA on 1440px / 375px for sample routes recommended each release
- Non-EN scenario labels may use EN fallback for some tools (locale sync script — improve in P3+)
- Browser-only interactions (scenario toggle, calculate block) not fully covered by curl smoke

---

*Last verified: 2026-06-10 — update smoke table after each production deploy.*
