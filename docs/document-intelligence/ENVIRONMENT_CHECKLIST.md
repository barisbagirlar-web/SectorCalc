# Document Intelligence — Environment Checklist

## Feature Flag

```bash
# .env.local or hosting env
DOCUMENT_INTELLIGENCE_ENABLED=true
```

## Required Environment Variables

```bash
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

# Document processor (external provider)
DOCUMENT_PROCESSOR_PROVIDER=mock
DOCUMENT_PROCESSOR_ENDPOINT=
DOCUMENT_PROCESSOR_SECRET=
DOCUMENT_PROCESSOR_SERVICE_ACCOUNT=

# Cloud Tasks (future)
CLOUD_TASKS_QUEUE=
CLOUD_TASKS_LOCATION=
DOCUMENT_WORKER_URL=

# Signed URL security
SIGNED_URL_TTL_SECONDS=300
```

## Firebase Project

```bash
# Verify project
firebase projects:list
# Must match expected project
export EXPECTED_PROJECT=sectorcalc-bf412
export ACTUAL_PROJECT=$(firebase projects:list --json | jq -r '.results[0].projectId')
if [ "$EXPECTED_PROJECT" != "$ACTUAL_PROJECT" ]; then
  echo "PROJECT MISMATCH: expected $EXPECTED_PROJECT, got $ACTUAL_PROJECT"
  exit 1
fi
```

## Cloud Storage Bucket

Must be the default Firebase Storage bucket for the project.
Bucket lifecycle policies should auto-delete objects older than 7 days in the `document-intelligence/` path.

## Firestore Indexes

Requires composite index for `creditTransactions` collection:
- `userId` ASC, `type` ASC, `checkoutRequestId` ASC

## Security Rules

- `firestore.rules` — Updated with `documentIntelligenceJobs` rules
- `storage.rules` — Updated with `document-intelligence/` path isolation

## Paddle (Future)

```bash
export PADDLE_MAINTENANCE_BOM_PRICE_ID=
export PADDLE_WEBHOOK_SECRET=
```

## Deployment

```bash
# Commit first, then build+deploy
git add -A
git commit -m "feat: add Maintenance BOM Recovery product"
npm run build
DEPLOY_FORCE_REBUILD=1 node scripts/deploy-production.mjs
```

## Rollback

```bash
export DOCUMENT_INTELLIGENCE_ENABLED=false
# Hide nav link, block new uploads, existing jobs continue
```
