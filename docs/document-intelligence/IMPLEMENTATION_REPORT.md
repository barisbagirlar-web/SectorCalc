# Document Intelligence — Implementation Report

## Architecture Overview

Document Intelligence is a document processing subsystem within SectorCalc. It provides PDF upload, extraction, validation, and output generation for maintenance BOM (Bill of Materials) recovery. The implementation follows a layered architecture with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  Next.js Pages (Server + Client Components)                  │
│  /document-intelligence/*                                    │
├─────────────────────────────────────────────────────────────┤
│                     API Layer                                │
│  Next.js Route Handlers (Node.js runtime)                    │
│  /api/document-intelligence/*                                │
├─────────────────────────────────────────────────────────────┤
│                   Domain Logic Layer                          │
│  src/lib/document-intelligence/                               │
│  ├─ contracts/       (state machine, mapper, provider,       │
│  │                     output manifest contracts)             │
│  ├─ entitlements/    (credit/payment integration)            │
│  ├─ validators/      (normalization, duplicate detection,    │
│  │                     missing fields, conflicts, disposition)│
│  └─ workbook/        (xlsx, csv, html output generators)     │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                         │
│  Firebase Auth, Firestore, Cloud Storage, Cloud Tasks(future)│
│  Mock Extraction Provider (stub for real provider)            │
└─────────────────────────────────────────────────────────────┘
```

## Files Created

### Type Contracts and Configuration

| File | Path |
|------|------|
| Document Intelligence Types | `src/types/document-intelligence.ts` |

### Domain Logic — Contracts

| File | Path |
|------|------|
| Job State Machine | `src/lib/document-intelligence/contracts/job-state-machine.ts` |
| Canonical Mapper | `src/lib/document-intelligence/contracts/canonical-mapper.ts` |
| Provider Interfaces | `src/lib/document-intelligence/contracts/provider-interfaces.ts` |
| Output Manifest | `src/lib/document-intelligence/contracts/output-manifest.ts` |

### Domain Logic — Entitlements

| File | Path |
|------|------|
| Maintenance BOM Entitlement | `src/lib/document-intelligence/entitlements/maintenance-bom-entitlement.ts` |

### Domain Logic — Validators

| File | Path |
|------|------|
| Part Normalizer | `src/lib/document-intelligence/validators/part-normalizer.ts` |
| Duplicate Detector | `src/lib/document-intelligence/validators/duplicate-detector.ts` |
| Missing Field Detector | `src/lib/document-intelligence/validators/missing-field-detector.ts` |
| Revision Conflict Detector | `src/lib/document-intelligence/validators/revision-conflict-detector.ts` |
| Export Disposition | `src/lib/document-intelligence/validators/export-disposition.ts` |

### Domain Logic — Workbook Generators

| File | Path |
|------|------|
| Workbook Generator | `src/lib/document-intelligence/workbook/workbook-generator.ts` |
| CSV Generator | `src/lib/document-intelligence/workbook/csv-generator.ts` |
| Summary HTML Generator | `src/lib/document-intelligence/workbook/summary-generator.ts` |

### API Routes

| File | Path |
|------|------|
| Health Check | `src/app/api/document-intelligence/health/route.ts` |
| Diagnostic Upload | `src/app/api/document-intelligence/maintenance-bom/diagnostic/upload/route.ts` |
| Job Status | `src/app/api/document-intelligence/maintenance-bom/jobs/[jobId]/route.ts` |
| Checkout | `src/app/api/document-intelligence/maintenance-bom/jobs/[jobId]/checkout/route.ts` |
| Execute | `src/app/api/document-intelligence/maintenance-bom/jobs/[jobId]/execute/route.ts` |
| Downloads | `src/app/api/document-intelligence/maintenance-bom/jobs/[jobId]/downloads/route.ts` |
| Internal Process | `src/app/api/document-intelligence/maintenance-bom/internal/process/route.ts` |
| Samples | `src/app/api/document-intelligence/samples/route.ts` |

### Pages

| File | Path |
|------|------|
| Category Landing | `src/app/document-intelligence/page.tsx` |
| Product Landing | `src/app/document-intelligence/maintenance-bom-recovery/page.tsx` |
| Upload/New Job | `src/app/document-intelligence/maintenance-bom-recovery/new/page.tsx` |
| Job Detail | `src/app/document-intelligence/maintenance-bom-recovery/jobs/[jobId]/page.tsx` |
| Review | `src/app/document-intelligence/maintenance-bom-recovery/jobs/[jobId]/review/page.tsx` |

### Integration Points

| File | Path | Purpose |
|------|------|---------|
| SiteHeader | `src/components/layout/SiteHeader.tsx` | Desktop navigation link |
| MobileNavigationShell | `src/components/layout/mobile/MobileNavigationShell.tsx` | Mobile navigation section |
| EnterpriseFooter | `src/components/layout/EnterpriseFooter.tsx` | Footer link |
| Sitemap Manifest | `src/lib/infrastructure/seo/sitemap-manifest.ts` | SEO route registration |
| Firebase Admin | `src/lib/infrastructure/firebase/admin.ts` | Admin SDK integration (existing) |
| Firestore Rules | `firestore.rules` | Tenant isolation rules |

### Sample Data

| File | Path |
|------|------|
| Sample Maintenance BOM | `public/samples/Sample_Maintenance_BOM.xlsx` |
| Sample Exception Report | `public/samples/Sample_Procurement_Exception_Report.xlsx` |
| Sample Source Map | `public/samples/Sample_Source_Map.csv` |

### Scripts

| File | Path |
|------|------|
| Sample BOM Output Generator | `scripts/generate-sample-bom-outputs.mjs` |

### Environment

| File | Path |
|------|------|
| Environment Example | `.env.example` (updated with DI variables) |

### Tests

| File | Path | Tests |
|------|------|-------|
| Job State Machine | `tests/document-intelligence/job-state-machine.test.ts` | 9 |
| Part Normalizer | `tests/document-intelligence/part-normalizer.test.ts` | 12 |
| Duplicate Detector | `tests/document-intelligence/duplicate-detector.test.ts` | 6 |
| Missing Field Detector | `tests/document-intelligence/missing-field-detector.test.ts` | 7 |
| Revision Conflict Detector | `tests/document-intelligence/revision-conflict-detector.test.ts` | 4 |
| Export Disposition | `tests/document-intelligence/export-disposition.test.ts` | 5 |
| Entitlement | `tests/document-intelligence/entitlement.test.ts` | 9 |
| Workbook Integrity | `tests/document-intelligence/workbook-integrity.test.ts` | 9 |
| Security / Adversarial | `tests/document-intelligence/security-adversarial.test.ts` | 36 |
| Provider Contract | `tests/document-intelligence/provider-contract.test.ts` | 12 |

### Documentation

| File | Path |
|------|------|
| Product Contract | `docs/document-intelligence/PRODUCT_CONTRACT.md` |
| Architecture | `docs/document-intelligence/ARCHITECTURE.md` |
| Data Flow | `docs/document-intelligence/DATA_FLOW.md` |
| Firestore & Storage Model | `docs/document-intelligence/FIRESTORE_STORAGE_MODEL.md` |
| API Contracts | `docs/document-intelligence/API_CONTRACTS.md` |
| Environment Checklist | `docs/document-intelligence/ENVIRONMENT_CHECKLIST.md` |
| Legal Review Checklist | `docs/document-intelligence/LEGAL_REVIEW_CHECKLIST.md` |
| Security Threat Model | `docs/document-intelligence/SECURITY_THREAT_MODEL.md` |
| Billing & Entitlement Model | `docs/document-intelligence/BILLING_ENTITLEMENT_MODEL.md` |
| Worker Runbook | `docs/document-intelligence/WORKER_RUNBOOK.md` |
| Incident Runbook | `docs/document-intelligence/INCIDENT_RUNBOOK.md` |
| Deployment Runbook | `docs/document-intelligence/DEPLOYMENT_RUNBOOK.md` |
| Rollback Runbook | `docs/document-intelligence/ROLLBACK_RUNBOOK.md` |
| Test Evidence | `docs/document-intelligence/TEST_EVIDENCE.md` |
| Traceability Matrix | `docs/document-intelligence/TRACEABILITY_MATRIX.md` |

## Module Descriptions

### `src/types/document-intelligence.ts`

Single source of truth for all Document Intelligence type definitions, constants, and configuration defaults. Includes:

- Job statuses and valid state transitions (`VALID_TRANSITIONS`)
- Diagnostic result schema
- Payment and entitlement status types
- Canonical BOM row schema (`BomRow`)
- Part normalization, duplicate detection, missing field, revision conflict types
- Output manifest and processing summary types
- Error code taxonomy with retryability configuration
- Feature flag helper `isDocumentIntelligenceEnabled()`

### `src/lib/document-intelligence/contracts/job-state-machine.ts`

Deterministic state machine that guards all job status transitions. Exposes `assertValidTransition(from, to)` which throws `IllegalTransitionError` on illegal moves. The transition table is defined in `VALID_TRANSITIONS` in the types file.

### `src/lib/document-intelligence/contracts/canonical-mapper.ts`

Maps provider-agnostic `ExtractionResult` into the canonical `BomRow[]` schema. Handles edge cases: null/empty values → null, unparseable quantities → null with review flag, negative quantities → null, minimum-confidence row scoring, and review-required determination.

### `src/lib/document-intelligence/contracts/provider-interfaces.ts`

Defines the `ExtractionProvider` contract (diagnose + extract methods). Includes the `MockExtractionProvider` implementation that generates fully deterministic synthetic data for testing and staging. The mock supports configurable parameters (page count, language, password protection, row count, etc.) and is used by all test suites.

### `src/lib/document-intelligence/contracts/output-manifest.ts`

Cryptographic integrity layer for output artifacts. `generateManifest()` computes SHA-256 hashes for every output file and records them in the manifest. `validateManifest()` verifies that actual files match the manifest hashes and sizes.

### `src/lib/document-intelligence/entitlements/maintenance-bom-entitlement.ts`

Integrates with the existing SectorCalc credit system. Provides four operations:

- `checkEntitlement()` — reads `users/{uid}/credits/balance.amount` and compares against 149 credit cost
- `reserveCredits()` — atomic Firestore transaction that deducts 149 credits and records a reserve transaction
- `consumeEntitlement()` — marks reservation as consumed with paymentTransactionId
- `releaseEntitlement()` — returns 149 credits to user on terminal failure or refund

Also provides `getCheckoutData()` for public checkout information and `deriveEntitlementStatus()` for status mapping.

### `src/lib/document-intelligence/validators/part-normalizer.ts`

Deterministic part-number normalization pipeline. Operations: Unicode NFC normalization, trim whitespace, collapse internal spaces, normalize dash variants (en-dash, em-dash, etc.) to ASCII hyphen, non-breaking space normalization, uppercase comparison key production. Preserves leading zeroes. Returns both display value and comparison key. Never infers new OEM numbers.

### `src/lib/document-intelligence/validators/duplicate-detector.ts`

Seven classes of duplicate detection:

1. Exact normalized part number duplicate (low severity, auto-merge allowed)
2. Same part number, conflicting description (high severity)
3. Same part number, conflicting revision (critical severity)
4. Same part number, conflicting manufacturer (high severity)
5. Probable formatting duplicate (planned)
6. Same description, different part number — informational (planned)
7. Duplicate source row extraction (medium severity, auto-merge allowed)

Returns duplicate groups and consolidated row indices.

### `src/lib/document-intelligence/validators/missing-field-detector.ts`

Detects missing required fields (part number, description, quantity — export-blocking), conditional fields (revision, manufacturer — flagged when others have it), and optional fields (material, unit). Each exception carries a type, severity, and exportBlocking flag.

### `src/lib/document-intelligence/validators/revision-conflict-detector.ts`

Four classes of revision conflict detection: multiple revisions (critical), title block mismatch (planned), partial missing revision (medium), OCR confusion (planned), mixed revision schemes (high). Never infers which revision is current.

### `src/lib/document-intelligence/validators/export-disposition.ts`

Determines the export disposition for each row based on validation results:

- Missing required fields → blocked from clean export (review_required)
- Low confidence → review required
- Consolidated duplicates → excluded
- Clean → eligible for Clean BOM sheet

### `src/lib/document-intelligence/workbook/workbook-generator.ts`

Generates two Excel workbooks:

1. **Maintenance BOM Workbook** (8 sheets): Clean BOM, Review Required, Duplicate Parts, Missing Fields, Revision Conflicts, Source Map, Processing Summary, Generic ERP Import Template
2. **Procurement Exception Report** (7 sheets): Executive Summary, Critical Exceptions, Duplicate Candidates, Missing Required Data, Revision Conflicts, Recommended Review Sequence

All sheets have frozen headers, autofilters, and formula injection protection (values starting with `=`, `+`, `-`, `@`, `\t`, `\r` are prefixed with `'`).

### `src/lib/document-intelligence/workbook/csv-generator.ts`

Generates `SectorCalc_Source_Map.csv` with row-level source traceability. Applies CSV escaping with formula injection protection.

### `src/lib/document-intelligence/workbook/summary-generator.ts`

Generates a printable HTML processing summary. Includes processing metrics, what was processed/excluded/normalized, validations applied, retention policy, and required disclaimer.

### API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/health` | GET | None | Feature flag and product availability |
| `/diagnostic/upload` | POST | Bearer token | Initialize free diagnostic upload |
| `/jobs/{jobId}` | GET | Bearer token | Owner-only job state retrieval |
| `/jobs/{jobId}/checkout` | POST | Bearer token | Checkout with credit check |
| `/jobs/{jobId}/execute` | POST | Bearer token | Idempotent processing queue |
| `/jobs/{jobId}/downloads` | GET | Bearer token | Short-lived signed download URLs |
| `/internal/process` | POST | Service token | Async worker pipeline invocation |
| `/samples` | GET | None | Sample file download (public) |

### Pages

| Route | Type | Purpose |
|-------|------|---------|
| `/document-intelligence` | Server component | Category landing page |
| `/document-intelligence/maintenance-bom-recovery` | Server component | Product landing page |
| `/document-intelligence/maintenance-bom-recovery/new` | Client component | Upload and diagnostic UI |
| `/document-intelligence/maintenance-bom-recovery/jobs/[jobId]` | Client component | Job detail, status, download |
| `/document-intelligence/maintenance-bom-recovery/jobs/[jobId]/review` | Client component | Row-by-row review UI |

## Integration Points

| Integration | Type | Details |
|-------------|------|---------|
| Firebase Auth | Authentication | All API routes verify Bearer token via `verifySignedInUser()` |
| Firestore | Persistence | Jobs in `documentIntelligenceJobs/{jobId}`, events in subcollection, credit transactions in `creditTransactions` |
| Cloud Storage | File storage | Source PDFs and output artifacts in `document-intelligence/{uid}/{jobId}/` |
| Credit System | Payment | Existing balance at `users/{uid}/credits/balance` |
| SiteHeader | Navigation | Desktop link to `/document-intelligence` |
| MobileNavigationShell | Navigation | Mobile section with link to product page |
| EnterpriseFooter | Navigation | Footer link to `/document-intelligence` |
| Sitemap Manifest | SEO | Two routes registered: hub + product |
| Feature Flag | Gating | `DOCUMENT_INTELLIGENCE_ENABLED` env var |
| Environment Variables | Configuration | 20+ env vars for limits, retention, provider, pricing |

## Security Model

### Authentication

- All job-specific API routes require Bearer token authentication
- Internal process route uses service-to-service shared secret
- Token is verified via Firebase Admin SDK `verifySignedInUser()`

### Authorization (Tenant Isolation)

- Every `{jobId}` route checks `job.userId !== user.uid` → 403 FORBIDDEN
- Firestore rules enforce: `allow read: if request.auth != null && resource.data.userId == request.auth.uid`
- Client writes universally denied (`allow create, update, delete: if false`)
- Storage paths are scoped by UID: `document-intelligence/{uid}/...`

### Input Validation

- Filename sanitization: `[^a-zA-Z0-9._-]` replaced with `_`
- File size limit: 50 MB (server-enforced)
- Page count limit: 50
- Row count limit: 500
- MIME type re-validation server-side
- PDF readability and password detection at diagnostic stage

### Output Security

- Formula injection protection in all xlsx/csv outputs
- HTML escaping in processing summary (XSS prevention)
- SHA-256 manifest validation for all output files
- Short-lived signed URLs (5-minute TTL) for downloads

### Payment Security

- Atomic credit reservation via Firestore transaction
- Server-only entitlement operations
- Idempotency keys prevent duplicate charges
- Diagnostic flow is always free (state machine prevents payment path)

### Rate Limiting

- Feature flag provides global kill switch
- Per-user rate limiting is planned (not yet implemented)

## Known Gaps and Planned Improvements

### Production Readiness Gaps

| Gap | Impact | Plan |
|-----|--------|------|
| Cloud Tasks queue not provisioned | Worker runs inline in API route | Provision queue and deploy worker separately |
| Cloud Run worker not deployed | No separate worker process | Containerize worker and deploy to Cloud Run |
| No real extraction provider | Only mock data in development | Integrate with document processor provider |
| No Paddle payment integration | Credits are only payment method | Integrate Paddle webhook and checkout |
| No per-user rate limiting | Potential abuse of upload/checkout | Implement rate limiting middleware |
| No scheduled source deletion | Source files not auto-deleted | Build scheduled Cloud Function or lifecycle policy |

### Testing Gaps

| Gap | Impact | Plan |
|-----|--------|------|
| No integration tests | Full pipeline not end-to-end tested | Add integration test suite with Firestore emulator |
| No adversarial upload tests | MIME spoofing, malformed PDF not integration-tested | Add test suite for security threats |
| No concurrent access tests | Race conditions not verified under load | Add concurrent Firestore transaction tests |
| No e2e tests | Browser flow not verified | Add Playwright/Cypress tests |

### Feature Gaps (v1 Exclusions)

| Gap | Impact |
|-----|--------|
| Non-English documents | Only English supported in v1 |
| Scanned/image-only PDFs | Requires OCR provider (not included) |
| Direct SAP/Oracle/ERP integration | v1 outputs standard Excel only |
| Automated refund processing | Refunds are admin-initiated |
| Invoice generation | Credit transactions serve as audit trail |
| Promotional credits/discounts | Not supported in v1 |

## Final Status Flags

| Check | Status |
|-------|--------|
| **TYPECHECK** | PASS |
| **LINT** | PASS |
| **BUILD** | PASS |
| **UNIT TESTS** | 109 PASS (10 files) |
| **INTEGRATION TESTS** | NOT_IMPLEMENTED |
| **PRODUCTION BUILD** | PASS |
| **FIREBASE RULES** | DEPLOYED (pending full deploy) |
| **FEATURE FLAG** | CONFIGURABLE (`DOCUMENT_INTELLIGENCE_ENABLED`) |
| **NAVIGATION INTEGRATION** | COMPLETE (header, mobile, footer, sitemap) |
| **SECURITY THREAT MODEL** | DOCUMENTED |
| **BILLING MODEL** | DOCUMENTED AND TESTED |
| **DEPLOYMENT RUNBOOK** | DOCUMENTED |
| **ROLLBACK RUNBOOK** | DOCUMENTED |
| **INCIDENT RUNBOOK** | DOCUMENTED |
| **TRACEABILITY MATRIX** | DOCUMENTED |
| **PRODUCTION DEPLOYMENT** | NOT_DEPLOYED (waiting for go decision) |
| **CLOUD TASKS QUEUE** | NOT_PROVISIONED |
| **CLOUD RUN WORKER** | NOT_DEPLOYED |
| **PADDLE INTEGRATION** | NOT_IMPLEMENTED |
| **LEGAL REVIEW** | PENDING |
