# SectorCalc Revenue Flow v1 Production Readiness

**Date:** 2026-06-04  
**Environment:** Firebase `sectorcalc-bf412`  
**Stripe mode:** **test** (`sk_test_*` in `functions/.env` — not committed)  
**Project:** `sectorcalc-bf412`  
**Hosting:** https://sectorcalc-bf412.web.app  
**Canonical domain (frontend env):** `NEXT_PUBLIC_SITE_URL=https://sectorcalc.com`  
**Functions site URL:** `PUBLIC_SITE_URL=https://sectorcalc-bf412.web.app`

---

## 1. Production Readiness Summary

Revenue Flow v1 converts free calculator users into **SectorCalc Pro** ($29/month) subscribers through premium decision analyzers, Stripe Checkout, webhook-driven subscription state, PDF verdict export, and saved reports.

This lock phase verifies security, legal copy, privacy notes, analytics event names, Firestore rules, and Cloud Functions posture **without adding new product features**.

| Area | Status | Notes |
|------|--------|-------|
| Free tools | Ready | Browser-only inputs; privacy note on page |
| Premium analyzers + paywall | Ready | Subscription guard; legal disclaimer on results |
| Pricing + checkout | Ready (test mode) | Auth required; legal block on pricing |
| Stripe webhook | Ready (test mode) | Signature verify; uid metadata required |
| PDF export | Ready | Footer legal disclaimer |
| Report save/history | Ready | Owner-only Firestore rules |
| Account dashboard | Ready | Subscription read + reports privacy note |
| Analytics events | Ready | Central names in `src/lib/analytics/revenue-events.ts` (no-op sink) |
| Admin panel | Unchanged | No admin files modified in this phase |

**Important:** Test mode and live mode Stripe secrets, price IDs, and webhook secrets must **never be mixed**. Live production requires swapping all three to live counterparts and re-running the manual payment checklist.

---

## 2. Stripe Test/Live Checklist

| Item | Status | Notes |
|------|--------|-------|
| `STRIPE_SECRET_KEY` set | ✅ test | Prefix `sk_test_` in local `functions/.env` |
| `STRIPE_PRICE_MONTHLY` set | ✅ test | Must match secret key mode (test price for test key) |
| `STRIPE_WEBHOOK_SECRET` set | ✅ test | Must match Stripe Dashboard endpoint for this mode |
| `PUBLIC_SITE_URL` set | ✅ | `https://sectorcalc-bf412.web.app` |
| Checkout success URL correct | ✅ | With tool: `/tools/premium/{slug}?subscribed=true`; else `/account?subscribed=true` |
| Checkout cancel URL correct | ✅ | `/pricing?canceled=true` |
| Metadata `uid` included | ✅ | Session `metadata.uid` + `client_reference_id` |
| `subscription_data.metadata.uid` included | ✅ | Same metadata object passed to subscription |
| Test/live secrets not mixed | ⚠️ pending live | Currently test-only; swap atomically before live launch |
| Live `sk_live_*` + live price + live webhook | ❌ not yet | Required for production Go |

**Rule:** Do not deploy `sk_live_*` to a test webhook endpoint or vice versa. Rotate webhook secret when switching endpoints.

---

## 3. Webhook Checklist

| Item | Status | Notes |
|------|--------|-------|
| Raw body signature verification | ✅ | `stripe.webhooks.constructEvent(rawBody, signature, secret)` |
| `STRIPE_WEBHOOK_SECRET` required | ✅ | 503 if missing |
| `STRIPE_SECRET_KEY` required | ✅ | 503 if missing |
| Write skipped without `uid` metadata | ✅ | `resolveUid()` — no Firestore write |
| Unknown events ignored | ✅ | `default: break` |
| `checkout.session.completed` → active | ✅ | Retrieves subscription, writes `users/{uid}` |
| `customer.subscription.updated` mapping | ✅ | active/trialing → active; past_due variants → past_due |
| `customer.subscription.deleted` → canceled | ✅ | Forces `status: canceled` |
| Subscription write via Admin SDK only | ✅ | Client `users` write denied in rules |

---

## 4. Legal / No-Refund Checklist

| Item | Status | Location |
|------|--------|----------|
| Subscription renews monthly | ✅ | `PRICING_CHECKOUT_LEGAL` on pricing |
| Cancel anytime | ✅ | Pricing legal + plan bullets |
| Digital product | ✅ | Pricing legal + plan bullets |
| No refunds | ✅ | Pricing legal + plan bullets |
| Estimates only | ✅ | Pricing legal + premium result disclaimer |
| Not financial/legal/engineering advice | ✅ | Pricing legal + `revenueLegalDisclaimer` on results |
| Verify before business decisions | ✅ | Pricing legal + result disclaimer |
| Premium result “Estimates only” disclaimer | ✅ | `revenueLegalDisclaimer` on `PremiumToolPage` |
| PDF footer — technical simulation | ✅ | `VERDICT_REPORT_LEGAL_DISCLAIMER` |
| PDF footer — not advice | ✅ | Same |
| PDF footer — user-provided inputs | ✅ | Same |
| PDF footer — verify outputs | ✅ | Same |
| PDF footer — digital product / no refunds | ✅ | Same |

---

## 5. Privacy / KVKK / GDPR Checklist

| Item | Status | Location |
|------|--------|----------|
| Free tool inputs not stored by default | ✅ | `FREE_TOOL_PRIVACY_NOTE` on free tool pages |
| Paid reports saved only by user action | ✅ | `PAID_TOOL_SAVE_PRIVACY_NOTE` on premium tool pages |
| Account reports linked to user account | ✅ | Account dashboard + `/account/reports` |
| User can read own subscription | ✅ | Firestore `users/{uid}` read own |
| Client cannot write subscription | ✅ | Firestore `users` write denied |
| Stripe PII handled by Stripe Checkout | ✅ | Email required for checkout; not stored in client rules |
| No secrets in frontend bundle | ✅ | Stripe secret only in Functions params |

