/**
 * Document Fingerprint
 *
 * Computes and compares cryptographic fingerprints of source PDF documents
 * to provide deterministic identity verification across the processing pipeline.
 *
 * The fingerprint binds the source document's binary content (SHA-256 hash),
 * physical properties (size, page count), and MIME type validation status into
 * a single versioned record. This enables:
 *
 *  - Source document deduplication (same fingerprint = same document)
 *  - Integrity verification (hash mismatch = document altered)
 *  - Audit traceability (every processed document has a verifiable identity)
 *
 * Dependencies: Node crypto (built-in)
 */

import * as crypto from "node:crypto";

/* ── Constants ────────────────────────────────────────────────── */

const CURRENT_FINGERPRINT_VERSION = "1.0.0";

/* ── Fingerprint Contract ─────────────────────────────────────── */

export interface DocumentFingerprint {
  sourceDocumentSha256: string;
  sourceDocumentSize: number;
  sourcePageCount: number;
  sourceMimeValidated: boolean;
  sourceFingerprintVersion: string;
}

/* ── Allowed MIME Types ───────────────────────────────────────── */

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/tiff",
  "image/png",
  "image/jpeg",
]);

/**
 * Compute a deterministic fingerprint from a source document buffer.
 *
 * @param pdfBuffer - Raw bytes of the source PDF (or supported document)
 * @param pageCount  - Number of pages detected during diagnostic scan
 * @param mimeType   - MIME type label from upload validation
 * @returns A DocumentFingerprint with SHA-256 hash, size, page count,
 *          MIME validation flag, and schema version
 *
 * Throws if `pdfBuffer` is empty or `pageCount` is non-positive.
 */
export function computeFingerprint(
  pdfBuffer: Buffer,
  pageCount: number,
  mimeType: string,
): DocumentFingerprint {
  /* ── Input Guard ────────────────────────────────────────────── */
  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    throw new Error(
      `computeFingerprint: pdfBuffer must be a non-empty Buffer (received ${typeof pdfBuffer}, length=${pdfBuffer.length})`,
    );
  }

  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error(
      `computeFingerprint: pageCount must be a positive integer (received ${pageCount})`,
    );
  }

  if (typeof mimeType !== "string" || mimeType.trim().length === 0) {
    throw new Error(
      `computeFingerprint: mimeType must be a non-empty string (received ${typeof mimeType})`,
    );
  }

  /* ── Computation ────────────────────────────────────────────── */
  const sha256 = crypto.createHash("sha256").update(pdfBuffer).digest("hex");

  return {
    sourceDocumentSha256: sha256,
    sourceDocumentSize: pdfBuffer.length,
    sourcePageCount: pageCount,
    sourceMimeValidated: ALLOWED_MIME_TYPES.has(mimeType),
    sourceFingerprintVersion: CURRENT_FINGERPRINT_VERSION,
  };
}

/**
 * Compare two fingerprints for equality.
 *
 * Two fingerprints match if and only if all five fields are strictly equal.
 * This is intentional: a mismatch in any property (hash, size, pages, MIME
 * validation status, or schema version) means the documents are not identical
 * or the fingerprinting context has changed.
 *
 * @param a - First fingerprint
 * @param b - Second fingerprint
 * @returns true if all fields match exactly, false otherwise
 */
export function fingerprintsMatch(
  a: DocumentFingerprint,
  b: DocumentFingerprint,
): boolean {
  /* ── Null/Undefined Guard ───────────────────────────────────── */
  if (!a || !b) {
    return false;
  }

  return (
    a.sourceDocumentSha256 === b.sourceDocumentSha256 &&
    a.sourceDocumentSize === b.sourceDocumentSize &&
    a.sourcePageCount === b.sourcePageCount &&
    a.sourceMimeValidated === b.sourceMimeValidated &&
    a.sourceFingerprintVersion === b.sourceFingerprintVersion
  );
}
