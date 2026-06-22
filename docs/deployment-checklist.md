# SectorCalc deployment checklist

Use this before pointing **sectorcalc.com** (or staging) at a production build.

Related docs:

- [env-checklist.md](./env-checklist.md) — environment variables
- [public-qa-checklist.md](./public-qa-checklist.md) — route-by-route QA
- [first-live-test-script.md](./first-live-test-script.md) — post-deploy walkthrough
- [security-notes.md](./security-notes.md) — MVP security posture

---

## 1. Environment variables

Copy `.env.example` to `.env.local` (local) or configure in Firebase Hosting / CI.

| Variable | Production guidance |
|----------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | `https://sectorcalc.com` (no trailing slash) |
| `NEXT_PUBLIC_FIREBASE_*` (6) | Optional; all required for Firestore writes |
| `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT` | **Unset** on public production |

Never commit service account JSON or private API keys.

Details: [env-checklist.md](./env-checklist.md).

---

## 2. Firebase project setup

1. Create a Firebase project (or use existing).
2. Enable **Firestore** (production mode).
3. Register a **web app**; copy public config into env vars.
4. Do **not** put Admin SDK credentials in the Next.js client.

---

## 3. Verify Firebase config files (repo)

| File | Purpose |
|------|---------|
| `firebase.json` | References `firestore.rules`, `firestore.indexes.json`; minimal `hosting.source: "."` |
| `firestore.rules` | Deny-by-default; create-only `leadIntents` with field validation |
| `firestore.indexes.json` | Empty indexes (MVP) |
| `src/lib/firebase/client.ts` | Optional client init; no throw when env missing |

**Hosting note:** `firebase.json` does not pin a `public` static folder or SPA rewrite that would conflict with Next.js. For **Firebase App Hosting** or **framework-aware Hosting**, follow Firebase’s Next.js guide and set env vars in the console before deploy — do not add destructive `rewrites` or `out` folder settings here without verifying your hosting product.

---

## 4. Local checks (required before deploy)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Optional local smoke:

```bash
npm run start
```

---

## 5. Firebase CLI — login and project

```bash
firebase login
firebase use <your-firebase-project-id>
```

Confirm active project:

```bash
firebase projects:list
```

---

## 6. Deploy Firestore rules and indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Confirm in `firestore.rules`:

- Public **read / update / delete** denied on `leadIntents`
- Public **create** allowed with validated fields only
- Admin read is **TODO** until auth exists

**Important:** `/admin/leads` cannot list Firestore leads with these rules. That is intentional.

---

## 7. Deploy hosting

```bash
firebase deploy --only hosting
```

**Before running hosting deploy:**

- Confirm whether you use **Firebase App Hosting**, **framework-aware Hosting (Next.js)**, or another host (e.g. Firebase).
- Set `NEXT_PUBLIC_SITE_URL` and optional Firebase vars in the hosting environment.
- Rebuild after changing any `NEXT_PUBLIC_*` variable.

If hosting deploy fails, check Firebase console → Hosting / App Hosting docs for your project type rather than adding unverified `firebase.json` overrides.

---

## 8. Domain setup (sectorcalc.com)

1. Add custom domain in Firebase Hosting (or DNS provider per your host).
2. Set `NEXT_PUBLIC_SITE_URL=https://sectorcalc.com` for production builds.
3. Enable HTTPS; wait for certificate provisioning.
4. Verify `src/config/site.ts` resolves `siteUrl` from env at build time.

---

## 9. Admin-light in production

- Default: `/admin/leads` is **disabled** (no data fetch).
- Do **not** set `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT=true` on public production without authentication.
- Firestore rules do not grant public read even if the flag is set.

---

## 10. Post-deploy QA (quick)

| Check | Command / URL |
|-------|----------------|
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |
| Lead form | Premium tool → export CTA → submit test lead |
| Firestore | Console → `leadIntents` (if Firebase configured) |
| Admin locked | `/admin/leads` shows disabled state |

Full matrix: [public-qa-checklist.md](./public-qa-checklist.md)  
Live script: [first-live-test-script.md](./first-live-test-script.md)

---

## 11. Lead form test

1. Open a premium tool or pricing CTA.
2. Submit valid test data in the lead modal.
3. Confirm “Request received.”
4. Check `sectorcalc:lead-intents` in browser localStorage.
5. If Firebase configured: new doc in `leadIntents` (create only).
6. Submit 6+ times in 10 minutes → rate limit message.

---

## 12. SEO

- `/sitemap.xml` — public routes only (no `/admin`)
- `/robots.txt` — `Disallow: /admin/`, sitemap URL uses `NEXT_PUBLIC_SITE_URL`

---

## 13. Legal & footer

- `/privacy`, `/terms`, `/disclaimer` load
- Footer: `hello@sectorcalc.com`, `privacy@sectorcalc.com`

---

## 14. Lighthouse & mobile (recommended)

- Lighthouse mobile on `/` and one tool page
- 375px width: nav, lead modal, calculator layout

---

## Production limitations (reminder)

No payment, auth, real export, or email. Client-side rate limit only. Admin and Firestore read paths are not production-grade until auth and server-side controls are added.

See [security-notes.md](./security-notes.md).
