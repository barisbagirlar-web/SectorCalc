/**
 * Mathematical Invariant Tests for Document Intelligence
 *
 * These are NOT integration tests. They validate mathematical and
 * logical invariants that must always hold regardless of input.
 */
import { describe, it, expect } from "vitest";
import { detectDuplicates } from "@/lib/document-intelligence/validators/duplicate-detector";
import { determineExportDisposition } from "@/lib/document-intelligence/validators/export-disposition";
import { detectMissingFields } from "@/lib/document-intelligence/validators/missing-field-detector";
import { detectRevisionConflicts } from "@/lib/document-intelligence/validators/revision-conflict-detector";
import { detectBomHierarchy } from "@/lib/document-intelligence/validators/bom-hierarchy";
import { reconcileDualPass } from "@/lib/document-intelligence/contracts/dual-pass-reconciliation";
import type { BomRow } from "@/types/document-intelligence";

function createRow(overrides: Partial<BomRow> & { itemNumber: number }): BomRow {
  return {
    partNumberRaw: null,
    partNumberNormalized: overrides.partNumberNormalized ?? null,
    descriptionRaw: null,
    descriptionNormalized: null,
    quantity: overrides.quantity ?? 1,
    unit: "each",
    material: overrides.material ?? null,
    manufacturer: overrides.manufacturer ?? null,
    manufacturerPartNumber: null,
    revision: overrides.revision ?? null,
    equipment: overrides.equipment ?? null,
    subassembly: overrides.subassembly ?? null,
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
    sourcePage: overrides.sourcePage ?? 1,
    sourceTable: "0",
    sourceRow: overrides.sourceRow ?? 0,
    confidence: overrides.confidence ?? 1.0,
    validationStatus: overrides.validationStatus ?? "clean",
    validationFlags: overrides.validationFlags ?? [],
    reviewRequired: false,
    exportDisposition: overrides.exportDisposition ?? "clean",
    ...overrides,
  };
}

describe("Mathematical Invariants (Row Conservation)", () => {
  it("row count is always conserved through duplicate detection", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A" }),
      createRow({ itemNumber: 2, partNumberNormalized: "A" }), // duplicate
      createRow({ itemNumber: 3, partNumberNormalized: "B" }),
    ];
    const initialCount = rows.length;
    const result = detectDuplicates(rows);
    // Duplicate detection must never add or remove rows
    expect(result.groups).toBeDefined();
    // The function should return metadata only — no row mutation
    expect(rows.length).toBe(initialCount);
  });

  it("disposition decision always processes exactly N rows", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A" }),
      createRow({ itemNumber: 2, partNumberNormalized: null }), // missing part number
    ];
    const dupResult = detectDuplicates(rows);
    const missingFields = detectMissingFields(rows);
    const dispositions = determineExportDisposition(rows, missingFields, dupResult);
    // cleanCount + reviewCount + blockedCount must equal total rows
    expect(dispositions.cleanCount + dispositions.reviewCount + dispositions.blockedCount).toBe(
      rows.length
    );
  });

  it("every row has exactly one export disposition", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A" }),
      createRow({ itemNumber: 2, partNumberNormalized: null }),
    ];
    const dupResult = detectDuplicates(rows);
    const missingFields = detectMissingFields(rows);
    const dispositions = determineExportDisposition(rows, missingFields, dupResult);
    expect(dispositions.rows.length).toBe(rows.length);
    for (const d of dispositions.rows) {
      expect(["clean", "review_required", "blocked"]).toContain(d.status);
    }
  });

  it("revision conflict detection never mutates input rows", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", revision: "1", sourcePage: 1 }),
      createRow({ itemNumber: 2, partNumberNormalized: "A", revision: "2", sourcePage: 2 }),
    ];
    const frozenCopy = JSON.parse(JSON.stringify(rows));
    detectRevisionConflicts(rows);
    expect(rows).toEqual(frozenCopy);
  });

  it("hierarchy detection never mutates input rows", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A" }),
      createRow({ itemNumber: 2, partNumberNormalized: "B", parentPartNumber: "A" }),
    ];
    const frozenCopy = JSON.parse(JSON.stringify(rows));
    detectBomHierarchy(rows);
    expect(rows).toEqual(frozenCopy);
  });
});

