# SectorCalc Revenue Environment Standard

**Project:** `sectorcalc-bf412`  
**Last verified:** 2026-06-06

---

## Server Secrets

These values must stay in Firebase Functions secret/env only:

| Secret | Purpose |
|--------|---------|
| `STRIPE_SECRET_KEY` | Stripe API (checkout, subscription) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `STRIPE_PRICE_MONTHLY` | Pro monthly price ID |
| `PUBLIC_SITE_URL` | Success/cancel redirect base URL |
| `ADMIN_LEAD_UPDATE_SECRET` | Admin lead pipeline writes (Functions only) |

Local development: copy `functions/.env.example` → `functions/.env` (gitignored).

---

## Frontend Public Values

Allowed public values:

- Cloud Function URLs (`NEXT_PUBLIC_*_URL` flags)
- Public Firebase client config (`NEXT_PUBLIC_FIREBASE_*`)
- Public feature flags (`NEXT_PUBLIC_ENABLE_*`)

---

## Forbidden

Never expose these as `NEXT_PUBLIC` values:

- Stripe secret key
- Stripe webhook secret
- Firebase service account JSON
- Admin update secret
- Private key / `BEGIN PRIVATE KEY` material

Never commit:

- `.env.local`
- `functions/.env`
- `*service-account*.json`
- `*firebase-adminsdk*.json`

Run before commit: `npm run check:secrets`

---

## Subscription Writes

Subscription status is written only by backend/webhook logic (Cloud Functions Admin SDK).

Frontend must **not** write:

```
users/{uid}/subscription.status
```

Client SDK subscription writes are blocked by Firestore rules (`users/{userId}` → `allow write: if false`).

---

## Firestore Rules

| Path | Client read | Client write |
|------|-------------|--------------|
| `users/{uid}` | Own doc only (authenticated) | **Denied** |
| `reports/{id}` | Owner only (`uid` match) | Create only (owner `uid`) |
| `leadIntents/{id}` | Admin claim only | Create only (validated fields) |

Subscription activation flows through `stripeWebhook` Cloud Function — not client writes.

---

## Related Docs

- [firebase-region-standard.md](./firebase-region-standard.md) — function region lock
- [sectorcalc-stability-settings.md](./sectorcalc-stability-settings.md) — deploy discipline
- [env-checklist.md](./env-checklist.md) — full env variable list
