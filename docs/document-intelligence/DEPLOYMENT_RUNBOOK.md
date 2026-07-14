# Document Intelligence — Deployment Runbook

## Pre-Deployment Checklist

- [ ] All changes committed to the current branch
- [ ] `npm run build` passes locally
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `npm run lint` passes with 0 errors
- [ ] Document Intelligence tests pass: `npx vitest run tests/document-intelligence/`
- [ ] `npm run check:secrets` passes — no secrets in commit
- [ ] No TODO comments, stubs, or incomplete work remains
- [ ] `git status` shows clean working tree

## Deployment Steps

### Step 1: Verify Project

Confirm the Firebase project is correct before deploying.

```bash
firebase projects:list
```

Expected output:
```
┌──────────────────────┬─────────────────────┬──────────────────────┐
│ Project Display Name │ Project ID          │ Resource Location ID │
├──────────────────────┼─────────────────────┼──────────────────────┤
│ SectorCalc           │ sectorcalc-bf412    │ nam5 (approx.)       │
└──────────────────────┴─────────────────────┴──────────────────────┘
```

If the active project is not `sectorcalc-bf412`, explicitly set it:

```bash
firebase use sectorcalc-bf412
```

### Step 2: Set Environment Variables

Set the feature flag and all Document Intelligence environment variables. These must be configured in the hosting environment or as Cloud Functions environment configuration.

```bash
firebase functions:config:set \
  document_intelligence.enabled=true \
  maintenance_bom.price_usd=149 \
  maintenance_bom.max_file_bytes=52428800 \
  maintenance_bom.max_pages=50 \
  maintenance_bom.max_rows=500 \
  maintenance_bom.source_retention_hours=24 \
  maintenance_bom.output_retention_days=7 \
  maintenance_bom.engine_version=1.0.0 \
  maintenance_bom.validator_version=1.0.0 \
  maintenance_bom.schema_version=1.0.0 \
  document_processor.provider=mock \
  document_worker.secret=$(openssl rand -hex 32) \
  signed_url.ttl_seconds=300
```

For hosting (environment variables in `.env.production` or Firebase Hosting rewrite config):

```bash
# Required for Next.js server-side rendering
DOCUMENT_INTELLIGENCE_ENABLED=true
MAINTENANCE_BOM_PRICE_USD=149
MAINTENANCE_BOM_MAX_FILE_BYTES=52428800
MAINTENANCE_BOM_MAX_PAGES=50
MAINTENANCE_BOM_MAX_ROWS=500
MAINTENANCE_BOM_SOURCE_RETENTION_HOURS=24
MAINTENANCE_BOM_OUTPUT_RETENTION_DAYS=7
MAINTENANCE_BOM_ENGINE_VERSION=1.0.0
MAINTENANCE_BOM_VALIDATOR_VERSION=1.0.0
MAINTENANCE_BOM_SCHEMA_VERSION=1.0.0
DOCUMENT_PROCESSOR_PROVIDER=mock
DOCUMENT_PROCESSOR_ENDPOINT=
DOCUMENT_PROCESSOR_SECRET=
DOCUMENT_PROCESSOR_SERVICE_ACCOUNT=
SIGNED_URL_TTL_SECONDS=300
```

### Step 3: Build

```bash
npm run build
```

Verify build succeeds with exit code 0. Check the output for any Document Intelligence related errors. Common issues:

- Missing environment variables causing runtime resolution failures
- Import path errors for new modules
- Type errors in API routes

### Step 4: Deploy

```bash
DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs
```

This script performs the full production deployment. The `DEPLOY_FORCE_REBUILD=1` flag ensures a clean rebuild on the deployment server.

If deploying manually:

```bash
# Deploy hosting (includes Next.js server-side rendering)
firebase deploy --only hosting --project sectorcalc-bf412

# Deploy Firestore rules (if changed)
firebase deploy --only firestore:rules --project sectorcalc-bf412

# Deploy storage rules (if changed)
firebase deploy --only storage --project sectorcalc-bf412

# Deploy functions (if changed)
cd functions && npm run build && cd ..
firebase deploy --only functions --project sectorcalc-bf412
```

### Step 5: Verify Live SHA

Confirm the deployed version matches the current commit.

```bash
# Get the deployed SHA (hosting)
curl -s https://sectorcalc.com/__/version.json || echo "Version endpoint not available"

# Compare with local HEAD
git rev-parse HEAD
```

If the SHAs do not match, the deployment may have deployed a cached build. Run with `--force` or clear the Firebase Hosting cache.

### Step 6: Smoke Test

Run the following checks on the production URL:

```bash
# 1. Feature flag check
curl -s https://sectorcalc.com/api/document-intelligence/health

# Expected: { "ok": true, "data": { "enabled": true, "product": "maintenance_bom_recovery", ... } }

# 2. Landing page loads
curl -s -o /dev/null -w "%{http_code}" https://sectorcalc.com/document-intelligence
# Expected: 200

# 3. Product page loads
curl -s -o /dev/null -w "%{http_code}" https://sectorcalc.com/document-intelligence/maintenance-bom-recovery
# Expected: 200

# 4. Authenticated endpoint returns 401 without auth
curl -s -o /dev/null -w "%{http_code}" \
  https://sectorcalc.com/api/document-intelligence/maintenance-bom/diagnostic/upload
# Expected: 401
```

#### Browser Manual QA

| Test Case | Steps | Expected |
|-----------|-------|----------|
| Landing page | Navigate to `/document-intelligence` | Page loads, links to product page visible |
| Product landing | Navigate to `/document-intelligence/maintenance-bom-recovery` | Product page loads, CTA visible |
| Upload flow | Click "Start Free Diagnostic" | Redirected to login if not authenticated, or to upload page |
| Navigation | Check header link "Document Intelligence" | Visible and clickable |
| Navigation | Check mobile navigation | Section present under Document Intelligence |
| Footer link | Check footer | "Document Intelligence" link present and working |
| Sitemap | Verify `/document-intelligence` and `/document-intelligence/maintenance-bom-recovery` in generated sitemap | Both present |

### Step 7: Monitor

After deployment, monitor the following for 15 minutes:

- **Cloud Function logs**: No crash loops or unhandled errors
- **Firestore reads/writes**: Normal operation levels
- **Cloud Storage**: Uploads successfully landing in correct paths
- **Error rates**: No 500 errors on Document Intelligence API routes

### Rollback Decision

If any smoke test fails or error rate exceeds baseline, execute the rollback procedure immediately (see ROLLBACK_RUNBOOK.md). Do not leave a broken deployment live.

## Deployment Commands Summary

```bash
# Prerequisites
git status                              # Confirm clean working tree
firebase projects:list                  # Confirm correct project
firebase use sectorcalc-bf412           # Set project if needed

# Build
npm run build                           # Production build

# Deploy
DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs
# OR
firebase deploy --only hosting --project sectorcalc-bf412

# Verify
curl -s https://sectorcalc.com/api/document-intelligence/health
git rev-parse HEAD                      # Compare with deployed SHA
```

## Post-Deployment Checklist

- [ ] Health endpoint returns `enabled: true`
- [ ] Landing and product pages return 200
- [ ] Authenticated endpoints require auth
- [ ] Header, footer, and mobile nav all show Document Intelligence links
- [ ] Sitemap includes Document Intelligence routes
- [ ] Firestore rules deployed and verified
- [ ] No 500 errors in production logs
- [ ] Smoke tests pass on both desktop and mobile
- [ ] Rollback SHA recorded for quick revert