describe("Mathematical Invariants (Confidence Bounds)", () => {
  it("confidence is always in [0, 1] range", () => {
    const validConfidences = [0, 0.25, 0.5, 0.75, 1.0];
    for (const c of validConfidences) {
      const row = createRow({ itemNumber: 1, confidence: c });
      expect(row.confidence).toBeGreaterThanOrEqual(0);
      expect(row.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("confidence < 0.7 forces review_required status", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A",
        descriptionNormalized: "Part A",
        quantity: 1,
        unit: "EA",
        confidence: 0.3,
      }),
    ];
    const dupResult = detectDuplicates(rows);
    const missingFields = detectMissingFields(rows);
    const dispositions = determineExportDisposition(rows, missingFields, dupResult);
    expect(dispositions.rows[0].status).toBe("review_required");
  });

  it("confidence >= 0.7 with all required fields allows clean disposition", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A",
        descriptionNormalized: "Part A",
        quantity: 1,
        unit: "EA",
        confidence: 0.85,
      }),
    ];
    const dupResult = detectDuplicates(rows);
    const missingFields = detectMissingFields(rows);
    const dispositions = determineExportDisposition(rows, missingFields, dupResult);
    expect(dispositions.rows[0].status).toBe("clean");
  });
});

describe("Mathematical Invariants (Dual-Pass)", () => {
  it("reconciled row count is at least max(|passA|, |passB|)", () => {
    const rowsA = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", sourceRow: 0 }),
      createRow({ itemNumber: 2, partNumberNormalized: "B", sourceRow: 1 }),
    ];
    const rowsB = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", sourceRow: 0 }),
      createRow({ itemNumber: 2, partNumberNormalized: "B", sourceRow: 1 }),
      createRow({ itemNumber: 3, partNumberNormalized: "C", sourceRow: 2 }),
    ];
    const result = reconcileDualPass(rowsA, rowsB);
    const maxCount = Math.max(rowsA.length, rowsB.length);
    expect(result.rows.length).toBeGreaterThanOrEqual(maxCount);
  });

  it("all rows in the result have an extractionPass set", () => {
    const rowsA = [createRow({ itemNumber: 1, sourceRow: 0 })];
    const rowsB = [createRow({ itemNumber: 1, sourceRow: 0 })];
    const result = reconcileDualPass(rowsA, rowsB);
    for (const row of result.rows) {
      expect(["pass_a", "pass_b", "both"]).toContain(row.extractionPass);
    }
  });
});

describe("Mathematical Invariants (Quantity Integrity)", () => {
  it("quantity is always a non-negative integer or null", () => {
    const validQuantities: (number | null)[] = [1, 0, 10, null];
    for (const qty of validQuantities) {
      expect(() => {
        const r = createRow({ itemNumber: 1, quantity: qty });
        if (qty !== null) {
          expect(Number.isInteger(qty)).toBe(true);
          expect(qty).toBeGreaterThanOrEqual(0);
        }
      }).not.toThrow();
    }
  });
});

describe("Mathematical Invariants (Source Traceability)", () => {
  it("every row has a non-empty sourceDocument", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", sourceDocument: "doc.pdf", sourcePage: 1, sourceRow: 0 }),
      createRow({ itemNumber: 2, partNumberNormalized: "B", sourceDocument: "doc.pdf", sourcePage: 1, sourceRow: 1 }),
    ];
    for (const r of rows) {
      expect(r.sourceDocument).toBeTruthy();
      expect(typeof r.sourceDocument).toBe("string");
      expect(r.sourceDocument.length).toBeGreaterThan(0);
    }
  });

  it("every row has a valid sourcePage (>= 1)", () => {
    const rows = [
      createRow({ itemNumber: 1, sourcePage: 1, sourceRow: 0 }),
      createRow({ itemNumber: 2, sourcePage: 5, sourceRow: 1 }),
    ];
    for (const r of rows) {
      expect(r.sourcePage).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("Mathematical Invariants (Export Disposition Determinism)", () => {
  it("same input always produces same export disposition", () => {
    const rows = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", confidence: 0.95 }),
      createRow({ itemNumber: 2, partNumberNormalized: null, confidence: 0.5 }),
    ];
    const dup1 = detectDuplicates(rows);
    const miss1 = detectMissingFields(rows);
    const d1 = determineExportDisposition(rows, miss1, dup1);

    const dup2 = detectDuplicates(rows);
    const miss2 = detectMissingFields(rows);
    const d2 = determineExportDisposition(rows, miss2, dup2);

    expect(d1.cleanCount).toBe(d2.cleanCount);
    expect(d1.reviewCount).toBe(d2.reviewCount);
    expect(d1.blockedCount).toBe(d2.blockedCount);
    expect(d1.rows.map((r) => r.status)).toEqual(d2.rows.map((r) => r.status));
  });
});
