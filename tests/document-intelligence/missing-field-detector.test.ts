/**
 * Unit Tests: Missing Field Detection
 */
import { describe, it, expect } from "vitest";
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

describe("detectMissingFields", () => {
  it("flags missing part number as export-blocking", () => {
    const rows = [makeRow({ itemNumber: 1, partNumberNormalized: "" })];
    const ex = detectMissingFields(rows);
    expect(ex.some((e) => e.type === "missing_part_number" && e.exportBlocking)).toBe(true);
  });

  it("flags missing description as export-blocking", () => {
    const rows = [makeRow({ itemNumber: 1, descriptionNormalized: "" })];
    const ex = detectMissingFields(rows);
    expect(ex.some((e) => e.type === "missing_description" && e.exportBlocking)).toBe(true);
  });

  it("flags missing quantity as export-blocking", () => {
    const rows = [makeRow({ itemNumber: 1, quantity: null })];
    const ex = detectMissingFields(rows);
    expect(ex.some((e) => e.type === "missing_quantity" && e.exportBlocking)).toBe(true);
  });

  it("flags invalid quantity as export-blocking", () => {
    const rows = [makeRow({ itemNumber: 1, quantity: -1 })];
    const ex = detectMissingFields(rows);
    expect(ex.some((e) => e.type === "invalid_quantity" && e.exportBlocking)).toBe(true);
  });

  it("returns no exceptions for complete rows", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC", descriptionNormalized: "Part", quantity: 5 }),
    ];
    const ex = detectMissingFields(rows);
    expect(ex.length).toBe(0);
  });

  it("does not flag missing material as export-blocking", () => {
    // Add a row with material so the detector checks other rows
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "STEEL", descriptionNormalized: "Steel Plate", material: "Steel" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "ABC", descriptionNormalized: "Part", material: "" }),
    ];
    const ex = detectMissingFields(rows);
    const matEx = ex.find((e) => e.type === "missing_material");
    expect(matEx).toBeDefined();
    expect(matEx!.exportBlocking).toBe(false);
  });

  it("flags missing revision when other rows have revisions", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "A1", descriptionNormalized: "Part", revision: "A" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "B2", descriptionNormalized: "Part 2", revision: "" }),
    ];
    const ex = detectMissingFields(rows);
    expect(ex.some((e) => e.type === "missing_revision")).toBe(true);
  });
});
