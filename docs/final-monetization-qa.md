# SectorCalc Final Monetization QA

End-to-end verification that SectorCalc can safely accept payment and unlock premium report access.

**Related:**
- [Monetization Blocker Matrix](./monetization-blocker-matrix.md)
- [Stripe Test Checkout Runbook](./stripe-test-checkout-runbook.md)
- [Entitlement QA Checklist](./entitlement-qa-checklist.md)
- [Final Monetization Verdict](./final-monetization-verdict.md)
- [Live KPI Review Runbook](./live-kpi-review-runbook.md)

---

## Goal

Verify that SectorCalc can safely accept payment and unlock premium report access without client-side trust of `session_id`, without public Firestore writes, and without full export without entitlement.

---

## Architecture (as deployed)

| Layer | Location |
|---|---|
| Checkout session | Firebase Cloud Function `createStripeCheckout` |
| Webhook | Firebase Cloud Function `stripeWebhook` |
| Entitlement write | Admin SDK → `premiumEntitlements` collection |
| Entitlement read | Client Firestore snapshot (auth user, rules-gated) |
| Billing config | `src/lib/billing/billing-config.ts` |
| Export gate | `PremiumReportExportActions`, `PremiumPrintReportShell` |

There is **no** Next.js `/api/billing/*` route — do not create a parallel payment path.

---

## Critical revenue paths

### Path 1 — Single report

Pricing or locked report → **Unlock full report** CTA → `planId: single_report` + `premiumSlug` → Stripe Checkout → `/checkout/success` → webhook `checkout.session.completed` → `premiumEntitlements` doc `stripe_session_{id}` → same analyzer full report → PDF/CSV export

### Path 2 — Pro subscription

Pricing → Pro CTA → `planId: pro_monthly` → Checkout → Success → Webhook → `pro` entitlement (`stripe_sub_{id}`) → all premium analyzers full report → export

### Path 3 — Team subscription

Pricing → Team CTA → `planId: team_monthly` → Checkout → Success → Webhook → `team` entitlement → all premium analyzers full report → export

### Path 4 — Canceled checkout

Pricing → Checkout → **Cancel** → `/checkout/cancel` → **no** entitlement → locked report remains locked

### Path 5 — Payment failure

Payment failed / subscription past_due → webhook updates status `pending` or `canceled` → **no active** entitlement → export locked

---

## Pre-flight checklist

- [ ] Firebase Functions env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs
- [ ] Stripe webhook endpoint points to deployed `stripeWebhook` URL
- [ ] User signed in before checkout (auth required)
- [ ] Firestore rules deployed (`premiumEntitlements` write denied to clients)
- [ ] No `NEXT_PUBLIC_STRIPE_SECRET*` in frontend env

---

## Manual QA URLs

| URL | Check |
|---|---|
| `/en/pricing` | Pro/Team CTAs, free → `/free-tools`, pricing events |
| `/en/tools/premium-schema/cnc-oee-loss` | Locked state, unlock CTA, preview only |
| `/en/tools/premium-schema/cnc-oee-loss/print` | Sample print without entitlement |
| `/en/checkout/success` | No client unlock; refresh note |
| `/en/checkout/cancel` | No entitlement messaging |
| `/tr/pricing` | Locale parity |

**Viewports:** 390px mobile, 1440px desktop — no horizontal scroll, no console errors.

---

## Automated QA (CI)

- `src/lib/entitlements/__tests__/final-monetization-qa.test.ts`
- `src/lib/billing/__tests__/final-checkout-config.test.ts`
- Existing: `entitlement-mapping.test.ts`, `billing-config.test.ts`, `checkout-metadata.test.ts`

---

## Sign-off

Record results in [Final Monetization Verdict](./final-monetization-verdict.md).
