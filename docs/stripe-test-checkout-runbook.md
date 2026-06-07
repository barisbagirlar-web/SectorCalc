# Stripe Test Checkout Runbook

Manual payment flow verification using Stripe test mode.

**Endpoint:** Firebase Cloud Function `createStripeCheckout`  
**Webhook:** Firebase Cloud Function `stripeWebhook`

---

## Required env (Firebase Functions)

| Variable | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Server-only — checkout + webhook |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verify |
| `STRIPE_PRICE_SINGLE_VERDICT` or `STRIPE_PRICE_SINGLE_REPORT` | Single report price |
| `STRIPE_PRICE_MONTHLY` or `STRIPE_PRICE_PRO_MONTHLY` | Pro subscription |
| `STRIPE_PRICE_TEAM` or `STRIPE_PRICE_TEAM_MONTHLY` | Team subscription |
| `PUBLIC_SITE_URL` | Success/cancel redirect base |

**Client:** `NEXT_PUBLIC_SITE_URL` (canonical, no trailing slash)

Do **not** put secrets in `NEXT_PUBLIC_*`.

---

## Test cards

Use [Stripe test cards](https://docs.stripe.com/testing) from the Stripe dashboard:

| Card | Result |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0025 0000 3155` | Requires authentication (3DS) |

---

## Stripe CLI (webhook local/forward)

```bash
stripe listen --forward-to https://stripewebhook-nomt4vp7sa-uc.a.run.app
stripe trigger checkout.session.completed
```

Confirm Firestore `premiumEntitlements` document after trigger (with valid metadata uid).

---

## Manual test sequence

### Single report

1. Sign in with Firebase Auth
2. Open `/en/tools/premium-schema/cnc-oee-loss`
3. Click **Unlock full report**
4. Confirm Stripe Checkout opens (mode: payment)
5. Complete payment with test card
6. Confirm `/en/checkout/success?session_id=…` opens
7. Confirm webhook received `checkout.session.completed`
8. Confirm Firestore `premiumEntitlements/stripe_session_{sessionId}` exists with `plan: single_report`, `status: active`, `premiumSlug`
9. Return to `/en/tools/premium-schema/cnc-oee-loss`
10. Confirm full report visible; PDF/CSV export works
11. Confirm non-matching slug still locked (if `premiumSlug` set)

### Pro subscription

1. Open `/en/pricing`
2. Click Pro CTA
3. Complete subscription checkout
4. Confirm webhook + `stripe_sub_{subscriptionId}` doc
5. Confirm any premium analyzer exports

### Team subscription

1. Open `/en/pricing`
2. Click Team CTA
3. Repeat Pro checks with `plan: team`

### Cancel flow

1. Start checkout from pricing or locked report
2. Click back / cancel in Stripe
3. Confirm `/en/checkout/cancel` opens
4. Confirm **no** new active entitlement
5. Confirm export still locked

### Payment failure

1. Use decline test card
2. Confirm no active entitlement
3. Confirm export locked

---

## Duplicate webhook test

1. Replay same `checkout.session.completed` event (Stripe CLI or dashboard)
2. Confirm doc id unchanged (`stripe_session_{sessionId}`)
3. Confirm `reportsUsed` not reset to 0 on merge
4. Confirm no second doc for same session

---

## Sign-off

Record in [Final Monetization Verdict](./final-monetization-verdict.md).
