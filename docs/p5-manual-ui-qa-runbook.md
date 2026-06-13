# P5 Manual UI QA Runbook

## Phase scope

**P5A does not deploy.** This phase prepares manual UI control packs, route risk audits, and real-user check scenarios only.

**Production go/no-go is blocked until P4 deploy guard completes** in the parallel window. Do not release based on P5A alone.

## Prerequisites

- Clean worktree on branch `p5a-manual-ui-qa` (avoid P4 dirty tree conflicts)
- Node dependencies installed (`npm ci` or `npm install`)
- No `.env` changes required for static route audit
- Optional: `scripts/.cache/runtime-trust-engine-report.json` for payment/trust checks (run `npm run audit:runtime-trust-engine` if missing)

## Automated prep (run in order)

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run assert:revenue-gate
npm run audit:p5-route-risk
npm run check:p5-manual-ui
```

Optional (if P4 guard exists in branch):

```bash
npm run audit:p4-deploy-guard
```

Reports:

- `scripts/.cache/p5-route-risk-audit-report.json`
- `scripts/.cache/p5-manual-ui-checklist.md`

## Manual test sequence

### 1. Build verification

```bash
npm run build
```

Confirm `.next/BUILD_ID` exists and build exits 0.

### 2. Start local preview

```bash
npm run start
```

Or use the project's existing preview script if documented elsewhere.

Default URL: `http://localhost:3000`

### 3. Desktop route control

Open each critical route at ≥1280px width:

| Route | Focus |
|-------|-------|
| `/tr` | Hero, header, locale switch |
| `/en` | Locale parity |
| `/tr/free-tools` | Tile grid density, no overflow |
| `/tr/premium-tools` | Catalog load, no layout break |
| `/tr/pricing` | No misleading payment promise |
| `/tr/trust` | Trust badges accurate |
| `/tr/reports/sample-decision-report` | Report preview renders |
| `/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi` | **Problem slug** — safe state, no payment |
| `/tr/tools/premium/3d-print-job-margin-tool` | Premium form + result |
| `/tr/tools/premium-schema/cnc-oee-loss` | Schema tool surface |
| `/tr/tools/free/machine-time-calculator` | Free tool, no paywall CTA |
| `/tr/tools/free/project-cost-calculator` | Free tool form/result |

Use checklist: `scripts/.cache/p5-manual-ui-checklist.md`

### 4. Mobile route control

Repeat key routes at **390px** width (Chrome DevTools iPhone 12 Pro or custom).

Check:

- No horizontal scroll
- Hamburger menu opens/closes
- Cards stack cleanly
- Inputs and CTAs ≥44px touch target
- Premium vs free distinction clear

### 5. Console control

DevTools → Console on each critical route.

**Block if:** uncaught errors, hydration mismatch, chunk load failure on first paint.

### 6. Network control

DevTools → Network, disable cache, hard reload.

**Block if:** critical route returns 404/500, missing JS chunk, failed font/asset on above-the-fold.

### 7. Problem slug control

Route: `/tr/tools/premium/abonelik-yazilim-cloud-yillik-maliyet-hesabi`

Must show safe review state. Must **not** show:

- Formula Gate approved badge
- Active Calculate/Subscribe CTA
- Payment eligibility UI

Automated assert (live only):

```bash
BASE_URL=https://www.sectorcalc.com node scripts/assert-problem-slug-trust.mjs
```

### 8. Free payment control

On free tool routes, confirm no subscribe/checkout/paywall CTA.

Automated trust check:

```bash
npm run audit:runtime-trust-engine
```

Expect `freePaymentEligible = 0` in trust report.

### 9. Premium eligible route control

Spot-check premium tools that should be payment + formula gate eligible (see P4 golden oracle target list).

Confirm paywall/subscribe path exists only where intended.

## GO / NO-GO criteria

| Criterion | GO | NO-GO |
|-----------|----|----|
| Console | No critical errors on critical routes | Uncaught/hydration/chunk errors |
| Network | No critical 404/500 on critical routes | Failed route or chunk |
| Problem slug | `paymentEligible=false`, `formulaGateEligible=false` | Payment or gate UI shown |
| Free payment | No free tier payment CTA | Any free tool shows payment |
| Pricing | Copy accurate, no false promise | Misleading subscribe/checkout copy |
| Mobile | No horizontal overflow at 390px | Layout break or overflow |
| Tool form/result | Inputs visible, result panel renders | Broken/empty/collapsed UI |

**Verdict mapping:**

- All GO → manual QA **PASS** (still wait for P4 deploy guard before production)
- Any NO-GO → **FAIL**, log in checklist notes table
- Warnings only (slow LCP on premium-tools) → **REVIEW**

## P5B handoff notes

- Route risk JSON feeds P5B automated smoke expansion
- Checklist markdown is the human sign-off artifact
- Do not commit `scripts/.cache/**`
- Do not stage `.env*`, `functions/**`, `public/ai-*`, billing paths

## Related scripts

| Script | Purpose |
|--------|---------|
| `npm run audit:p5-route-risk` | Build + trust route audit |
| `npm run check:p5-manual-ui` | Generate checklist markdown |
| `npm run audit:p4-deploy-guard` | P4 production gate (parallel) |
| `npm run assert:revenue-gate` | Revenue registry guard |
