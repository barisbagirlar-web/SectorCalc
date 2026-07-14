# Document Intelligence — Data Flow

## Processing Pipeline

### 1. Diagnostic Flow (Free — No Payment Required)

```
User Uploads PDF
  → Client validates size/type (advisory only)
  → POST /diagnostic/upload → returns jobId + upload URL
  → Source stored to: document-intelligence/{uid}/{jobId}/source/{sanitized_filename}
  → POST /diagnostic/start → validates file, runs limited extraction (3 pages / 10 rows)
  → Job status: diagnostic_uploaded → diagnostic_scanning
  → Diagnostic engine checks:
      - PDF readable
      - Not password protected
      - Page count ≤ 50
      - Native text available
      - BOM/parts table detected
      - Estimated rows ≤ 500
      - English language
  → Diagnostic result: eligible / manual_review_required / rejected / failed
  → User sees preview rows + eligibility result
  → NEVER charges credit
```

### 2. Payment Flow (USD 149 — Credit System)

```
User sees "eligible" diagnostic result
  → User clicks "Process Full Manual — USD 149"
  → POST /checkout → server checks credit balance
  → Server validates diagnostic_eligible status
  → Server returns checkout data (product code, price, credit cost)
  → Client confirms checkout
  → Server reserves credits atomically via Firestore transaction
  → Job transitions to: awaiting_payment → paid
  → User redirected to job detail page
```

### 3. Processing Flow (Async — Paid Only)

```
User clicks "Start Processing" on job detail page
  → POST /execute
  → Server validates paid status
  → Server transitions job to: queued
  → (Future: Cloud Tasks invokes worker)
  → Worker:
    1. extracting → extracts full PDF
    2. normalizing → normalizes part numbers
    3. validating → detects duplicates, missing fields, revision conflicts
    4. generating_outputs → creates workbook, exception report, CSV, summary
    5. completed → transitions to completed status, records manifest
  → On failure: failed_retryable (retry) or failed_terminal (terminal)
  → On terminal failure: releases entitlement (replacement token)
```

### 4. Download Flow

```
User on job detail page
  → GET /downloads → server verifies ownership + completed status + not expired
  → Server generates short-lived signed URLs (5 min TTL)
  → User downloads files directly from GCS
```

### 5. Deletion Flow

```
Source deletion:
  → Scheduled task (24h after successful output)
  → Deletes from: document-intelligence/{uid}/{jobId}/source/
  → Records sourceDeletedAt on job document
  → Emits deletion audit event

Output retention:
  → 7 days by default
  → After expiry, job shows "expired" status
  → Download API returns 410 Gone
```

## Ownership Boundaries

| Responsibility | Owner |
|---|---|
| Product price & allowance | Server-side product registry (entitlement module) |
| Payment truth | Verified Firestore transaction |
| Entitlement | Atomic server-side transaction |
| Job lifecycle | Server-side state machine |
| Source file ownership | Auth UID + server-created job binding |
| Extraction result | Worker artifact |
| Normalization | Deterministic domain module |
| Validation | Deterministic validator module |
| Export disposition | Validator result (not browser) |
| Generated outputs | Immutable output paths |
| Download authorization | Auth check + signed URL |
| Retention/deletion | Server scheduler |
| Product availability | Server feature flag |
