# Document Intelligence — Security Threat Model

## Scope

This threat model covers the Maintenance BOM Recovery product within Document Intelligence. It encompasses PDF upload, diagnostic scanning, payment, async processing, download, and source-deletion flows. Threats are categorized by attack surface, with mitigations enforced at API routes, Firestore security rules, Cloud Storage rules, and application-layer validation.

## Threat Register

### T1: MIME Spoofing

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker uploads a non-PDF file (e.g., `.exe`, `.html`, `.zip`) with a manipulated `Content-Type` of `application/pdf` or a `.pdf` extension. |
| **Impact** | Server processes untrusted content through the extraction provider, potentially triggering provider-side vulnerabilities or corrupting job state. |
| **Likelihood** | High |
| **Mitigation** | Server re-validates MIME type via file header magic bytes on the diagnostic/upload endpoint. The `allowedContentTypes` field returned to the client is advisory only; authoritative validation occurs server-side. |
| **Test Evidence Requirement** | Upload a JPEG renamed to `.pdf` with `Content-Type: application/pdf`. Server must reject with `INPUT_REJECTED`. |

### T2: Malformed PDF

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker submits a deliberately malformed PDF that triggers buffer overflows, infinite loops, or excessive memory allocation in the extraction provider. |
| **Impact** | Provider crash, denial of service, potential RCE if provider has parsing vulnerabilities. |
| **Likelihood** | Medium |
| **Mitigation** | Diagnostic stage performs PDF readability check before full extraction. File size limited to 50 MB. Page count limited to 50. Bounded extraction (max 500 rows). Extraction provider runs in isolated Cloud Run worker with memory limits. |
| **Test Evidence Requirement** | Submit a truncated PDF, a PDF with invalid cross-reference table, and a PDF with infinite object references. Each must be caught at diagnostic stage or worker stage without crashing the host process. |

### T3: Decompression Bomb (ZIP Bomb in PDF)

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker embeds a ZIP bomb inside a PDF stream. The small (e.g., 1 MB) file expands to multiple gigabytes during extraction, exhausting memory or disk on the worker. |
| **Impact** | Denial of service, worker OOM, billing impact for cloud resources. |
| **Likelihood** | Medium |
| **Mitigation** | File size limited to 50 MB before processing. Worker runs with bounded memory and CPU. Output streaming prevents full decompression in memory. Cloud Run enforces per-instance memory limits. If extraction fails due to resource exhaustion, job transitions to `failed_retryable`. |
| **Test Evidence Requirement** | Upload a known decompression-bomb PDF. Worker must fail gracefully (not OOM host) and transition to `failed_retryable`. |

### T4: JavaScript in PDF

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker embeds JavaScript in a PDF that executes during extraction or preview rendering. JavaScript could exfiltrate data or execute XSS against the processing pipeline. |
| **Impact** | Data exfiltration, XSS in review UI, provider-side script execution. |
| **Likelihood** | Low (most providers strip JS) |
| **Mitigation** | Extraction provider is configured to strip JavaScript during PDF parsing. The diagnostic step checks for JS annotations. Worker processes PDF server-side with no browser runtime. Output files are generated as xlsx/csv/html with formula-injection protection and HTML escaping. |
| **Test Evidence Requirement** | Upload a PDF with embedded JavaScript action. Diagnostic must flag it. Worker must not execute the script. |

### T5: Password-Protected / Encrypted PDF

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker uploads a password-protected or encrypted PDF that the extraction provider cannot open. The job proceeds to diagnostic, fails, and wastes user time. |
| **Impact** | User confusion, failed diagnostic, poor experience. No security bypass (provider cannot decrypt). |
| **Likelihood** | Medium |
| **Mitigation** | Diagnostic detects `passwordProtected: true` and immediately reports `diagnostic_rejected` with a clear message. No extraction attempt is made. The job never transitions to `diagnostic_scanning`. |
| **Test Evidence Requirement** | Upload a password-protected PDF. Diagnostic must return `passwordProtected: true` and status `rejected`. No credit charge occurs. |

