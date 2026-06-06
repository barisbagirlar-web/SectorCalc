# SectorCalc Revenue Flow v1 Live QA

**Date:** 2026-06-06  
**Environment:** Firebase Hosting `sectorcalc-bf412` — https://sectorcalc-bf412.web.app  
**Stripe mode:** test (keys present in `functions/.env`; not committed)  
**Tester:** Cursor agent (automated) + manual follow-up required for Google OAuth / Stripe payment  
**Test user:** Not used in automated run — full checkout requires a real Google sign-in in browser

## Flow Tested

| Item | Value |
|------|--------|
| Free tool | `/tools/free/machine-time-calculator` |
| Premium analyzer | `/tools/premium/cnc-quote-risk-analyzer` |
| Pricing URL | `/pricing?tool=cnc-quote-risk-analyzer` |
| Checkout | `createStripeCheckout` (401 without auth — expected) |
| Webhook | `stripeWebhook` (400 without signature — expected; not 503) |
| Subscription | Manual — requires completed test payment |
| PDF | Manual — requires active subscription |
| Report save | Manual — requires active subscription |
| Account dashboard | Automated logged-out; active state manual |

## Pre-checks

| Check | Result |
|-------|--------|
| `STRIPE_SECRET_KEY` in `functions/.env` | Present (not logged) |
| `STRIPE_WEBHOOK_SECRET` in `functions/.env` | Present (not logged) |
| `STRIPE_PRICE_MONTHLY` in `functions/.env` | Present (not logged) |
| `PUBLIC_SITE_URL` in `functions/.env` | `https://sectorcalc-bf412.web.app` (matches live hosting) |
| `NEXT_PUBLIC_SITE_URL` in `.env.local` | `https://sectorcalc.com` (canonical; domain not used in this QA session) |
| `createStripeCheckout` deployed | Yes (`us-central1`, v2) |
| `stripeWebhook` deployed | Yes (`us-central1`, v2) |
| Frontend checkout URL | Falls back to `https://us-central1-sectorcalc-bf412.cloudfunctions.net/createStripeCheckout` |
| Firestore rules `users/{uid}` read | Rule present — own uid only |
| Firestore rules `reports` create/read | Rule present — own uid only |

## Results

| Step | Expected | Actual | Status |
|------|----------|--------|--------|
| Logged-out premium access | Login CTA; no form/PDF/save | Playwright: login CTA; no Run analyzer / PDF | **PASS** |
| Free tool result | Risk only; no safe price/verdict/PDF | Playwright: Risk signal + Unlock CTA; no PDF | **PASS** |
| Pricing CTA | $29 + unlock banner + checkout CTA | Playwright: banner + $29 + Start SectorCalc Pro | **PASS** |
| Stripe payment | Success with test card | Not run — requires Google sign-in + browser | **MANUAL** |
| Webhook | `subscription.status = active` | Not verified — no test payment in this session | **MANUAL** |
| Premium access (active) | Form + verdict; no formulas | Not run — requires active subscription | **MANUAL** |
| PDF export | PDF downloads with verdict/metric/disclaimer | Not run — requires active subscription | **MANUAL** |
| Save report | `reports/{id}` with correct uid/result | Not run — requires active subscription | **MANUAL** |
| Account dashboard | Active UI + recent reports | Logged-out login CTA — **PASS**; active state **MANUAL** |
| Report detail | Verdict + PDF; uid isolation | **MANUAL** |
| Admin regression | Admin leads shell loads | Playwright: Admin/sign-in shell OK | **PASS** |
| Checkout endpoint auth | 401 without Bearer token | HTTP 401 | **PASS** |
| Webhook endpoint config | Not 503 | HTTP 400 “Missing Stripe signature.” | **PASS** |
| Live routes HTTP 200 | Premium, free, pricing, account | All 200 on web.app | **PASS** |
| Console errors (smoke) | None on tested pages | Playwright: no page errors | **PASS** |

## Manual test checklist (remaining)

Use **Stripe test card** `4242 4242 4242 4242`, future expiry, any CVC.

1. Sign in with Google on `/login?next=/pricing?tool=cnc-quote-risk-analyzer`
2. Click **Start SectorCalc Pro** → Stripe Checkout opens
3. Complete payment → expect redirect to `/tools/premium/cnc-quote-risk-analyzer?subscribed=true` (or `/account?subscribed=true` if no tool param)
4. Firebase Console → `users/{uid}` → `subscription.status` = `active`, Stripe IDs populated
5. Open premium analyzer → run inputs → verdict (no formulas)
6. **Download Verdict PDF** → verify content
7. **Save to My Reports** → Firestore `reports/{id}`
8. `/account` → active subscription + report in recent list
9. `/account/reports/{id}` → detail + PDF

## Issues Found

1. **CORS:** `createStripeCheckout` `ALLOWED_ORIGINS` did not include `https://sectorcalc.com` / `www` — checkout from production domain would fail once sectorcalc.com points at the app.
2. **Env split:** `NEXT_PUBLIC_SITE_URL` targets `sectorcalc.com` while live QA ran on `sectorcalc-bf412.web.app`; `PUBLIC_SITE_URL` correctly targets web.app for Stripe success URLs on current hosting.

## Fixes Applied

1. Added `https://sectorcalc.com` and `https://www.sectorcalc.com` to `functions/src/constants.ts` `ALLOWED_ORIGINS`.
2. Redeployed Cloud Functions after CORS fix.

## Commands run

```bash
cd functions && npm run build
firebase deploy --only functions --project sectorcalc-bf412
npm run lint
npx tsc --noEmit
npm run build
firebase deploy --only hosting --project sectorcalc-bf412
```

## Final Verdict

Revenue Flow v1 **passes automated smoke QA** on `sectorcalc-bf412.web.app` for visitor guardrails, free-tool boundaries, pricing discovery, account login shell, and admin regression.

**Full revenue path (Stripe payment → webhook → active premium → PDF → save → account)** is **not marked production-ready until manual sandbox payment is completed once** with the checklist above. No blocking code defects were found in automated testing; CORS for sectorcalc.com was patched proactively.
