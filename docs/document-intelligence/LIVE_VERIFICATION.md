# Live Verification — Maintenance BOM Recovery

## Status: NOT_RUN

Live production verification requires deployment credentials and a deployed
environment. The following procedure must be executed after the first
production deployment.

---

## Pre-Verification Checklist

- [ ] Feature flag `DOCUMENT_INTELLIGENCE_ENABLED` is `true` in production
- [ ] Deployment SHA recorded from `npm run build` output
- [ ] Firestore indexes deployed
- [ ] Storage bucket lifecycle rules applied
- [ ] Cloud Tasks queue provisioned
- [ ] Paddle webhook endpoint registered
- [ ] Worker service deployed and authenticated

---

## Verification Steps

### 1. DNS and TLS

```bash
curl -sI https://sectorcalc.com/document-intelligence/maintenance-bom-recovery \
  | head -5
# Expected: HTTP/2 200
```

### 2. Landing Route

```bash
curl -s https://sectorcalc.com/document-intelligence/maintenance-bom-recovery \
  | grep -c "Recover Spare-Parts Data"
# Expected: 1
```

### 3. Category Route

```bash
curl -s https://sectorcalc.com/document-intelligence \
  | grep -c "Document Intelligence"
# Expected: 1
```

### 4. Header and Mobile Nav

Open https://sectorcalc.com on desktop and mobile widths.
- Verify "Document Intelligence" appears in desktop header
- Verify it appears in mobile hamburger menu
- Verify "Maintenance BOM Recovery" appears as child link
- Verify keyboard navigation works
- Verify active state on current page

### 5. Metadata and SEO

```bash
curl -s https://sectorcalc.com/document-intelligence/maintenance-bom-recovery \
  | grep -c '<title>'
# Expected: 1
```

Verify:
- Unique `<title>` tag
- Unique `<meta name="description">`
- `<link rel="canonical">` points to correct URL
- Open Graph tags present
- BreadcrumbList JSON-LD present
- FAQPage schema present (if FAQ renders on page)

### 6. Feature Flag Behavior

When `DOCUMENT_INTELLIGENCE_ENABLED=false`:
- Upload/checkout/execute APIs return HTTP 503
- Existing SectorCalc systems unaffected

When enabled: all APIs functional.

### 7. Diagnostic E2E

Using synthetic fixture `eligible_simple_bom.pdf`:

1. Navigate to landing page
2. Click "Check My Manual Free"
3. Upload fixture file
4. Observe diagnostic progress
5. Verify eligibility result shows:
   - Preview rows (max 10)
   - Detected columns
   - Detected risks
   - USD 149 offer
   - "Process Full Manual — USD 149" CTA
6. Verify rejected files cannot proceed to checkout

### 8. Payment E2E (Sandbox)

1. Upload eligible fixture
2. Click "Process Full Manual — USD 149"
3. Complete sandbox Paddle checkout
4. Verify payment status transitions: checkout_pending → paid
5. Verify entitlement recorded exactly once

### 9. Processing E2E

1. After payment, job enters queued state
2. Worker picks up and processes through stages:
   - extracting → normalizing → validating → generating_outputs → completed
3. Verify job status can be polled via API
4. Verify output manifest is generated

### 10. Download E2E

1. After completion, click "Download" (or use API)
2. Verify ZIP file downloads
3. Verify ZIP contains all 8 required files:
   - SectorCalc_Maintenance_BOM_{jobId}.xlsx
   - SectorCalc_Exception_Report_{jobId}.xlsx
   - SectorCalc_Source_Map_{jobId}.csv
   - SectorCalc_Processing_Summary_{jobId}.html
   - SectorCalc_Data_Dictionary_{jobId}.html
   - SectorCalc_Import_Checklist_{jobId}.html
   - SectorCalc_Manifest_{jobId}.json
   - README_FIRST_{jobId}.txt
4. Verify XLSX files open without repair warnings
5. Verify CSV has correct headers
6. Verify manifest SHA-256 matches

### 11. Tenant Isolation

1. User A uploads and processes a job
2. User B attempts to access User A's job via API
3. Verify HTTP 404 or 403 (not job data)
4. User B attempts to download User A's files
5. Verify access denied

### 12. Cross-Tenant Storage

1. Verify User B cannot access User A's storage path
2. Verify unauthenticated requests denied
3. Verify signed URLs expire after configured TTL

### 13. Rejected File Cannot Pay

1. Upload non-BOM document → diagnostic_rejected
2. Verify checkout route returns error
3. Verify no credit consumed

### 14. Mobile Responsiveness

Verify on mobile widths:
- Navigation works
- Landing page renders without horizontal overflow
- Upload works
- Progress visible
- Download works
- No console errors

### 15. Existing System Regression

Verify the following routes still work:
- / → 200
- /pricing → 200
- /free-tools → 200
- /pro-tools → 200
- /engineering-diagnostics → 200
- /en → 200 or redirect
- /en/pricing → 200

### 16. Deployment SHA

```bash
curl -s https://sectorcalc.com/api/health \
  | grep -c '"sha":"<expected-sha>"'
# OR verify via Firebase Hosting metadata
```

---

## Post-Verification Report

| Check | Status | Evidence |
|---|---|---|
| DNS/TLS | | |
| Landing route | | |
| Category route | | |
| Header/mobile nav | | |
| SEO metadata | | |
| Feature flag behavior | | |
| Diagnostic E2E | | |
| Payment E2E | | |
| Processing E2E | | |
| Download E2E | | |
| Tenant isolation | | |
| Cross-tenant storage | | |
| Rejected no-charge | | |
| Mobile responsive | | |
| System regression | | |
| SHA match | | |

---

## Rollback Procedure

If any critical check fails:

1. Set `DOCUMENT_INTELLIGENCE_ENABLED=false` in environment
2. Redeploy or flip feature flag
3. Verify new uploads/checkouts blocked
4. Existing paid jobs continue processing
5. Verify regression tests pass
6. Investigate and fix failure cause