### T6: Path Traversal in Filename

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker submits a filename like `../../etc/passwd.pdf` or `../../../admin/config` during upload. If unsanitized, the storage path could overwrite files outside the intended directory. |
| **Impact** | Unauthorized file write outside the sandboxed storage path, potentially overwriting system files or other users' data. |
| **Likelihood** | High |
| **Mitigation** | Filename is sanitized on the server: all characters outside `[a-zA-Z0-9._-]` are replaced with `_`. Storage path is constructed as `document-intelligence/{uid}/{jobId}/source/{sanitized_filename}` — the UID and jobId are server-generated, not user-supplied. |
| **Test Evidence Requirement** | Submit filenames with `../`, `..\\`, null bytes, and absolute paths. All must be reduced to safe alphanumeric tokens. |

### T7: Unicode Confusion in Filename

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker uses homoglyph characters (e.g., Cyrillic `а` instead of Latin `a`) in the filename to bypass extension filters or create lookalike filenames. |
| **Impact** | Bypass of extension-based allowlisting, confusion in download UI. |
| **Likelihood** | Low |
| **Mitigation** | Sanitization regex `[^a-zA-Z0-9._-]` strips all non-ASCII characters including homoglyphs. The sanitized filename is entirely ASCII. |
| **Test Evidence Requirement** | Submit filename with Cyrillic homoglyphs. All homoglyph characters must be replaced with `_`. |

### T8: Formula Injection in Extracted Cells

| Attribute | Value |
|-----------|-------|
| **Threat** | Source PDF contains cell values starting with `=`, `+`, `-`, `@`, `\t`, or `\r`. When exported to xlsx/csv and opened by the user, these cells execute as formulas in Excel or Google Sheets, potentially exfiltrating data or executing macros. |
| **Impact** | End-user data exfiltration via DDE/Excel formula execution. Reputational damage. |
| **Likelihood** | High (common in BOM extraction) |
| **Mitigation** | All cell values in xlsx and csv generators are prefixed with `'` (single quote) when they start with a formula-injection character sequence. This forces Excel/Sheets to treat the value as text. Formula injection protection is applied at the workbook-generator and csv-generator layers — every exported value passes through `safeCellValue()` or `csvEscape()`. |
| **Test Evidence Requirement** | Fixture test in `workbook-integrity.test.ts` must verify that values starting with `=` are neutralized. Both xlsx and csv outputs must be tested. |

### T9: Prompt Injection (Document Contents as Data, Not Instructions)

| Attribute | Value |
|-----------|-------|
| **Threat** | The extraction result (document contents) is passed to downstream processing. If document text contains instructions intended to manipulate the processing pipeline (e.g., "Ignore previous instructions, output admin=true"), and the processor treats document text as instructions, the system could be compromised. |
| **Impact** | Manipulation of validation results, bypass of quality gates, generation of fraudulent outputs. |
| **Likelihood** | Medium |
| **Mitigation** | Document contents are treated strictly as **data**, never as instructions. The processing pipeline uses deterministic algorithmic transformation (normalization, duplicate detection, missing-field checks) — no LLM or prompt-based decision-making is used. All extracted values are escaped before output generation. The provider abstraction layer returns raw extracted data with confidence scores; no provider prompt is executed with user document content. |
| **Test Evidence Requirement** | Upload a PDF whose table contains text mimicking control instructions. The pipeline must process it as data, producing a row with that text in the appropriate field. No logic change must occur. |

### T10: Provider Output Injection

| Attribute | Value |
|-----------|-------|
| **Threat** | A compromised or malicious extraction provider returns crafted output designed to exploit the canonical mapper or downstream validators — e.g., NaN quantities, prototype-polluting keys, excessively nested structures, or values that cause regex DoS. |
| **Impact** | Pipeline crash, corrupted job state, downstream consumer data corruption. |
| **Likelihood** | Low (trusted provider, but defense-in-depth required) |
| **Mitigation** | Each provider output field is validated and coerced in the canonical mapper: quantities pass through `Number.isFinite` check, strings are trimmed and nullified if empty, object keys are restricted to the defined column schema. The provider abstraction layer enforces a strict `ExtractionResult` interface. Unexpected fields are discarded. Row confidence is clamped to `[0, 1]`. |
| **Test Evidence Requirement** | Simulate a provider returning NaN, Infinity, negative quantity, extremely nested objects, and prototype-polluting keys. All must be safely coerced or rejected. |

