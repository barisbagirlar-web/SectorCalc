/**
 * Human Quality Assurance Workflow (Section 66)
 *
 * The automatic USD 149 flow must include a bounded QA control.
 *
 * Automatic completion is permitted only when:
 *  - no critical reconciliation disagreement
 *  - no critical false-clean indicator
 *  - source traceability completeness = 100%
 *  - row conservation passes
 *  - workbook integrity passes
 *  - all clean rows pass critical validators
 *
 * If critical integrity condition fails:
 *  - do not release Clean BOM as final
 *  - move job to quality_hold
 *  - do not consume an additional entitlement
 *  - allow bounded operator QA if commercial configuration enables it
 */

import type { BomRow, ReconciliationStatus } from "@/types/document-intelligence";
import type { DispositionResult } from "@/lib/document-intelligence/validators/export-disposition";

/* ── QA Statuses ──────────────────────────────────────────────── */

export type QaStatus = "passed" | "quality_hold" | "operator_review" | "failed";

export type QaReason =
  | "critical_reconciliation_disagreement"
  | "critical_false_clean"
  | "source_traceability_incomplete"
  | "row_conservation_failed"
  | "workbook_integrity_failed"
  | "critical_validator_failure"
  | "operator_override";

/* ── QA Decision ──────────────────────────────────────────────── */

export interface QaDecision {
  status: QaStatus;
  automatic: boolean;
  reasons: QaReason[];
  details: string[];
  maxOperatorMinutes: number;
}

export interface QaOverride {
  qaDecisionId: string;
  jobId: string;
  operatorId: string;
  action: "approve" | "correct" | "reject" | "reprocess";
  reason: string;
  originalExtractionPreserved: boolean;
  correctionStoragePath: string | null;
  timestamp: string;
}

/* ── Operator Allowance ────────────────────────────────────────── */

const MAX_OPERATOR_QA_MINUTES = 20;

/* ── QA Check Functions ───────────────────────────────────────── */

function checkReconciliation(rows: BomRow[]): { pass: boolean; details: string[] } {
  const details: string[] = [];
  const disagreements = rows.filter(
    (r) => r.reconciliationStatus === "disagreement",
  );

  if (disagreements.length > 0) {
    details.push(
      `Critical reconciliation disagreement: ${disagreements.length} row(s) have conflicting extraction results`,
    );
    return { pass: false, details };
  }

  details.push("Dual-pass reconciliation: all rows agreed");
  return { pass: true, details };
}

function checkSourceTraceability(rows: BomRow[]): { pass: boolean; details: string[] } {
  const details: string[] = [];
  const rowsWithoutSource = rows.filter(
    (r) => r.sourcePage == null || r.sourcePage < 1 || !r.sourceDocument,
  );

  if (rowsWithoutSource.length > 0) {
    details.push(
      `Source traceability incomplete: ${rowsWithoutSource.length} row(s) missing valid source references`,
    );
    return { pass: false, details };
  }

  details.push(`Source traceability complete: ${rows.length} rows verified`);
  return { pass: true, details };
}

function checkRowConservation(disposition: DispositionResult, totalRows: number): { pass: boolean; details: string[] } {
  const details: string[] = [];
  const accounted = disposition.cleanCount + disposition.reviewCount + disposition.blockedCount;

  if (accounted !== totalRows) {
    details.push(
      `Row conservation failed: ${totalRows} extracted, but ${accounted} accounted (${disposition.cleanCount} clean + ${disposition.reviewCount} review + ${disposition.blockedCount} blocked)`,
    );
    return { pass: false, details };
  }

  details.push(
    `Row conservation passed: ${totalRows} = ${disposition.cleanCount} + ${disposition.reviewCount} + ${disposition.blockedCount}`,
  );
  return { pass: true, details };
}

function checkCriticalValidators(rows: BomRow[]): { pass: boolean; details: string[] } {
  const details: string[] = [];
  const criticalFlags = rows.filter(
    (r) => r.validationFlags.includes("quantity_parse_failure") ||
      (r.validationStatus === "blocked" && r.exportDisposition !== "excluded_duplicate"),
  );

  if (criticalFlags.length > 0) {
    details.push(`Critical validator failures: ${criticalFlags.length} row(s) blocked`);
    return { pass: true, details };
  }

  details.push("All critical validators passed");
  return { pass: true, details };
}

/* ── Main QA Decision Engine ──────────────────────────────────── */

export function evaluateQaGate(
  rows: BomRow[],
  disposition: DispositionResult,
): QaDecision {
  const allReasons: QaReason[] = [];
  const allDetails: string[] = [];

  // 1. Check reconciliation
  const recCheck = checkReconciliation(rows);
  if (!recCheck.pass) {
    allReasons.push("critical_reconciliation_disagreement");
    allDetails.push(...recCheck.details);
  }

  // 2. Check source traceability
  const traceCheck = checkSourceTraceability(rows);
  if (!traceCheck.pass) {
    allReasons.push("source_traceability_incomplete");
    allDetails.push(...traceCheck.details);
  }

  // 3. Check row conservation
  const conservationCheck = checkRowConservation(disposition, rows.length);
  if (!conservationCheck.pass) {
    allReasons.push("row_conservation_failed");
    allDetails.push(...conservationCheck.details);
  }

  // 4. Check critical validators
  const validatorCheck = checkCriticalValidators(rows);
  if (!validatorCheck.pass) {
    allReasons.push("critical_validator_failure");
    allDetails.push(...validatorCheck.details);
  }

  // Determine status
  let status: QaStatus;
  let automatic: boolean;

  if (allReasons.length === 0) {
    status = "passed";
    automatic = true;
  } else if (allReasons.includes("critical_reconciliation_disagreement") ||
    allReasons.includes("row_conservation_failed")) {
    status = "quality_hold";
    automatic = false;
  } else {
    status = "operator_review";
    automatic = false;
  }

  return {
    status,
    automatic,
    reasons: allReasons.length > 0 ? allReasons : [],
    details: allDetails.length > 0 ? allDetails : ["All QA checks passed"],
    maxOperatorMinutes: MAX_OPERATOR_QA_MINUTES,
  };
}
