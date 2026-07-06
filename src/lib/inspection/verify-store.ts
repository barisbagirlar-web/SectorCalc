/**
 * Engineering Diagnostics Verify Store
 *
 * Minimal verify metadata store for diagnostics.
 * Currently in-memory (no persistence) — foundation for future Firestore integration.
 *
 * No sensitive data is stored:
 * - No problem text
 * - No measurement rows
 * - No cost rows
 * - No customer/project names
 * - No user identifiers
 */

import type { DiagnosticReport } from "@/sectorcalc/diagnostics/report/diagnostic-report-types";
import { createDiagnosticReportHash } from "@/sectorcalc/diagnostics/report/diagnostic-report-canonicalize";

/* ── Types ── */

export interface DiagnosticVerifyMetadata {
  /** Deterministic SHA-256 hash of the canonical report payload */
  document_hash: string;
  /** Report type constant */
  report_type: "ENGINEERING_DIAGNOSTIC_PREVIEW";
  /** Decision state */
  decision: string;
  /** Total risk score (0-100) */
  risk_score: number;
  /** ISO 8601 timestamp */
  issued_at: string;
  /** Engine version that produced the report */
  engine_version: string;
  /** Schema version of the report contract */
  schema_version: string;
  /** Methodology version */
  methodology_version: string;
}

/* ── In-memory store ── */

const store = new Map<string, DiagnosticVerifyMetadata>();

/* ── Public API ── */

/**
 * Register a diagnostic report's verify metadata.
 *
 * Only non-sensitive metadata is stored — no problem text,
 * measurement rows, cost rows, or customer data.
 */
export function registerDiagnosticVerify(
  report: DiagnosticReport
): { hash: string; metadata: DiagnosticVerifyMetadata } {
  const documentHash = createDiagnosticReportHash(report);

  const metadata: DiagnosticVerifyMetadata = {
    document_hash: documentHash,
    report_type: report.report_type,
    decision: report.decision_section.decision,
    risk_score: report.decision_section.total_risk_score,
    issued_at: report.created_at,
    engine_version: report.engine_version,
    schema_version: report.schema_version,
    methodology_version: report.methodology_version,
  };

  store.set(documentHash, metadata);

  return { hash: documentHash, metadata };
}

/**
 * Look up verify metadata by document hash.
 *
 * Returns null if the hash has not been registered
 * (e.g., report not yet verified or expired from memory).
 */
export function lookupDiagnosticVerify(
  documentHash: string
): DiagnosticVerifyMetadata | null {
  return store.get(documentHash) ?? null;
}

/**
 * Get the number of registered verify records (for testing).
 */
export function getDiagnosticVerifyCount(): number {
  return store.size;
}

/**
 * Clear the verify store (for testing).
 */
export function clearDiagnosticVerifyStore(): void {
  store.clear();
}
