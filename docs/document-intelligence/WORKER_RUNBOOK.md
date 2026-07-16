# Document Intelligence — Worker Runbook

## Architecture

The Document Intelligence worker processes PDF extraction, normalization, validation, and output generation asynchronously. The worker is invoked via a Cloud Tasks queue, runs in Cloud Run with service-to-service authentication, and reports progress through Firestore job state transitions.

### Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Cloud Tasks queue | NOT_PROVISIONED | Requires `gcloud tasks queues create` |
| Cloud Run worker | NOT_DEPLOYED | Container must be built and deployed separately, or use the internal process API route |
| Internal process API | LIVE | `POST /api/document-intelligence/maintenance-bom/internal/process` — invoked by Cloud Tasks (or manually for testing) |
| Mock extraction provider | LIVE | Deterministic synthetic data for testing and staging |

## Queue Configuration

### Cloud Tasks Queue (to be provisioned)

```bash
gcloud tasks queues create document-intelligence-worker \
  --location=us-central1 \
  --max-dispatches-per-second=10 \
  --max-concurrent-dispatches=5 \
  --max-attempts=3 \
  --min-backoff=10s \
  --max-backoff=300s \
  --max-doublings=5
```

### Queue Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Location | `us-central1` | Match existing Firebase project region |
| Max dispatches/sec | 10 | Conservative to avoid Firestore write contention |
| Max concurrent | 5 | Bound worker instances |
| Max attempts | 3 | Upper bound on retry for transient failures |
| Min backoff | 10s | Allow immediate retry of fast-failing operations |
| Max backoff | 300s (5 min) | Prevent tight retry loops |
| Max doublings | 5 | Exponential backoff capped at 5 doublings |

## Staged Processing Pipeline

The worker processes each job through five sequential stages. Each stage is idempotent and checkpointed on the job document in Firestore.

```
queued → extracting → normalizing → validating → generating_outputs → completed
```

### Stage 1: Extracting

| Attribute | Value |
|-----------|-------|
| Entry status | `queued` |
| Success target | `normalizing` |
| Failure (retryable) | `failed_retryable` |
| Failure (terminal) | `failed_terminal` |

**Operations:**
1. Retrieve source PDF from Cloud Storage: `document-intelligence/{uid}/{jobId}/source/{filename}`
2. Verify file exists and is readable
3. Call extraction provider (real or mock) with full PDF buffer
4. Map provider output to canonical `BomRow[]` via `mapExtractionToCanonicalRows()`
5. Record metrics (page count, row count, duration) in job document
6. Transition to `normalizing`

**Integrity check:** Count extracted rows against diagnostic estimate. If mismatch exceeds warning threshold, add warning but proceed.

### Stage 2: Normalizing

| Attribute | Value |
|-----------|-------|
| Entry status | `extracting` |
| Success target | `validating` |
| Failure (retryable) | `failed_retryable` |
| Failure (terminal) | `failed_terminal` |

**Operations:**
1. For each row, run `normalizePartNumber()` on raw part number
2. Store both `partNumberRaw` and `partNumberNormalized`
3. For each row, normalize description text (trim, NFC Unicode)
4. Record normalization warnings per row

**Integrity check:** Every normalized part number retains its raw value. The comparison key is uppercase but the display value preserves original casing.

### Stage 3: Validating

| Attribute | Value |
|-----------|-------|
| Entry status | `normalizing` |
| Success target | `generating_outputs` |
| Failure (retryable) | `failed_retryable` |
| Failure (terminal) | `failed_terminal` |

**Operations:**
1. Run `detectDuplicates()` — 7 classes of duplicate detection
2. Run `detectMissingFields()` — required and conditional field detection
3. Run `detectRevisionConflicts()` — 5 classes of revision conflict
4. Run `determineExportDisposition()` — classify each row as clean/review_required/excluded
5. Build `ProcessingSummary` from validation results

### Stage 4: Generating Outputs

| Attribute | Value |
|-----------|-------|
| Entry status | `validating` |
| Success target | `completed` |
| Failure (retryable) | `failed_retryable` |
| Failure (terminal) | `failed_terminal` |

**Operations:**
1. Generate ERP-ready workbook (8 sheets) via `generateMaintenanceBomWorkbook()`
2. Generate Procurement Exception Report (7 sheets) via `generateExceptionReport()`
3. Generate Source Map CSV via `generateSourceMapCsv()`
4. Generate Processing Summary HTML via `generateSummaryHtml()`
5. Compute SHA-256 hash for each output file
6. Build `OutputManifest` via `generateManifest()`
7. Upload all files to Cloud Storage: `document-intelligence/{uid}/{jobId}/output/`
8. Validate manifest against uploaded files via `validateManifest()`
9. Schedule source deletion (24h retention)
10. Transition to `completed`

### Stage 5: Completed

Final state. No further processing. Outputs available for download for 7 days.

