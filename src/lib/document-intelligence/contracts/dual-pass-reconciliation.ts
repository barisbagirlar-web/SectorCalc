/**
 * Dual-Pass Extraction & Reconciliation (Section 59)
 *
 * Implements a quality architecture that does not rely on a single extraction pass.
 *
 * Pass A — Layout/Table Pass: detects pages, tables, cells/rows, preserves coordinates.
 * Pass B — Semantic BOM Pass: classifies candidate fields, maps headers to canonical schema.
 *
 * Critical-field reconciliation:
 *  - part number, quantity, revision, source page, parent/subassembly reference
 *
 * A critical field enters Clean BOM only when:
 *  - both passes agree; OR
 *  - a deterministic normalization rule explains the difference; AND
 *  - source evidence is valid; AND
 *  - no blocking validator applies.
 */

import type { BomRow, ReconciliationStatus } from "@/types/document-intelligence";
import type { ExtractionResult } from "./provider-interfaces";
import { normalizePartNumber } from "@/lib/document-intelligence/validators/part-normalizer";

/* ── Critical Field Reconciliation Types ──────────────────────── */

export interface ReconciliationField {
  partNumber: string | null;
  quantity: number | null;
  revision: string | null;
  sourcePage: number;
  parentReference: string | null;
}

export interface DualPassResult {
  rows: BomRow[];
  reconciliation: ReconciliationEntry[];
  passAMetrics: { rowCount: number; tablesFound: number };
  passBMetrics: { rowCount: number; tablesFound: number };
}

export interface ReconciliationEntry {
  rowIndex: number;
  partNumber: ReconciliationField;
  passA: ReconciliationField;
  passB: ReconciliationField;
  status: ReconciliationStatus;
  notes: string[];
}

/* ── Mock Pass A Provider (Layout/Table Pass) ─────────────────── */

export function extractPassA(result: ExtractionResult): ExtractionResult {
  // Pass A: pure layout/table extraction — returns raw table structure
  // In production this would use a different provider or extraction strategy
  // For now we return the result as-is (the "layout" pass)
  return result;
}

/* ── Mock Pass B Provider (Semantic BOM Pass) ─────────────────── */

export function extractPassB(result: ExtractionResult): ExtractionResult {
  // Pass B: semantic/classification pass — may identify additional fields
  // In production this would use a different provider or model
  // For now we apply additional normalization as pass B
  const passB: ExtractionResult = {
    metadata: { ...result.metadata },
    tables: result.tables.map((t) => ({
      ...t,
      detectedColumns: [...t.detectedColumns, "hierarchy_evidence"],
    })),
    rows: result.rows.map((row) => {
      const cells = { ...row.cells };
      // Add hierarchy evidence cell (simulated)
      cells["hierarchy_evidence"] = {
        page: row.page,
        tableIndex: row.tableIndex,
        rowIndex: row.rowIndex,
        columnIndex: Object.keys(cells).length,
        rawValue: "section_heading",
        confidence: 0.85,
      };
      return { ...row, cells };
    }),
    processingMetrics: {
      ...result.processingMetrics,
      provider: `${result.processingMetrics.provider}-pass-b`,
      durationMs: result.processingMetrics.durationMs + 500,
    },
  };
  return passB;
}

/* ── Reconciliation Engine ────────────────────────────────────── */

function extractField(row: BomRow): ReconciliationField {
  return {
    partNumber: row.partNumberNormalized ?? row.partNumberRaw,
    quantity: row.quantity,
    revision: row.revision,
    sourcePage: row.sourcePage,
    parentReference: row.parentPartNumber,
  };
}

function normalizeAgreement(
  a: string | null,
  b: string | null,
): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  const normA = normalizePartNumber(a);
  const normB = normalizePartNumber(b);
  return normA.comparisonKey === normB.comparisonKey;
}

function reconcileField(
  rowIndex: number,
  passARow: BomRow,
  passBRow: BomRow | null,
): ReconciliationEntry {
  const fieldA = extractField(passARow);

  const notes: string[] = [];

  if (!passBRow) {
    return {
      rowIndex,
      partNumber: fieldA,
      passA: fieldA,
      passB: { partNumber: null, quantity: null, revision: null, sourcePage: 0, parentReference: null },
      status: "missing_in_pass_b",
      notes: ["Row missing in Pass B extraction"],
    };
  }

  const fieldB = extractField(passBRow);

  // Check exact agreement
  const pnExact = fieldA.partNumber === fieldB.partNumber;
  const qtyExact = fieldA.quantity === fieldB.quantity;
  const revExact = fieldA.revision === fieldB.revision;
  const pageExact = fieldA.sourcePage === fieldB.sourcePage;

  if (pnExact && qtyExact && revExact && pageExact) {
    return {
      rowIndex,
      partNumber: fieldA,
      passA: fieldA,
      passB: fieldB,
      status: "agreed",
      notes: [],
    };
  }

  // Check normalized agreement
  const pnNorm = !pnExact && fieldA.partNumber != null && fieldB.partNumber != null
    ? normalizeAgreement(fieldA.partNumber, fieldB.partNumber)
    : false;

  if (pnNorm && qtyExact && revExact) {
    notes.push("Part numbers agree after normalization");
    return {
      rowIndex,
      partNumber: fieldA,
      passA: fieldA,
      passB: fieldB,
      status: "normalized_agreement",
      notes,
    };
  }

  // Disagreement
  if (!pnExact && !pnNorm) {
    notes.push(`Part number conflict: "${fieldA.partNumber}" vs "${fieldB.partNumber}"`);
  }
  if (!qtyExact) {
    notes.push(`Quantity conflict: "${fieldA.quantity}" vs "${fieldB.quantity}"`);
  }
  if (!revExact) {
    notes.push(`Revision conflict: "${fieldA.revision}" vs "${fieldB.revision}"`);
  }
  if (!pageExact) {
    notes.push(`Source page conflict: "${fieldA.sourcePage}" vs "${fieldB.sourcePage}"`);
  }

  return {
    rowIndex,
    partNumber: fieldA,
    passA: fieldA,
    passB: fieldB,
    status: "disagreement",
    notes,
  };
}

