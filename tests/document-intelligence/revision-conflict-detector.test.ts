/**
 * Unit Tests: Revision Conflict Detection
 */
import { describe, it, expect } from "vitest";
import { detectRevisionConflicts } from "@/lib/document-intelligence/validators/revision-conflict-detector";
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

describe("detectRevisionConflicts", () => {
  it("returns no conflicts for unique part numbers", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "A1", revision: "A" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "B2", revision: "B" }),
    ];
    expect(detectRevisionConflicts(rows)).toHaveLength(0);
  });

  it("detects multiple revisions for same part number", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "A1", revision: "A", sourcePage: 5 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "A1", revision: "B", sourcePage: 10 }),
    ];
    const conflicts = detectRevisionConflicts(rows);
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].conflictType).toBe("multiple_revisions");
    expect(conflicts[0].observedRevisions).toEqual(expect.arrayContaining(["A", "B"]));
  });

  it("detects partial missing revision", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "A1", revision: "A" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "A1", revision: "" }),
    ];
    const conflicts = detectRevisionConflicts(rows);
    const partial = conflicts.find((c) => c.conflictType === "partial_missing_revision");
    expect(partial).toBeDefined();
    expect(partial!.reviewRequired).toBe(true);
  });

  it("marks conflicts as review required", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "A1", revision: "1" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "A1", revision: "2" }),
    ];
    const conflicts = detectRevisionConflicts(rows);
    expect(conflicts.every((c) => c.reviewRequired)).toBe(true);
  });
});
