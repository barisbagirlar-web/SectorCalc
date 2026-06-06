# SectorCalc Firebase Region Standard

**Last verified:** 2026-06-06  
**Project:** `sectorcalc-bf412`

---

## 1. Firestore Database Location

| Item | Value |
|------|--------|
| Database | `(default)` |
| Type | FIRESTORE_NATIVE |
| Edition | STANDARD |
| **Location** | **`nam5`** (North America multi-region) |

**Verify:**

```bash
firebase firestore:databases:get '(default)' --project sectorcalc-bf412
```

### What cannot be changed by code

- Firestore database region (`nam5`) — fixed at provisioning.
- Moving Firestore requires a new database/project and data migration.
- **Do not attempt region migration via Cursor or deploy scripts.**

---

## 2. Existing Functions and Regions

Verified via `firebase functions:list --project sectorcalc-bf412`:

| Function | Region | Runtime | Category |
|----------|--------|---------|----------|
| `updateLeadPipeline` | us-central1 | nodejs20 | Admin (frozen) |
| `updateLeadTestClassification` | us-central1 | nodejs20 | Admin (frozen) |
| `createStripeCheckout` | us-central1 | nodejs20 | Revenue Flow |
| `stripeWebhook` | us-central1 | nodejs20 | Revenue Flow |
| `ssrsectorcalcbf412` | us-central1 | nodejs22 | Firebase Hosting SSR (managed) |

All HTTPS functions are deployed in **us-central1**, which is the correct pairing for Firestore **nam5**.

---

## 3. Code-Level Region Constants

**File:** `functions/src/constants.ts`

| Constant | Value | Use |
|----------|-------|-----|
| `FIRESTORE_DATABASE_LOCATION` | `"nam5"` | Documentation / guards; not a deploy target |
| `DEFAULT_FUNCTION_REGION` | `"us-central1"` | **All new Revenue Flow functions** (Stripe, webhooks, billing, reports) |
| `ADMIN_FUNCTION_REGION` | `"us-central1"` | Existing admin lead functions — **frozen** |

### Why not `europe-west3`?

Firestore is **`nam5`**, not `europe-west3`. The project already runs entirely in **us-central1**. Changing to `europe-west3` would require redeploying functions to a new region (new URLs, webhook endpoint updates, admin URL updates) without moving Firestore.

**Decision:** Lock **`us-central1`** as the standard — matches live infrastructure, zero region migration.

---

## 4. New Revenue Functions — Required Pattern

Use Firebase Functions v2 `onRequest` with `DEFAULT_FUNCTION_REGION`:

```typescript
import { onRequest } from "firebase-functions/v2/https";
import { DEFAULT_FUNCTION_REGION } from "./constants";

export const myNewRevenueFunction = onRequest(
  {
    region: DEFAULT_FUNCTION_REGION,
    invoker: "public",
  },
  handler,
);
```

**Do not** hardcode `"us-central1"` or `"europe-west3"` in new revenue function exports — import the constant.

### Admin functions

Keep `ADMIN_FUNCTION_REGION`. Do not change admin function regions without:

1. Explicit user approval
2. Migration plan (new URLs, env updates, smoke tests on `/admin/leads`)
3. **Never** run `firebase functions:delete` on admin functions without approval

---

## 5. What Can Be Changed by Code

| Item | Allowed |
|------|---------|
| `DEFAULT_FUNCTION_REGION` constant for **future** functions | Yes (with migration plan if value changes) |
| Revenue function exports using `DEFAULT_FUNCTION_REGION` | Yes |
| `firestore.rules` | Yes — separate deploy |
| `.firebaserc` project target | Yes — must stay `sectorcalc-bf412` |
| Function handler logic | Yes — minimal patches |

---

## 6. Firebase Config Checklist

| File | Status |
|------|--------|
| `.firebaserc` | `default` → `sectorcalc-bf412` ✓ |
| `firebase.json` | `functions.source` → `functions` ✓ |
| `functions/package.json` | Node 20 engine ✓ |
| `functions/tsconfig.json` | Output → `lib/` ✓ |
| `functions/src/index.ts` | Region constants wired ✓ |

---

## 7. Deployment Commands

```bash
cd functions && npm run build
firebase deploy --only functions --project sectorcalc-bf412
```

**Do not deploy** if only docs changed and functions code is unchanged.

**Do not run:**

```bash
firebase functions:delete ...
```

without explicit user approval.

---

## 8. Do-Not-Delete / Do-Not-Migrate Warning

- Do **not** delete or recreate admin functions to change region.
- Do **not** move Firestore to another region.
- Do **not** create a new Firebase project for region fixes.
- Stripe webhook URL and admin function URLs are tied to **us-central1** endpoints — region change breaks production until all URLs and secrets are updated.

---

## 9. Related Docs

- `docs/sectorcalc-stability-settings.md` — secrets, deploy discipline
- `docs/admin-panel-stable-checkpoint.md` — admin stable state