## Retry Behavior

### Exponential Backoff

```
Attempt 1: 10s  (immediate retry)
Attempt 2: 20s
Attempt 3: 40s
Attempt 4: 80s
Attempt 5: 160s (max backoff)
```

### Retryable vs Terminal Errors

| Error Code | Retryable | Max Retries | Description |
|------------|-----------|-------------|-------------|
| `STORAGE_FAILURE` | Yes | 3 | GCS read/write failure |
| `PROVIDER_TRANSIENT` | Yes | 3 | Provider returned transient error |
| `PROVIDER_INVALID_OUTPUT` | No | 0 | Provider returned garbage |
| `NORMALIZATION_FAILURE` | Yes | 2 | Normalization pipeline error |
| `VALIDATION_FAILURE` | Yes | 2 | Validation pipeline error |
| `OUTPUT_GENERATION_FAILURE` | Yes | 3 | Workbook/CSV/HTML generation error |
| `OUTPUT_INTEGRITY_FAILURE` | Yes | 2 | SHA-256 manifest mismatch |
| `TASK_AUTH_FAILURE` | No | 0 | Invalid service auth |
| `RETENTION_DELETE_FAILURE` | Yes | 3 | Source deletion failed |
| `INTERNAL_CONTRACT_VIOLATION` | No | 0 | Illegal state transition |

### Checkpoint by Stage

Each stage transition records the current status in Firestore. If the worker crashes mid-stage, the retry reads the current status from Firestore and resumes from that stage. The worker does not restart from `queued` — it picks up at the last known stage.

**Example:** Worker crashes during validation after normalization completed. On retry:
1. Worker reads job: `status = "normalizing"`
2. Worker checks `processingExecutionId` matches
3. Worker resumes from `validating` stage (normalization results are stored in subcollection or recomputed)

## Idempotent Processing

### processingExecutionId

Every execute request generates a unique `processingExecutionId` (format: `exec-{jobId}-{timestamp}`). This key is stored on the job document and validated by the internal process API:

1. If `job.processingExecutionId` exists and does not match the incoming `processingExecutionId` → reject with 409 `EXECUTION_ID_MISMATCH`
2. If job is `completed` with matching `processingExecutionId` → return success (idempotent replay)
3. If job is `failed_terminal` or `expired` or `refunded` → reject as terminal state

This prevents:
- Duplicate worker invocations for the same execution
- Late-arriving retries from overwriting newer execution state
- Accidental reprocessing of completed jobs

## Poison-Job Protection

A poison job is defined as a job that consistently fails at the same stage on every retry. Protection mechanisms:

1. **Retry budget**: Each job has a maximum retry count per the error taxonomy table. After exhausting retries, the job transitions to `failed_terminal`.
2. **Stage-level checkpointing**: If a job fails at `extracting` three times, it transitions to `failed_terminal` at the `extracting` stage. It never proceeds to later stages.
3. **Release on terminal failure**: When a job transitions to `failed_terminal`, the entitlement module calls `releaseEntitlement()` to return the 149 credits to the user.
4. **Manual review**: Jobs in `failed_terminal` can be manually reviewed by an admin to determine if the failure is systemic or isolated.

## Billing Safety

- **No duplicate billing**: Credits are reserved once at checkout. The consumption operation is idempotent via `paymentTransactionId`.
- **No charge on terminal failure**: `releaseEntitlement()` returns credits atomically.
- **No charge on diagnostic rejection**: Diagnostic failures never reach the payment stage.
- **Idempotent consume**: If the worker completes but the consume call fails, the retry will find a matching `paymentTransactionId` and skip the consume operation.

## Monitoring

### Key Metrics

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| Job queue depth | Cloud Tasks | > 50 pending |
| Stage failure rate | Firestore job events | > 5% of jobs |
| P99 processing duration | Firestore job timestamps | > 10 minutes |
| Poison job count | Firestore status: `failed_terminal` | > 3/hour |
| Storage upload errors | Worker logs | Any error |
| Manifest validation failures | Worker logs | Any failure |

### Logging

All worker operations log to Cloud Logging with structured JSON payload containing:
- `jobId`
- `processingExecutionId`
- `stage`
- `userId` (obfuscated for privacy)
- `durationMs`
- `error` (code + message, no PII)

## Troubleshooting

| Symptom | Likely Cause | Action |
|---------|-------------|--------|
| Job stuck in `queued` > 5 min | Cloud Tasks queue not delivering | Check queue configuration, verify worker URL |
| Job stuck in `extracting` | Provider timeout or crash | Check provider endpoint health, increase worker timeout |
| Job repeatedly fails at `validating` | Input data issue or validator bug | Check error log, run fixture against validator |
| Output manifest validation fails | File corruption during upload | Verify GCS bucket health, check output file sizes |
| `failed_terminal` spike | Systemic provider outage or schema change | Check provider status, roll back recent changes |