---

## 6. Analytics / Conversion Tracking Checklist

Central module: `src/lib/analytics/revenue-events.ts`  
Sink: **no-op** (no console logging in production). Wire to GA4/PostHog when provider is ready.

| Event | Trigger | Wired |
|-------|---------|-------|
| `free_tool_started` | First input change on free tool | ✅ `FreeToolPage` |
| `free_tool_completed` | Free form submit with result | ✅ `FreeToolPage` |
| `premium_analyzer_viewed` | Premium tool page mount | ✅ `PremiumToolPage` |
| `paywall_viewed` | Signed-in user without active sub | ✅ `PremiumToolPage` |
| `pricing_viewed` | Pricing grid mount | ✅ `PricingPlansGrid` |
| `checkout_started` | Pro checkout button click | ✅ `ProCheckoutButton` |
| `checkout_returned_success` | `?subscribed=true` on pricing/premium | ✅ `SubscriptionActivationBanner` |
| `premium_result_generated` | Verdict generated (active sub) | ✅ `PremiumToolPage` |
| `verdict_pdf_downloaded` | PDF download click | ✅ `DownloadVerdictPdfButton` |
| `verdict_report_saved` | Successful save to Firestore | ✅ `SaveVerdictReportButton` |

---

## 7. Firestore Rules Checklist

| Rule | Status | Implementation |
|------|--------|----------------|
| `users/{uid}` — read own | ✅ | `request.auth.uid == userId` |
| `users/{uid}` — client write denied | ✅ | `allow write: if false` |
| `reports` — read own | ✅ | `resource.data.uid == request.auth.uid` |
| `reports` — create own uid only | ✅ | `request.resource.data.uid == request.auth.uid` |
| `reports` — update/delete denied | ✅ | `allow update, delete: if false` |
| `leadIntents` / admin — unchanged | ✅ | Admin read; validated create only |
| Default deny all | ✅ | Catch-all `allow read, write: if false` |

---

## 8. Functions Security Checklist

### `createStripeCheckout`

| Item | Status |
|------|--------|
| `Authorization: Bearer` Firebase ID token required | ✅ 401 without |
| Email required for checkout | ✅ 400 without |
| Missing Stripe env → 503 | ✅ |
| CORS whitelist (web.app + sectorcalc.com) | ✅ `functions/src/constants.ts` |
| No subscription write from checkout handler | ✅ Webhook only |

### `stripeWebhook`

| Item | Status |
|------|--------|
| Stripe signature on raw body | ✅ |
| Webhook secret required | ✅ |
| No write without uid | ✅ |
| Unknown events ignored | ✅ |
| Status mapping correct | ✅ |

---

## 9. Manual Production Test Steps

Use Stripe **test** card `4242 4242 4242 4242` until live keys are deployed.

| Step | URL / action | Expected | Result |
|------|--------------|----------|--------|
| 1 | `/` | Home loads; nav links work | ☐ |
| 2 | `/tools/free/machine-time-calculator` | Risk result only; privacy note visible | ☐ |
| 3 | `/tools/premium/cnc-quote-risk-analyzer` (logged out) | Login CTA; no analyzer form | ☐ |
| 4 | `/pricing?tool=cnc-quote-risk-analyzer` | $29/month; legal block; checkout CTA | ☐ |
| 5 | Sign in → Start SectorCalc Pro | Stripe Checkout opens | ☐ |
| 6 | Complete payment | Redirect with `?subscribed=true` | ☐ |
| 7 | Firebase `users/{uid}` | `subscription.status = active` | ☐ |
| 8 | Premium analyzer (active) | Verdict; save privacy note | ☐ |
| 9 | Download Verdict PDF | PDF with footer disclaimer | ☐ |
| 10 | Save to My Reports | Report in `/account/reports` | ☐ |
| 11 | `/account` | Active subscription UI | ☐ |
| 12 | `/admin/leads` | Admin shell unchanged | ☐ |

See also: [revenue-flow-v1-live-qa.md](./revenue-flow-v1-live-qa.md) for automated pre-checks.

---

## 10. Go / No-Go Verdict

| Verdict | **Conditional No-Go for live Stripe sales** |
|---------|-----------------------------------------------|
| **Reason** | All code, legal, privacy, rules, and function security checks pass on **test mode**. Live production requires: (1) `sk_live_*` + live `STRIPE_PRICE_MONTHLY`, (2) live webhook endpoint + secret on deployed `stripeWebhook`, (3) confirm `PUBLIC_SITE_URL` matches production hosting domain for success/cancel URLs, (4) complete manual payment checklist above on live keys. |
| **Go for** | Test/sandbox QA on `sectorcalc-bf412.web.app`; internal demos; continued v1 feature work behind test Stripe. |
| **Blockers before live Go** | Swap Stripe to live mode atomically; run steps 5–11 with real payment; verify sectorcalc.com CORS if canonical domain serves the app. |

**Signed off by:** _pending manual payment verification_  
**Next action:** Complete manual checklist → swap live Stripe env → redeploy functions → re-run webhook test → update verdict to **Go**.

---

## Deploy & Verify Commands

```bash
cd functions && npm run build
firebase deploy --only functions --project sectorcalc-bf412

npm run lint
npx tsc --noEmit
npm run build

# If firestore.rules changed:
firebase deploy --only firestore:rules --project sectorcalc-bf412

firebase deploy --only hosting --project sectorcalc-bf412
```
