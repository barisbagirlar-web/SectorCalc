# SectorCalc security notes (MVP)

This document describes the **current** security posture of the public MVP. It is not a compliance attestation.

## Current MVP posture

### What is relatively safe for a marketing + calculator MVP

- **No payment processing** — no card data in scope.
- **No user accounts** — no password or session management in the client yet.
- **Static/SSG-heavy site** — limited server attack surface on default Next deployment.
- **Firestore rules (when deployed)** — public **create-only** on `leadIntents` with field size/type checks; **no public read/update/delete**.
- **Admin-light off by default in production** — `/admin/leads` does not fetch data unless `NEXT_PUBLIC_ENABLE_ADMIN_LIGHT=true`.
- **Admin route not in public nav** — reduces casual discovery (not a security control).
- **No secrets in repo** — only `NEXT_PUBLIC_*` Firebase client keys (expected to be public).
- **Lead form client rate limit** — reduces casual spam (5 submissions / 10 minutes per browser).

### What is not production-grade yet

| Area | Risk | MVP state |
|------|------|-----------|
| Admin viewer | Anyone with URL can view local leads if flag enabled | No auth |
| Firestore list from browser | Rules block read; admin sees localStorage only | By design until auth |
| Lead spam / abuse | Client rate limit only | Bypassable |
| Lead PII | Stored in localStorage + optional Firestore | No encryption at rest policy in app |
| Legal / privacy ops | Placeholder emails | No automated deletion workflow |
| Export / premium unlock | UI preview only | No entitlement system |
| Analytics | No-op dev sink | No monitoring |
| App Check | Not enabled | Firebase clients unverified |
| Email sending | Not implemented | No transactional mail |

## Firestore rules vs admin-light

Deploy `firestore.rules` before enabling Firebase in production:

- **Clients may create** validated `leadIntents` documents.
- **Clients may not read** the collection.

The admin-light page uses the Firebase client SDK to list leads. With deployed rules, **Firestore reads fail** and the UI falls back to **this browser’s localStorage only**. That is expected until you add authenticated admin reads (server route or signed-in admin).

Do **not** add `allow read: if true` to ship admin faster.

## Required before paid traffic or sensitive data

1. **Authentication-protected admin** — Firebase Auth, SSO, or host-level protection for `/admin/*`.
2. **Server-side rate limiting** — API route or Cloud Function on lead create (replace client-only guard).
3. **Firebase App Check** — reduce abuse of public Firestore create.
4. **Email verification / double opt-in** — if marketing mail starts.
5. **Abuse monitoring** — alerts on lead volume, WAF, optional CAPTCHA.
6. **Payment security** — PCI via Stripe/etc.; webhook signature verification; no card data in SectorCalc DB.
7. **Export access control** — entitlements tied to purchase; server-generated PDFs.
8. **Privacy operations** — deletion workflow for `privacy@sectorcalc.com` requests.
9. **Tight Firestore rules for admin read** — custom claims, e.g. `admin == true`.
10. **Security review** — penetration test or checklist before high-traffic launch.

## Client-side lead rate limit

See `src/lib/leads/rate-limit.ts`.

```
TODO: Replace with server-side rate limiting before production paid traffic.
```

This does not stop scripted attacks or multi-browser abuse.

## Deployment references

- [deployment-checklist.md](./deployment-checklist.md) — Firebase login, rules deploy, hosting deploy
- [env-checklist.md](./env-checklist.md) — `NEXT_PUBLIC_SITE_URL`, Firebase, admin flag
- [first-live-test-script.md](./first-live-test-script.md) — post-go-live verification

## Reporting issues

For MVP validation, contact `hello@sectorcalc.com`. Replace with a security contact before scale.
