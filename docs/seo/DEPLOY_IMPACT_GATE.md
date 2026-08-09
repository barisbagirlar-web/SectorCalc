# Production Deploy Impact Gate

## Contract

Production deployment is allowed only when a merged change can affect runtime, generated public output, Firebase Hosting configuration, Cloud Functions, Firestore deployment inputs, dependencies, or an otherwise unknown repository path.

Changes proven to be non-runtime may complete CI without Firebase preview creation or live promotion. The allowlist is intentionally narrow and fail-closed.

## Proven non-runtime classes

- `.github/**`
- `docs/**`
- `tests/**`
- repository governance files such as `README.md`
- verification-only scripts named `scripts/verify-*`, `scripts/guard-*`, `scripts/check-*`
- the deploy impact classifier itself

Everything else defaults to `DEPLOY_REQUIRED=true`.

## Mandatory examples

- `public/robots.txt` → deploy required
- `public/sitemap.xml` → deploy required
- `seo/**` → deploy required
- `src/**` → deploy required
- `functions/**` → deploy required
- `firebase.json` → deploy required
- `package.json` → deploy required
- unknown/new path → deploy required
- docs/tests/workflows/verification guards only → deploy skipped

Manual workflow dispatch always requires deploy.

## Failure policy

Empty or malformed diff input is fail-closed and requires deploy. A mixed change set containing even one runtime or unknown path requires deploy.
