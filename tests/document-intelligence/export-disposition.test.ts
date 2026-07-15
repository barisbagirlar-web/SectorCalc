/**
 * Unit Tests: Export Disposition
 */
import { describe, it, expect } from "vitest";
import { determineExportDisposition } from "@/lib/document-intelligence/validators/export-disposition";
import { detectDuplicates } from "@/lib/document-intelligence/validators/duplicate-detector";
import { detectMissingFields } from "@/lib/document-intelligence/validators/missing-field-detector";
import type { BomRow } from "@/types/document-intelligence";

function makeRow(overrides: Partial<BomRow> & { itemNumber: number }): BomRow {
  return {
    partNumberRaw: null,
    partNumberNormalized: null,
    descriptionRaw: null,
    descriptionNormalized: null,
    quantity: 1,
    unit: "each",
    material: null,
    manufacturer: null,
    manufacturerPartNumber: null,
    revision: null,
    equipment: null,
    subassembly: null,
    parentItemNumber: null,
    parentPartNumber: null,
    hierarchyLevel: null,
    hierarchyPath: null,
    hierarchyEvidence: null,
    extractionPass: null,
    reconciliationStatus: null,
    procurementStatus: null,
    reviewNote: null,
    quantityRaw: null,
    quantityParseStatus: null,
    unitRaw: null,
    unitNormalized: null,
    manufacturerRaw: null,
    manufacturerNormalized: null,
    manufacturerPartNumberRaw: null,
    manufacturerPartNumberNormalized: null,
    descriptionRawFull: null,
    sourceDocument: "test.pdf",
    sourcePage: 1,
    sourceTable: "table1",
    sourceRow: 1,
    confidence: 1,
    validationStatus: "clean",
    validationFlags: [],
    reviewRequired: false,
    exportDisposition: "clean",
    ...overrides,
  };
}

describe("determineExportDisposition", () => {
  it("marks complete rows as clean", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC", descriptionNormalized: "Part", quantity: 5 }),
    ];
    const mf = detectMissingFields(rows);
    const dup = detectDuplicates(rows);
    const result = determineExportDisposition(rows, mf, dup);
    expect(result.cleanCount).toBe(1);
    expect(result.rows[0].disposition).toBe("clean");
  });

  it("marks rows with missing part number as review_required", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "", descriptionNormalized: "Part", quantity: 5 }),
    ];
    const mf = detectMissingFields(rows);
    const dup = detectDuplicates(rows);
    const result = determineExportDisposition(rows, mf, dup);
    expect(result.rows[0].disposition).toBe("review_required");
    expect(result.rows[0].status).toBe("blocked");
  });

  it("marks low-confidence rows as review_required", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC", descriptionNormalized: "Part", quantity: 5, confidence: 0.5 }),
    ];
    const mf = detectMissingFields(rows);
    const dup = detectDuplicates(rows);
    const result = determineExportDisposition(rows, mf, dup);
    expect(result.rows[0].disposition).toBe("review_required");
    expect(result.reviewCount).toBe(1);
  });

  it("marks consolidated duplicates as excluded", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC", descriptionNormalized: "Same", sourceRow: 1 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "ABC", descriptionNormalized: "Same", sourceRow: 1 }),
    ];
    const mf = detectMissingFields(rows);
    const dup = detectDuplicates(rows);
    const result = determineExportDisposition(rows, mf, dup);
    const excluded = result.rows.filter((r) => r.disposition === "excluded_duplicate");
    expect(excluded.length).toBeGreaterThan(0);
  });

  it("conserves total row count: clean + review + excluded = total", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC", descriptionNormalized: "Good Part", quantity: 5 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "", descriptionNormalized: "Bad Part", quantity: 2 }),
      makeRow({ itemNumber: 3, partNumberNormalized: "DEF", descriptionNormalized: "Low Conf", quantity: 3, confidence: 0.3 }),
    ];
    const mf = detectMissingFields(rows);
    const dup = detectDuplicates(rows);
    const result = determineExportDisposition(rows, mf, dup);
    expect(result.cleanCount + result.reviewCount + result.blockedCount).toBe(rows.length);
  });
});
