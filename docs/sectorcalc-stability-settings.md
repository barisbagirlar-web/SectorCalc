# SectorCalc Stability Settings

**Last verified:** 2026-06-06  
**Purpose:** Lock Firebase region, secrets handling, deploy discipline, and do-not-break list before further revenue/launch work.

---

## 1. Current Firebase Project

| Item | Value |
|------|--------|
| Project ID | `sectorcalc-bf412` |
| Hosting URL | https://sectorcalc-bf412.web.app |
| Canonical domain (env) | https://sectorcalc.com |
| GitHub | https://github.com/barisbagirlar-web/SectorCalc |

---

## 2. Firestore Location

| Item | Value |
|------|--------|
| Database | `(default)` |
| Type | FIRESTORE_NATIVE |
| Edition | STANDARD |
| **Location** | **`nam5`** (North America multi-region) |

**Rule:** Do not change Firestore database location. All client/server code assumes this project and rules set.

---

## 3. Cloud Functions Regions

All deployed functions (verified via `firebase functions:list`):

| Function | Region | Runtime |
|----------|--------|---------|
| `updateLeadPipeline` | us-central1 | nodejs20 |
| `updateLeadTestClassification` | us-central1 | nodejs20 |
| `createStripeCheckout` | us-central1 | nodejs20 |
| `stripeWebhook` | us-central1 | nodejs20 |
| `ssrsectorcalcbf412` (Next SSR) | us-central1 | nodejs22 |

**Required region standard for new revenue functions:** `us-central1` — match existing admin + Stripe + SSR.

**Do not:** Move working admin functions to another region unless user explicitly requests migration with downtime plan.

---

## 4. Secret Handling Rules

### Never commit

- `.env.local`
- `functions/.env` (local only; loaded at deploy via Firebase params)
- `*service-account*.json`, `*firebase-adminsdk*.json`
- `credentials.json`, `*.pem`, `*.key`

### `.gitignore` coverage (verified)

```
.env
.env.local
.env.*.local
*service-account*.json
*firebase-adminsdk*.json
credentials.json
```

### Frontend env (`.env.example`)

- Only `NEXT_PUBLIC_*` Firebase client config (public by design)
- **No** `STRIPE_SECRET_KEY`, **no** `ADMIN_LEAD_UPDATE_SECRET` in frontend
- Comments warn against exposing admin secrets

### Functions env (`functions/.env.example`)

- Placeholders only: `sk_test_your_key`, `whsec_your_webhook_secret`
- Real values live in Firebase Functions params / local `functions/.env` (not committed)

### Pre-commit scan

```bash
npm run check:secrets
```

---

## 5. Firestore Rules Posture

| Collection | Client read | Client write |
|------------|-------------|--------------|
| `users/{uid}` | Own uid only | **Denied** |
| `reports/{id}` | Own uid only | Create own uid only; update/delete denied |
| `leadIntents` | Admin only | Validated create only |
| Default | Denied | Denied |

**Rule:** Subscription status written only via Stripe webhook (Admin SDK), not client SDK.

---

## 6. Application Architecture Guards

| Check | Status |
|-------|--------|
| `src/app/api` routes | **None** (verified) |
| Stripe checkout | Cloud Function + Bearer ID token |
| Stripe webhook | Signature verify on raw body |
| Admin panel checkpoint doc | `docs/admin-panel-stable-checkpoint.md` |
| 17-sector catalog audit | `npm run audit:revenue-tools` |

---

## 7. Dependencies (lean stack)

Production dependencies (no bloat):

- `next`, `react`, `react-dom`
- `firebase` (client)
- `firebase-admin` (scripts/local only)
- `@react-pdf/renderer` (verdict PDF)

**Rule:** No new npm package without stated justification and size/security review.

---

## 8. Deployment Commands

```bash
# After code change — always
npm run lint
npx tsc --noEmit
npm run build
npm run check:secrets

# Functions (only if functions/ changed)
cd functions && npm run build
firebase deploy --only functions --project sectorcalc-bf412

# Hosting (only if frontend changed)
firebase deploy --only hosting --project sectorcalc-bf412

# Rules (only if firestore.rules changed)
firebase deploy --only firestore:rules --project sectorcalc-bf412
```

**Do not deploy** if lint/tsc/build fail.

---

## 9. Do-Not-Break List

- Admin login (`admin: true` claim)
- Lead dashboard, drawer, activity, SLA, quality score
- Lead pipeline Cloud Function + audit log
- Test lead classification function
- Stripe checkout + webhook + subscription sync
- Firestore rules (users read-only write; reports owner rules)
- 17 free + 17 premium tool routes
- Brand assets (`src/config/brand.ts`, `public/img/brand/`)
- Revenue Flow paywall, PDF export, report save

---

## 10. Revenue Flow Implementation Rules

- Registry-driven: `revenue-tools.ts`, `industry-registry.ts`
- Free: risk only, no safe price, no PDF
- Paid: verdict + metric + disclaimer + subscription guard
- Legal + privacy copy centralized in `revenue-tools.ts` / billing constants
- No formulas in UI or PDF

See also:

- `docs/revenue-flow-v1-production-readiness.md`
- `docs/full-catalog-qa.md`
- `docs/cursor-workflow.md`

---

## 11. Manual QA Checklist (stability smoke)

- [ ] `npm run build` passes
- [ ] `npm run audit:revenue-tools` passes
- [ ] `npm run check:secrets` passes
- [ ] `/admin/leads` loads (admin auth)
- [ ] `/pricing` + checkout CTA present
- [ ] One free tool + one premium tool open
- [ ] No secrets in `git diff` before commit

---

## 12. Cursor Rules Files

| File | Role |
|------|------|
| `.cursor/rules/sectorcalc.mdc` | Always-on discipline |
| `.cursor/rules/protected-infrastructure.mdc` | Admin/Stripe/rules lock |
| `.cursor/rules/brand-assets-lock.mdc` | Brand lock |

Use top prompt from `docs/cursor-workflow.md` at the start of each large Cursor task.
