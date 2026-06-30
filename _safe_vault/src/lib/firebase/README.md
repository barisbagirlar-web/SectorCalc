# Firebase (SectorCalc)

Optional Firebase client for lead intent persistence. The app builds and runs without any Firebase env vars.

## Public environment variables

Set all of the following in `.env.local` (see `.env.example`):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

When every value is present, lead intents are written to Firestore after localStorage. If any value is missing, only localStorage is used.

## Firestore collection

**Collection:** `leadIntents`

**Document ID:** lead `id` (e.g. `lead_<uuid>`)

**Shape:** matches `LeadIntent` in `src/lib/leads/types.ts` including `status` and `storageMode`.

## Security rules (required for production)

Deploy from the repo root:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Files:

- `firestore.rules` — public **create-only** on `leadIntents` with field validation
- `firestore.indexes.json` — empty indexes (no composite queries required for MVP)

### Rules vs admin-light (read this)

Deployed MVP rules **deny all public reads** on `leadIntents`.

The admin-light page at `/admin/leads` currently uses the **browser Firebase SDK** to list leads. That path **will not return Firestore documents** once rules are deployed.

Until authentication exists:

- Do **not** enable public `read` on `leadIntents` to make admin work.
- Use localStorage on the same browser for MVP validation, or
- Add **authenticated admin reads** (custom claims + rules, or a secured server route).

```
// TODO in firestore.rules: allow read: if isAuthenticatedAdmin();
```

See `docs/security-notes.md` and `docs/deployment-checklist.md`.

## Admin-light route

**URL:** `/admin/leads` (not linked in the main nav)

- Disabled in **production** unless `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT=true`.
- **Not secured** — no auth in MVP.

**You must add authentication** before exposing this route on public production traffic.

## Modules

- `client.ts` — browser-safe `isFirebaseConfigured`, `getFirebaseApp`, `getFirestoreDb`
- `../leads/firestore.ts` — save and list lead intents
- `admin.ts` — (future) server-side Admin SDK for API routes only

Do not import Admin SDK in Client Components.

## Environment variables

See `docs/env-checklist.md`. Production should set:

- `NEXT_PUBLIC_SITE_URL=https://sectorcalc.com`
- All six `NEXT_PUBLIC_FIREBASE_*` vars (optional but required for Firestore writes)

## firebase.json

Minimal project config:

- `firestore.rules` and `firestore.indexes.json` referenced for `firebase deploy --only firestore:rules,firestore:indexes`
- `hosting.source: "."` — framework-aware stub; **do not** add unverified `public` / rewrite overrides

Deploy commands and Hosting product notes: `docs/deployment-checklist.md`.
