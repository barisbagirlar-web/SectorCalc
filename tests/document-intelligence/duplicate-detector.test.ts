/**
 * Unit Tests: Duplicate Detection
 */
import { describe, it, expect } from "vitest";
import { detectDuplicates } from "@/lib/document-intelligence/validators/duplicate-detector";
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

describe("detectDuplicates", () => {
  it("returns no groups for unique rows", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC-123", sourceRow: 1 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "DEF-456", sourceRow: 2 }),
      makeRow({ itemNumber: 3, partNumberNormalized: "GHI-789", sourceRow: 3 }),
    ];
    const result = detectDuplicates(rows);
    expect(result.groups).toHaveLength(0);
  });

  it("detects exact normalized duplicates", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC-123", descriptionNormalized: "Bearing" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "ABC-123", descriptionNormalized: "Bearing" }),
    ];
    const result = detectDuplicates(rows);
    expect(result.groups.length).toBeGreaterThan(0);
    expect(result.groups[0].duplicateType).toBe("exact_normalized");
    expect(result.groups[0].autoMergeAllowed).toBe(true);
  });

  it("detects conflicting descriptions", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC-123", descriptionNormalized: "Bearing" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "ABC-123", descriptionNormalized: "Shaft" }),
    ];
    const result = detectDuplicates(rows);
    const conflict = result.groups.find((g) => g.duplicateType === "conflicting_description");
    expect(conflict).toBeDefined();
    expect(conflict!.autoMergeAllowed).toBe(false);
  });

  it("detects conflicting revisions", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC-123", revision: "A" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "ABC-123", revision: "B" }),
    ];
    const result = detectDuplicates(rows);
    const conflict = result.groups.find((g) => g.duplicateType === "conflicting_revision");
    expect(conflict).toBeDefined();
    expect(conflict!.severity).toBe("critical");
  });

  it("detects conflicting manufacturers", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC-123", manufacturer: "SKF" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "ABC-123", manufacturer: "FAG" }),
    ];
    const result = detectDuplicates(rows);
    const conflict = result.groups.find((g) => g.duplicateType === "conflicting_manufacturer");
    expect(conflict).toBeDefined();
  });

  it("detects duplicate source row extractions", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC-123", sourcePage: 3, sourceTable: "t1", sourceRow: 5 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "ABC-123", sourcePage: 3, sourceTable: "t1", sourceRow: 5 }),
    ];
    const result = detectDuplicates(rows);
    expect(result.consolidatedRowIndices).toContain(1);
  });
});
