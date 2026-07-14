# Document Intelligence — Firestore & Storage Model

## Firestore Collections

### `documentIntelligenceJobs/{jobId}`

| Field | Type | Description |
|---|---|---|
| userId | string | Owner UID (authenticated user) |
| productCode | string | `maintenance_bom_recovery` |
| sourceSite | string | `sectorcalc` |
| status | JobStatus | Current state machine state |
| diagnosticStatus | DiagnosticStatus | `eligible`, `manual_review_required`, `rejected`, `diagnostic_failed` |
| paymentStatus | PaymentStatus | `unpaid`, `checkout_pending`, `paid`, `refunded`, `chargeback`, `payment_failed` |
| entitlementStatus | EntitlementStatus | `none`, `reserved`, `consumed`, `released`, `compensated` |
| originalFilenameSanitized | string | Sanitized original filename |
| mimeType | string | Detected MIME type |
| fileSizeBytes | number | File size |
| pageCount | number | Detected page count |
| detectedLanguage | string | Detected language |
| estimatedRows | number | Estimated BOM rows |
| acceptedLimitsSnapshot | object | Limits at time of acceptance |
| engineVersion | string | Processing engine version |
| validatorVersion | string | Validator version |
| schemaVersion | string | Schema version |
| sourceStoragePath | string | GCS path for source |
| outputStoragePaths | object | GCS paths for outputs |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| startedAt | timestamp | |
| completedAt | timestamp | |
| failedAt | timestamp | |
| expiresAt | timestamp | Output expiry |
| sourceDeletedAt | timestamp | Source deletion time |
| failureCode | string | Error code |
| failurePublicMessage | string | Safe error message |
| retryCount | number | |
| processingExecutionId | string | Idempotent execution key |
| checkoutRequestId | string | |
| paymentTransactionId | string | |
| metricsSummary | object | Processing metrics |

### `documentIntelligenceJobs/{jobId}/events/{eventId}`

| Field | Type | Description |
|---|---|---|
| type | string | Event type |
| fromStatus | string | Previous state |
| toStatus | string | New state |
| actor | string | `user`, `system`, `worker` |
| timestamp | timestamp | |
| executionId | string | |

### `documentIntelligenceJobs/{jobId}/rows/{rowId}` (optional — for review UI)

| Field | Type | Description |
|---|---|---|
| normalized fields | BomRow | Canonical row |
| source references | object | Page, table, row |
| confidence | number | |
| validationFlags | string[] | |
| exportDisposition | string | `clean`, `review_required`, `excluded_duplicate` |

## Cloud Storage Paths

```
document-intelligence/{uid}/{jobId}/source/{sanitized_filename}
document-intelligence/{uid}/{jobId}/output/SectorCalc_Maintenance_BOM_{jobId}.xlsx
document-intelligence/{uid}/{jobId}/output/SectorCalc_Procurement_Exception_Report_{jobId}.xlsx
document-intelligence/{uid}/{jobId}/output/SectorCalc_Source_Map_{jobId}.csv
document-intelligence/{uid}/{jobId}/output/SectorCalc_Processing_Summary_{jobId}.html
```

## Security Rules

Firestore: Owner read-only, server-only writes for critical fields (status, payment, entitlement).
Storage: Owner read with signed URL, server-only write.

See `firestore.rules` and `storage.rules` for current rule definitions.
