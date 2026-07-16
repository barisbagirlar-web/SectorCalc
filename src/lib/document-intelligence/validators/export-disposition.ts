/**
 * Export Disposition Engine — Determines which rows go to Clean BOM
 * vs Review Required vs excluded.
 *
 * Rules:
 * - Missing part number, description, or valid quantity → blocked from clean export
 * - Low confidence (< 0.7) → review required
 * - Any review flag → review required
 * - Duplicate source rows (consolidated) → excluded
 */

import type { BomRow, ExportDisposition, ValidationStatus } from "@/types/document-intelligence";
import type { MissingFieldException } from "@/types/document-intelligence";
import type { DuplicateDetectionResult } from "./duplicate-detector";

export interface DispositionResult {
  rows: DispositionRow[];
  cleanCount: number;
  reviewCount: number;
  blockedCount: number;
}

export interface DispositionRow {
  row: BomRow;
  status: ValidationStatus;
  disposition: ExportDisposition;
  reasons: string[];
}

export function determineExportDisposition(
  rows: BomRow[],
  missingFields: MissingFieldException[],
  duplicateResult: DuplicateDetectionResult
): DispositionResult {
  const consolidatedSet = new Set(duplicateResult.consolidatedRowIndices);

  // Build per-row blocking reasons
  const blockingReasons: Map<number, string[]> = new Map();
  const reviewReasons: Map<number, string[]> = new Map();

  for (const ex of missingFields) {
    if (ex.exportBlocking) {
      if (!blockingReasons.has(ex.rowIndex)) blockingReasons.set(ex.rowIndex, []);
      blockingReasons.get(ex.rowIndex)!.push(`Missing required field: ${ex.type}`);
    } else {
      if (!reviewReasons.has(ex.rowIndex)) reviewReasons.set(ex.rowIndex, []);
      reviewReasons.get(ex.rowIndex)!.push(`Missing optional field: ${ex.type}`);
    }
  }

  // Low confidence → review
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].confidence < 0.7 && rows[i].confidence >= 0) {
      if (!reviewReasons.has(i)) reviewReasons.set(i, []);
      reviewReasons.get(i)!.push("Low confidence extraction");
    }
  }

  const result: DispositionRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Excluded: consolidated duplicate
    if (consolidatedSet.has(i)) {
      result.push({
        row,
        status: "blocked",
        disposition: "excluded_duplicate",
        reasons: ["Duplicate source row — consolidated"],
      });
      continue;
    }

    const blocking = blockingReasons.get(i) ?? [];
    if (blocking.length > 0) {
      result.push({
        row,
        status: "blocked",
        disposition: "review_required",
        reasons: blocking,
      });
      continue;
    }

    const reviews = reviewReasons.get(i) ?? [];
    if (reviews.length > 0 || row.reviewRequired) {
      result.push({
        row,
        status: "review_required",
        disposition: "review_required",
        reasons: [...reviews, ...(row.reviewRequired ? ["User-flagged review"] : [])],
      });
      continue;
    }

    // Clean
    result.push({
      row,
      status: "clean",
      disposition: "clean",
      reasons: [],
    });
  }

  return {
    rows: result,
    cleanCount: result.filter((r) => r.disposition === "clean").length,
    reviewCount: result.filter((r) => r.disposition === "review_required").length,
    blockedCount: result.filter((r) => r.disposition === "excluded_duplicate").length,
  };
}