/* ── Main Reconciliation Function ─────────────────────────────── */

export function reconcileDualPass(
  rowsA: BomRow[],
  rowsB: BomRow[],
): DualPassResult {
  // Build pass B lookup by source position
  const passBMap = new Map<string, BomRow>();
  for (const row of rowsB) {
    const key = `${row.sourcePage}|${row.sourceTable}|${row.sourceRow}`;
    if (!passBMap.has(key)) {
      passBMap.set(key, row);
    }
  }

  const reconciliation: ReconciliationEntry[] = [];
  const reconciledRows: BomRow[] = [];

  for (let i = 0; i < rowsA.length; i++) {
    const rowA = rowsA[i];
    const key = `${rowA.sourcePage}|${rowA.sourceTable}|${rowA.sourceRow}`;
    const rowB = passBMap.get(key) ?? null;

    const entry = reconcileField(i, rowA, rowB);
    reconciliation.push(entry);

    // Determine extraction pass and reconciliation status
    const extractionPass: "pass_a" | "both" = rowB ? "both" : "pass_a";
    const recStatus = entry.status;

    // Merge rows: prefer pass A values, but use pass B where pass A has gaps
    const merged: BomRow = {
      ...rowA,
      extractionPass,
      reconciliationStatus: recStatus,
      // If pass A missing part number but pass B has it, use pass B
      partNumberRaw: rowA.partNumberRaw ?? (rowB?.partNumberRaw ?? null),
      partNumberNormalized: rowA.partNumberNormalized ?? (rowB?.partNumberNormalized ?? null),
      descriptionRaw: rowA.descriptionRaw ?? (rowB?.descriptionRaw ?? null),
      descriptionNormalized: rowA.descriptionNormalized ?? (rowB?.descriptionNormalized ?? null),
      quantity: rowA.quantity ?? (rowB?.quantity ?? null),
      unit: rowA.unit ?? (rowB?.unit ?? null),
      revision: rowA.revision ?? (rowB?.revision ?? null),
      parentPartNumber: rowA.parentPartNumber ?? (rowB?.parentPartNumber ?? null),
      hierarchyEvidence: rowA.hierarchyEvidence ?? (rowB?.hierarchyEvidence ?? null),
      // Confidence: min of both passes
      confidence: rowB
        ? Math.min(rowA.confidence, rowB.confidence)
        : rowA.confidence,
      // If disagreement, force review
      reviewRequired: rowA.reviewRequired || (recStatus === "disagreement"),
      exportDisposition: (recStatus === "disagreement")
        ? "review_required"
        : rowA.exportDisposition,
    };

    reconciledRows.push(merged);
  }

  // Add rows only in pass B
  for (const rowB of rowsB) {
    const key = `${rowB.sourcePage}|${rowB.sourceTable}|${rowB.sourceRow}`;
    if (!rowsA.some(
      (r) => r.sourcePage === rowB.sourcePage &&
        r.sourceTable === rowB.sourceTable &&
        r.sourceRow === rowB.sourceRow,
    )) {
      reconciliation.push({
        rowIndex: reconciledRows.length,
        partNumber: extractField(rowB),
        passA: { partNumber: null, quantity: null, revision: null, sourcePage: 0, parentReference: null },
        passB: extractField(rowB),
        status: "missing_in_pass_a",
        notes: ["Row found only in Pass B (semantic extraction)"],
      });
      reconciledRows.push({
        ...rowB,
        extractionPass: "pass_b",
        reconciliationStatus: "missing_in_pass_a",
      });
    }
  }

  return {
    rows: reconciledRows,
    reconciliation,
    passAMetrics: {
      rowCount: rowsA.length,
      tablesFound: countUniqueTables(rowsA),
    },
    passBMetrics: {
      rowCount: rowsB.length,
      tablesFound: countUniqueTables(rowsB),
    },
  };
}

function countUniqueTables(rows: BomRow[]): number {
  const tables = new Set(rows.map((r) => `${r.sourcePage}|${r.sourceTable}`));
  return tables.size;
}
