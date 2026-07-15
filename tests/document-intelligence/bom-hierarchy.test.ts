/**
 * Unit Tests: BOM Hierarchy Detection (Section 60)
 */
import { describe, it, expect } from "vitest";
import { detectBomHierarchy } from "@/lib/document-intelligence/validators/bom-hierarchy";
import type { BomRow } from "@/types/document-intelligence";

function createRow(overrides: Partial<BomRow> & { itemNumber: number }): BomRow {
  return {
    partNumberRaw: null,
    partNumberNormalized: overrides.partNumberNormalized ?? null,
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
    parentItemNumber: overrides.parentItemNumber ?? null,
    parentPartNumber: overrides.parentPartNumber ?? null,
    hierarchyLevel: null,
    hierarchyPath: null,
    hierarchyEvidence: overrides.hierarchyEvidence ?? null,
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
    sourcePage: overrides.sourcePage ?? 1,
    sourceTable: "0",
    sourceRow: overrides.sourceRow ?? 0,
    confidence: 1.0,
    validationStatus: "clean",
    validationFlags: [],
    reviewRequired: false,
    exportDisposition: "clean",
    ...overrides,
  };
}

describe("BOM Hierarchy Detection", () => {
  it("flat document returns no hierarchy", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A-001" }),
      createRow({ itemNumber: 2, partNumberNormalized: "B-002" }),
      createRow({ itemNumber: 3, partNumberNormalized: "C-003" }),
    ];
    const result = detectBomHierarchy(rows);
    expect(result.hasHierarchy).toBe(false);
    expect(result.exceptions).toHaveLength(0);
  });

  it("detects hierarchy from explicit parent references", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "PUMP-001", hierarchyEvidence: "section_heading" }),
      createRow({ itemNumber: 2, partNumberNormalized: "IMP-001", parentPartNumber: "PUMP-001" }),
      createRow({ itemNumber: 3, partNumberNormalized: "SEAL-001", parentPartNumber: "PUMP-001" }),
    ];
    const result = detectBomHierarchy(rows);
    expect(result.hasHierarchy).toBe(true);
  });

  it("detects unresolved parent reference", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A-001" }),
      createRow({
        itemNumber: 2,
        partNumberNormalized: "B-001",
        parentPartNumber: "NONEXISTENT-PARENT",
        parentItemNumber: 99,
      }),
    ];
    const result = detectBomHierarchy(rows);
    const unresolved = result.exceptions.filter((e) => e.type === "unresolved_parent");
    expect(unresolved.length).toBeGreaterThanOrEqual(1);
  });

  it("detects circular hierarchy", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", parentItemNumber: 3 }),
      createRow({ itemNumber: 2, partNumberNormalized: "B", parentItemNumber: 1 }),
      createRow({ itemNumber: 3, partNumberNormalized: "C", parentItemNumber: 2 }),
    ];
    const result = detectBomHierarchy(rows);
    const circular = result.exceptions.filter((e) => e.type === "circular_hierarchy");
    expect(circular.length).toBeGreaterThanOrEqual(1);
  });

  it("detects orphan subassembly when no equipment present", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        subassembly: "Sub-Assembly X",
        equipment: null,
      }),
    ];
    const result = detectBomHierarchy(rows);
    const orphan = result.exceptions.filter((e) => e.type === "orphan_subassembly");
    expect(orphan.length).toBeGreaterThanOrEqual(1);
  });

  it("does not flag orphan subassembly when equipment exists", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        subassembly: "Sub-Assembly X",
        equipment: "Main Equipment",
      }),
    ];
    const result = detectBomHierarchy(rows);
    const orphan = result.exceptions.filter((e) => e.type === "orphan_subassembly");
    expect(orphan).toHaveLength(0);
  });

  it("reports hierarchy metrics correctly for section headings", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "PUMP", hierarchyEvidence: "section_heading", sourceRow: 0 }),
      createRow({ itemNumber: 2, partNumberNormalized: "SEAL", sourceRow: 1 }),
      createRow({ itemNumber: 3, partNumberNormalized: "BEARING", sourceRow: 2 }),
      createRow({ itemNumber: 4, partNumberNormalized: "MOTOR", hierarchyEvidence: "section_heading", sourceRow: 3 }),
      createRow({ itemNumber: 5, partNumberNormalized: "FAN", sourceRow: 4 }),
    ];
    const result = detectBomHierarchy(rows);
    expect(result.hasHierarchy).toBe(true);
    expect(result.exceptions).toHaveLength(0);
    // Rows following a section heading should have parent info
    const sealRow = result.rows[1];
    expect(sealRow.parentPartNumber).toBe("PUMP");
    expect(sealRow.hierarchyLevel).toBe(1);
  });
});
