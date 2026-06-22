# Safe production deploy (sectorcalc.com)

## Canonical reality

| Item | Value |
|------|--------|
| Live domain | https://www.sectorcalc.com |
| Primary host | **Firebase** (`server: Firebase`) |
| Firebase | Admin, Functions, Firestore, fallback `sectorcalc-bf412.web.app` — **not** primary web deploy for copy/i18n changes |
| Default branch | `main` |

## Golden rule

`vercel --prod` uploads the **local working directory**, not “last commit” alone.

Deploying with uncommitted files (local `next.config`, half-finished scripts, deleted pages) can ship broken builds and cause site-wide **404**. Always deploy from a **clean** tree aligned with `origin/main`.

## Recommended paths (best → acceptable)

### 1. Git push (preferred)

1. Commit on `main`.
2. `git push origin main`
3. Let Firebase Git integration build and promote production.
4. Smoke: `npm run smoke:locale-routes` or curl checks below.

No local 35-minute build; no dirty-tree risk.

### 2. Safe CLI deploy (clean local main)

```bash
git checkout main
git pull origin main
git status --short   # must be empty

npm run check:secrets
npm run deploy:vercel:safe
```

Script: `scripts/deploy-vercel-production.mjs`

### 3. Clean worktree (when you have local WIP)

Keep working changes; deploy only what is on remote:

```bash
git fetch origin main
DEPLOY_FROM_ORIGIN=1 npm run deploy:vercel:safe
```

Creates a temp worktree at `origin/main`, deploys from there, removes worktree.

## Do not use for routine i18n/UI

- `npm run deploy:vercel` on a **dirty** tree
- `npm run deploy:hosting` / Firebase for homepage copy (legacy path; local build often OOMs)
- Parallel deploys (wait for one production build to finish in Firebase dashboard)

## Pre-deploy checklist

- [ ] Changes committed (or use `DEPLOY_FROM_ORIGIN=1`)
- [ ] `npm run check:secrets` passes
- [ ] No other Firebase production build in progress
- [ ] For large code changes: `npm run lint` and `npx tsc --noEmit` locally

## Post-deploy smoke (minimum)

```bash
curl -sI https://www.sectorcalc.com/ | head -1      # expect 200 or 308
curl -sI https://www.sectorcalc.com/tr | head -1   # expect 200
curl -sI https://www.sectorcalc.com/en/tools | head -1
```

Or: `SECTORCALC_AUDIT_BASE_URL=https://www.sectorcalc.com npm run smoke:locale-routes`

## Rollback (production incident)

```bash
vercel ls sectorcalc --prod
vercel rollback <previous-ready-deployment-url> \
  --scope team_UG3Vpq2hOnaYU807DGwBjM8N \
  --yes
```

Then re-smoke URLs above.

## i18n-only changes (e.g. hero copy)

1. Edit `messages/{tr,en,de,fr,es,ar}.json`
2. Commit + push `main`
3. Wait for Firebase production build (~25–40 min for full site)
4. Verify locale homepage strings

No `HeroSection.tsx` change needed when keys already exist (`heroTitle`, `heroSub1`, `heroSub2`).
