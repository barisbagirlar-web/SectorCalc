# Environment variables checklist

Use this when setting up local `.env.local`, Firebase Hosting env, or CI secrets.

## Required for production domain (recommended)

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://sectorcalc.com` | Canonical URL for sitemap, robots, metadata, Open Graph |

No trailing slash. If unset, the app defaults to `https://sectorcalc.com` (`src/config/site.ts`).

## Firebase client (optional)

`src/lib/firebase/client.ts` resolves public web config from `NEXT_PUBLIC_*` env vars, with **safe fallbacks** for `sectorcalc-bf412` when Hosting deploy omits env (values are public client config, not secrets).

Override fallbacks by setting all six in `.env.local` before `npm run build`, or in Firebase Hosting environment settings.

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `sectorcalc-bf412.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | e.g. `sectorcalc-bf412.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | From Firebase console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web app ID |

Never commit service account JSON or private keys.

## Admin-light (production)

| Variable | Production rule |
|----------|-----------------|
| `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT` | **Do not set** `true` on public production |

- Unset = `/admin/leads` disabled in production builds (no data fetch).
- `true` = only for controlled validation; still requires auth before real launch.
- Development (`npm run dev`) allows admin-light without the flag.

## Not used in MVP (do not add secrets for these yet)

- Stripe / payment keys
- SendGrid / Resend API keys
- Firebase Admin SDK private key in the Next.js bundle
- Session secrets for auth (auth not implemented)

## Pre-deploy verification

```bash
# Local — copy and fill
cp .env.example .env.local

# Confirm site URL (optional override)
grep NEXT_PUBLIC_SITE_URL .env.local

# Confirm admin flag is NOT true for production
grep ENABLE_ADMIN_LIGHT .env.local || true
```

## Hosting-specific notes

- **Firebase App Hosting / framework Hosting:** set env vars in the Firebase console for the backend or hosting target before deploy.
- **Vercel / other:** same `NEXT_PUBLIC_*` names in the project environment UI.
- Rebuild after changing any `NEXT_PUBLIC_*` variable (values are inlined at build time).

See also: [deployment-checklist.md](./deployment-checklist.md), [security-notes.md](./security-notes.md).