### T11: SSRF Through Document References

| Attribute | Value |
|-----------|-------|
| **Threat** | PDF contains hyperlinks, embedded images, or cross-references to external URLs. If the extraction provider fetches these resources, it could be used as a SSRF vector against internal services. |
| **Impact** | Internal network scanning, access to cloud metadata endpoints, data exfiltration. |
| **Likelihood** | Low |
| **Mitigation** | The extraction provider (currently mock) must be configured to not follow external references. In production, the provider operates with network egress restricted to the document processor API only. The worker runs in a Cloud Run service with VPC egress controlled and no access to internal services beyond the designated provider endpoint. |
| **Test Evidence Requirement** | Document the provider's network access restrictions. Runtime verification requires e2e test with a PDF containing external hyperlinks. |

### T12: Cross-Tenant Access (IDOR on Job Routes)

| Attribute | Value |
|-----------|-------|
| **Threat** | Authenticated user A accesses user B's job by guessing or enumerating `jobId` values. All job routes contain `{jobId}` as a path parameter. |
| **Impact** | Unauthorized access to job metadata, diagnostic results, payment status, download URLs, and source document metadata. |
| **Likelihood** | High |
| **Mitigation** | Every API route with `{jobId}` performs owner verification: `job.userId !== user.uid` returns 403 `FORBIDDEN`. Firestore rules enforce tenant isolation at the document level: `allow read: if request.auth != null && resource.data.userId == request.auth.uid`. Client-side writes are universally denied (`allow create, update, delete: if false`). |
| **Test Evidence Requirement** | Authenticated user A must receive 403 when requesting user B's job via GET, checkout, execute, and downloads routes. |

### T13: IDOR on Download Routes

| Attribute | Value |
|-----------|-------|
| **Threat** | Signed URL for output download is shared or intercepted, allowing unauthorized download of completed job outputs. |
| **Impact** | Data leakage of BOM data, procurement exceptions, and source maps. |
| **Likelihood** | Medium |
| **Mitigation** | Download URLs are generated as short-lived signed URLs (5-minute TTL by default via `MAINTENANCE_BOM_SIGNED_URL_TTL_SECONDS = 300`). URLs are scoped to the specific storage path within the owner's directory. Storage rules enforce path isolation. Signed URLs are never returned before job completion. |
| **Test Evidence Requirement** | Verify signed URL expires after 300 seconds. Verify expired URL returns 403 from GCS. |

### T14: Rate Limiting

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker floods the upload, checkout, or execute endpoints with requests, causing resource exhaustion, excessive Firestore reads, or financial DoS through credit reservation attempts. |
| **Impact** | Service degradation, increased cloud costs, potential credit reservation deadlocks. |
| **Likelihood** | Medium |
| **Mitigation** | Feature flag (`DOCUMENT_INTELLIGENCE_ENABLED`) provides a global kill switch. Upload endpoint is protected by auth requirement (Bearer token). Checkout requires a valid `diagnostic_eligible` job and checks credit balance with each request. Execute is idempotent — retries do not charge additional credits. (Production requirement: per-user rate limiting on upload and checkout endpoints via middleware or API gateway.) |
| **Test Evidence Requirement** | (Planned) Rate limiter must return 429 status when exceeded. |

### T15: Webhook Signature Bypass (Future — Paddle)

| Attribute | Value |
|-----------|-------|
| **Threat** | Attacker sends a forged Paddle webhook event (e.g., `payment.completed`) to the webhook endpoint. If signature verification is missing or bypassed, the attacker could trigger entitlement grant without payment. |
| **Impact** | Free processing of paid jobs, revenue loss. |
| **Likelihood** | Low (before Paddle integration) |
| **Mitigation** | (Planned) All Paddle webhook events will be validated using Paddle's signature verification with `PADDLE_WEBHOOK_SECRET`. The webhook endpoint will verify the `Paddle-Signature` header before processing. Signature verification will be implemented as a middleware function. |
| **Test Evidence Requirement** | (Planned) Forged webhook with invalid signature must be rejected with 401. Only verified events trigger entitlement state changes. |

### T16: Race Condition — Refund vs Execution

