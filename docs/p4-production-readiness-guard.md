# P4 — Production Readiness Guard

P4 is a **pre-deploy safety layer**. It runs audits and smoke checks, writes reports under `scripts/.cache/`, and produces a **GO / NO_GO** deploy guard verdict. **P4 does not deploy** anything (no Firebase, no Cloudflare).

## What P4 checks

| Layer | Script | Report |
| --- | --- | --- |
| Golden Oracle | `npm run test:p4-golden-oracle` | `scripts/.cache/p4-golden-oracle-report.json` |
| Runtime smoke | `npm run test:p4-runtime-smoke` | `scripts/.cache/p4-runtime-smoke-report.json` |
| Brevo dry-run | `npm run notify:p4-brevo-dry-run` | `scripts/.cache/p4-brevo-health-dry-run.json` |
| Deploy guard | `npm run audit:p4-deploy-guard` | `scripts/.cache/p4-deploy-guard-report.json` |

P4 also expects upstream gate reports to exist (from the same session):

- `assert:revenue-gate`
- `audit:p24-tool-quality`
- `audit:runtime-trust-engine`
- `audit:p25-control-plane`
- `audit:input-guides`
- `audit:quarantine-recovery`

## What P4 does **not** do

- No hosting or functions deploy
- No payment / P9 / billing code changes
- No Formula Gate unlock for the problem slug
- No commit of `scripts/.cache/**`
- No frontend exposure of `BREVO_API_KEY` or `DEEPSEEK_API_KEY`

## Golden Oracle

Reads cached P24 + Runtime Trust reports (does **not** re-run those audits).

- Validates **8 target payment-eligible slugs** (oracle + P24 PASS)
- Validates **problem slug** stays blocked: `paymentEligible=false`, `formulaGateEligible=false`
- Validates **free tools**: `paymentEligible = 0`
- Verdict: `PASS` | `FAIL`

## Runtime smoke

Technical smoke only — **not** a replacement for manual desktop/mobile UI QA.

- Requires `npm run build` first (checks `.next/BUILD_ID`, manifests, static HTML)
- Verifies critical routes exist in prerender manifest, static HTML, or app-path manifest
- Verdict: `PASS` | `FAIL`

## Brevo dry-run safety

Server-side Node script only (`scripts/notifications/p4-brevo-health-dry-run.mjs`).

| Condition | Behavior |
| --- | --- |
| `BREVO_API_KEY` missing | `status: unavailable`, exit 0, **not a deploy blocker** |
| Key present, default | Payload preview only (`mustNotSend: true`) |
| `P4_BREVO_SEND=true` | Allows real send (opt-in only) |

Secrets stay in `.env.local` / CI env — never in frontend or repo.

## Deploy guard — GO / NO_GO

`npm run audit:p4-deploy-guard` aggregates:

**Blockers (NO_GO):**

- Dirty git working tree
- Forbidden staged paths (`.env*`, `scripts/.cache/`, `functions/`, `apps/`, `public/ai-*`, billing, etc.)
- `assert:revenue-gate` fail
- Missing or failing P24 / runtime trust / P25 / input guides / quarantine reports
- Golden oracle or runtime smoke `FAIL`
- `paymentEligible !== 22` or `formulaGateEligible !== 22`
- Free `paymentEligible > 0`
- Problem slug not safe
- Cache files tracked in git

**Warnings (do not block GO):**

- DeepSeek health unavailable or error
- Brevo unavailable (no API key)

## Problem slug policy

`abonelik-yazilim-cloud-yillik-maliyet-hesabi` must remain:

- `paymentEligible: false`
- `formulaGateEligible: false`

Payment and Formula Gate stay closed for this slug outside explicit future authorization.

## Recommended run order

```bash
git status --short
npm run lint
npx tsc --noEmit
npm run build
npm run assert:revenue-gate
node scripts/tool-activation/audit-p24-tool-quality.mjs
node scripts/tool-activation/audit-runtime-trust-engine.mjs
npm run audit:legacy-conflicts
npm run audit:p25-control-plane
npm run audit:quarantine-recovery
npm run audit:input-guides
npm run build:formula-knowledge-graph
npm run ai:deepseek:export-tool-context
npm run ai:deepseek:health

npm run test:p4-golden-oracle
npm run test:p4-runtime-smoke
npm run notify:p4-brevo-dry-run
npm run audit:p4-deploy-guard
```

## Manual UI checklist (required before deploy)

P4 scripts do **not** replace human verification:

- [ ] Desktop: home, pricing, premium-tools, one free tool, one premium tool
- [ ] Mobile: same routes, no horizontal scroll, touch targets OK
- [ ] Browser console: no errors on changed routes
- [ ] Network tab: no unexpected 4xx/5xx on critical pages
- [ ] Pricing / payment routes: visual check only (no P9 changes in P4)
- [ ] Problem slug: no payment CTA, no Formula Gate approved badge
- [ ] Free tools: no payment / checkout surfacing

## Staging safety

Only stage P4 source files:

```bash
git add package.json scripts/qa scripts/tool-activation scripts/notifications docs
```

Never stage `scripts/.cache/`, `.env*`, `functions/`, `apps/`, `public/ai-*`, or `src/lib/billing/`.
