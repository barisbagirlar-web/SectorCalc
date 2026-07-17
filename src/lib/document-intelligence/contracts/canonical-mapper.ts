/**
 * Canonical Mapper — ExtractionResult → BomRow[]
 *
 * Maps the provider-agnostic extraction output into the canonical BOM row schema.
 * Every extraction provider goes through this mapper so downstream validators
 * and generators always see the same schema.
 *
 * Edge cases handled:
 *  - Missing columns → null (not empty string, not zero)
 *  - Unparseable quantity → null + low-confidence warning
 *  - Negative/null/NaN quantity after parse → null + review flag
 *  - Empty string raw values → null
 */

import type { BomRow, ValidationStatus, ExportDisposition } from "@/types/document-intelligence";
import type { ExtractionResult, ExtractedRow } from "./provider-interfaces";

/* ── Column key constants ──────────────────────────────────────── */

const COL_ITEM = "item";
const COL_PART_NUMBER = "part_number";
const COL_DESCRIPTION = "description";
const COL_QUANTITY = "quantity";
const COL_UNIT = "unit";
const COL_MATERIAL = "material";
const COL_MANUFACTURER = "manufacturer";
const COL_MANUFACTURER_PART_NUMBER = "manufacturer_part_number";
const COL_REVISION = "revision";
const COL_EQUIPMENT = "equipment";
const COL_SUBASSEMBLY = "subassembly";
const COL_PARENT_ITEM = "parent_item_number";
const COL_PARENT_PART = "parent_part_number";
const COL_HIERARCHY_EVIDENCE = "hierarchy_evidence";

/* ── Helpers ───────────────────────────────────────────────────── */

function nullIfEmpty(value: string | null | undefined): string | null {
  if (value == null) return null;
  if (value.trim().length === 0) return null;
  return value.trim();
}

function parseQuantity(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return null;
  if (parsed < 0) return null;

  return parsed;
}

/**
 * Pull the raw value from a row's cell map by column key.
 * Returns null when the column is entirely absent from the row.
 */
function getCellValue(row: ExtractedRow, colKey: string): string | null {
  const cell = row.cells[colKey];
  if (!cell) return null;
  return cell.rawValue;
}

/**
 * Compute row-level confidence as the minimum confidence across
 * all non-null cells. When no cells exist, returns 0.
 */
function rowConfidence(row: ExtractedRow): number {
  const cellEntries = Object.values(row.cells);
  if (cellEntries.length === 0) return 0;

  let min = 1.0;
  for (const cell of cellEntries) {
    if (cell.confidence < min) min = cell.confidence;
  }
  return min;
}

/**
 * Determine whether a row requires manual review based on
 * cell-level confidence thresholds.
 */
function requiresReview(row: ExtractedRow, quantity: number | null, parseFailed: boolean): boolean {
  // Low-confidence cells
  for (const cell of Object.values(row.cells)) {
    if (cell.confidence < 0.5) return true;
  }

  // Unparseable quantity — raw value exists but parse produced null
  if (quantity == null && getCellValue(row, COL_QUANTITY) != null && parseFailed) return true;

  return false;
}

/* ── Public API ────────────────────────────────────────────────── */

/**
 * Map a provider-agnostic ExtractionResult into the canonical BomRow[].
 *
 * @param result          The provider extraction output.
 * @param sourceDocument  Source filename or document identifier.
 * @returns               Canonical BOM rows — never rejects.
 */
export function mapExtractionToCanonicalRows(
  result: ExtractionResult,
  sourceDocument: string,
): BomRow[] {
  const rows: BomRow[] = [];

  for (const extracted of result.rows) {
    const itemStr = getCellValue(extracted, COL_ITEM);
    const itemNumber = itemStr != null ? Number(itemStr) : extracted.rowIndex + 1;

    const partNumberRaw = nullIfEmpty(getCellValue(extracted, COL_PART_NUMBER));
    const descriptionRaw = nullIfEmpty(getCellValue(extracted, COL_DESCRIPTION));

    const quantityRaw = getCellValue(extracted, COL_QUANTITY);
    let parseFailed = false;
    const quantity = (() => {
      const q = parseQuantity(quantityRaw);
      if (quantityRaw != null && q == null) {
        parseFailed = true;
      }
      return q;
    })();

    const unit = nullIfEmpty(getCellValue(extracted, COL_UNIT));
    const material = nullIfEmpty(getCellValue(extracted, COL_MATERIAL));
    const manufacturer = nullIfEmpty(getCellValue(extracted, COL_MANUFACTURER));
    const manufacturerPartNumber = nullIfEmpty(
      getCellValue(extracted, COL_MANUFACTURER_PART_NUMBER),
    );
    const revision = nullIfEmpty(getCellValue(extracted, COL_REVISION));
    const equipment = nullIfEmpty(getCellValue(extracted, COL_EQUIPMENT));
    const subassembly = nullIfEmpty(getCellValue(extracted, COL_SUBASSEMBLY));
    const parentItemStr = getCellValue(extracted, COL_PARENT_ITEM);
    const parentItemNumber = parentItemStr != null ? Number(parentItemStr) : null;
    const parentPartNumber = nullIfEmpty(getCellValue(extracted, COL_PARENT_PART));
    const hierarchyEvidence = nullIfEmpty(getCellValue(extracted, COL_HIERARCHY_EVIDENCE));

    const confidence = rowConfidence(extracted);
    const reviewReq = requiresReview(extracted, quantity, parseFailed);

    const validationFlags: string[] = [];
    if (parseFailed) validationFlags.push("quantity_parse_failure");

    const validationStatus: ValidationStatus = reviewReq
      ? "review_required"
      : "clean";

    const exportDisposition: ExportDisposition = reviewReq
      ? "review_required"
      : "clean";

    rows.push({
      itemNumber: Math.floor(itemNumber),
      partNumberRaw,
      partNumberNormalized: null,
      descriptionRaw,
      descriptionNormalized: null,
      quantity,
      unit,
      material,
      manufacturer,
      manufacturerPartNumber,
      revision,
      equipment,
      subassembly,
      // Hierarchy
      parentItemNumber: Number.isFinite(parentItemNumber ?? NaN) ? parentItemNumber : null,
      parentPartNumber,
      hierarchyLevel: null,
      hierarchyPath: null,
      hierarchyEvidence,
      // Dual-pass reconciliation
      extractionPass: null,
      reconciliationStatus: null,
      // Procurement readiness
      procurementStatus: null,
      reviewNote: null,
      // Quantity/Unit integrity
      quantityRaw: getCellValue(extracted, COL_QUANTITY),
      quantityParseStatus: parseFailed ? "invalid" : quantity != null ? "valid" : "missing",
      unitRaw: getCellValue(extracted, COL_UNIT),
      unitNormalized: unit,
      // Manufacturer integrity
      manufacturerRaw: getCellValue(extracted, COL_MANUFACTURER),
      manufacturerNormalized: manufacturer,
      manufacturerPartNumberRaw: getCellValue(extracted, COL_MANUFACTURER_PART_NUMBER),
      manufacturerPartNumberNormalized: manufacturerPartNumber,
      descriptionRawFull: descriptionRaw,
      sourceDocument,
      sourcePage: extracted.page,
      sourceTable: String(extracted.tableIndex),
      sourceRow: extracted.rowIndex,
      confidence,
      validationStatus,
      validationFlags,
      reviewRequired: reviewReq,
      exportDisposition,
    });
  }

  return rows;
}