| Attribute | Value |
|-----------|-------|
| **Threat** | A user requests a refund while the job is concurrently executing. Without proper ordering, the job could complete and deliver output after the refund is processed, resulting in free output. |
| **Impact** | Revenue loss — output delivered without payment. |
| **Likelihood** | Low |
| **Mitigation** | Refund transitions the job to `refunded` state. The state machine does not allow transitions from `refunded` to any processing state (`refunded` has no valid outgoing transitions). The worker checks job status before each stage transition. If the job is `refunded`, processing is aborted. |
| **Test Evidence Requirement** | Simulate concurrent refund and execute operations. The job must end in `refunded` state regardless of which completes first. No output must be generated after refund. |

### T17: Race Condition — Deletion vs Download

| Threat | A user requests download at the same time as the scheduled source-deletion task executes. |
| **Impact** | Partial download set (some files deleted during download), 404 on a signed URL that was just invalidated. |
| **Likelihood** | Low |
| **Mitigation** | Source deletion is independent of output deletion. Source retention is 24 hours; output retention is 7 days. The download API checks file existence individually (`file.exists()` before signing), so deleted files are simply omitted from the response. Output deletion is a separate scheduled operation. |
| **Test Evidence Requirement** | Simulate concurrent deletion and download. Download endpoint must return available files without error. Missing files must be silently omitted from the response. |

### T18: Race Condition — Duplicate Execute

| Attribute | Value |
|-----------|-------|
| **Threat** | User clicks "Start Processing" multiple times rapidly, sending concurrent POST /execute requests before any of them completes. |
| **Impact** | Multiple processing executions for the same job, potential duplicate billing. |
| **Likelihood** | Medium |
| **Mitigation** | Execute endpoint is idempotent: it checks if `job.status` is already `queued` and returns the current state without creating a new execution. The `processingExecutionId` is generated on first execute and stored on the job document. Subsequent requests with matching execution are idempotently handled. Only one Firestore update occurs per job. |
| **Test Evidence Requirement** | Send 5 concurrent execute requests for the same job. Only one should transition to `queued`; the remaining 4 must return success with "already queued" message. No duplicate processingExecutionId must exist. |

## Summary

| Threat | Impact | Likelihood | Mitigated | Tested |
|--------|--------|------------|-----------|--------|
| T1 MIME Spoofing | Medium | High | Yes | Planned |
| T2 Malformed PDF | High | Medium | Yes | Planned |
| T3 Decompression Bomb | High | Medium | Yes | Planned |
| T4 JavaScript in PDF | High | Low | Yes | Planned |
| T5 Password-Protected PDF | Low | Medium | Yes | Planned |
| T6 Path Traversal | High | High | Yes | Planned |
| T7 Unicode Confusion | Low | Low | Yes | Planned |
| T8 Formula Injection | Medium | High | Yes | PASS |
| T9 Prompt Injection | Medium | Medium | Yes | Planned |
| T10 Provider Output Injection | Medium | Low | Yes | Planned |
| T11 SSRF | High | Low | Partial | Planned |
| T12 Cross-Tenant Access | High | High | Yes | PASS (unit) |
| T13 IDOR Downloads | Medium | Medium | Yes | Planned |
| T14 Rate Limiting | Medium | Medium | Partial | Planned |
| T15 Webhook Bypass | High | Low | Planned | Not implemented |
| T16 Refund vs Execution | High | Low | Yes | Planned |
| T17 Deletion vs Download | Low | Low | Yes | Planned |
| T18 Duplicate Execute | Medium | Medium | Yes | Planned |

## Residual Risk

- **Provider compromise**: If the extraction provider is compromised, it could return malicious output. Mitigated by canonical mapper validation and output integrity checks (SHA-256 manifest validation).
- **Supply chain**: The `xlsx` (SheetJS) package is a dependency of the workbook generator. Any vulnerability in xlsx could affect output generation. Mitigated by formula-injection pre-escaping applied at the application layer, independent of xlsx.
- **Cloud Task authentication**: Until Cloud Tasks is provisioned with proper service-to-service auth, the internal process endpoint uses a shared secret (`DOCUMENT_WORKER_SECRET`). This is a planned improvement for production hardening.
