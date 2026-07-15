/**
 * Unit Tests: Dual-Pass Extraction & Reconciliation (Section 59)
 */
import { describe, it, expect } from "vitest";
import {
  reconcileDualPass,
  extractPassA,
  extractPassB,
} from "@/lib/document-intelligence/contracts/dual-pass-reconciliation";
import { MockExtractionProvider } from "@/lib/document-intelligence/contracts/provider-interfaces";
import { mapExtractionToCanonicalRows } from "@/lib/document-intelligence/contracts/canonical-mapper";
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
    sourceDocument: overrides.sourceDocument ?? "test.pdf",
    sourcePage: overrides.sourcePage ?? 1,
    sourceTable: overrides.sourceTable ?? "0",
    sourceRow: overrides.sourceRow ?? 0,
    confidence: overrides.confidence ?? 1.0,
    validationStatus: "clean",
    validationFlags: [],
    reviewRequired: false,
    exportDisposition: "clean",
    ...overrides,
  };
}

describe("Dual-Pass Reconciliation", () => {
  it("pass A and pass B from same provider agree exactly", async () => {
    const provider = new MockExtractionProvider({
      syntheticTableCount: 1,
      syntheticRowsPerTable: 3,
    });
    const buf = new ArrayBuffer(0);
    const result = await provider.extract(buf, "test.pdf");

    const passAResult = extractPassA(result);
    const passBResult = extractPassB(result);

    const rowsA = mapExtractionToCanonicalRows(passAResult, "test.pdf");
    const rowsB = mapExtractionToCanonicalRows(passBResult, "test.pdf");

    const reconciled = reconcileDualPass(rowsA, rowsB);

    // Row count should match pass A (pass B may add extra)
    expect(reconciled.rows.length).toBeGreaterThanOrEqual(rowsA.length);
    // All original rows should have 'both' extraction pass
    for (const row of reconciled.rows) {
      if (row.extractionPass !== "pass_b") {
        expect(row.extractionPass).toBe("both");
      }
    }
  });

  it("exact agreement when both passes produce identical data", () => {
    const rowA = createRow({
      itemNumber: 1,
      partNumberNormalized: "ABC-123",
      quantity: 4,
      revision: "A",
      sourcePage: 1,
      sourceTable: "0",
      sourceRow: 0,
    });
    const rowB = createRow({
      itemNumber: 1,
      partNumberNormalized: "ABC-123",
      quantity: 4,
      revision: "A",
      sourcePage: 1,
      sourceTable: "0",
      sourceRow: 0,
    });

    const result = reconcileDualPass([rowA], [rowB]);
    expect(result.reconciliation).toHaveLength(1);
    expect(result.reconciliation[0].status).toBe("agreed");
    expect(result.reconciliation[0].notes).toHaveLength(0);
  });

  it("normalized agreement when dash variants differ", () => {
    const rowA = createRow({
      itemNumber: 1,
      partNumberNormalized: "ABC-123",
      quantity: 4,
      revision: "A",
      sourcePage: 1,
      sourceTable: "0",
      sourceRow: 0,
    });
    const rowB = createRow({
      itemNumber: 1,
      partNumberNormalized: "ABC\u2013123", // en-dash
      quantity: 4,
      revision: "A",
      sourcePage: 1,
      sourceTable: "0",
      sourceRow: 0,
    });

    const result = reconcileDualPass([rowA], [rowB]);
    expect(result.reconciliation[0].status).toBe("normalized_agreement");
    expect(result.reconciliation[0].notes).toContain("Part numbers agree after normalization");
  });

  it("disagreement when quantities conflict", () => {
    const rowA = createRow({
      itemNumber: 1,
      partNumberNormalized: "ABC-123",
      quantity: 4,
      revision: "A",
      sourcePage: 1,
      sourceTable: "0",
      sourceRow: 0,
    });
    const rowB = createRow({
      itemNumber: 1,
      partNumberNormalized: "ABC-123",
      quantity: 10,
      revision: "A",
      sourcePage: 1,
      sourceTable: "0",
      sourceRow: 0,
    });

    const result = reconcileDualPass([rowA], [rowB]);
    expect(result.reconciliation[0].status).toBe("disagreement");
    expect(result.rows[0].reconciliationStatus).toBe("disagreement");
    expect(result.rows[0].reviewRequired).toBe(true);
    expect(result.rows[0].exportDisposition).toBe("review_required");
  });

  it("row in pass B but not pass A is reported as missing_in_pass_a", () => {
    const rowA = createRow({
      itemNumber: 1,
      partNumberNormalized: "ABC-123",
      sourcePage: 1,
      sourceTable: "0",
      sourceRow: 0,
    });
    const rowBExtra = createRow({
      itemNumber: 2,
      partNumberNormalized: "DEF-456",
      sourcePage: 2,
      sourceTable: "1",
      sourceRow: 0,
    });

    const result = reconcileDualPass([rowA], [rowBExtra]);
    expect(result.reconciliation).toHaveLength(2);
    const missingInA = result.reconciliation.find((r) => r.status === "missing_in_pass_a");
    expect(missingInA).toBeDefined();
    expect(missingInA!.partNumber.partNumber).toBe("DEF-456");
  });

  it("pass A row without match in pass B has extractionPass='pass_a'", () => {
    const rowA = createRow({ itemNumber: 1, sourceRow: 0 });
    const result = reconcileDualPass([rowA], []);
    expect(result.rows[0].extractionPass).toBe("pass_a");
    expect(result.rows[0].reconciliationStatus).toBe("missing_in_pass_b");
  });

  it("row count conservation in reconciliation", () => {
    const rowsA = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", sourceRow: 0 }),
      createRow({ itemNumber: 2, partNumberNormalized: "B", sourceRow: 1 }),
      createRow({ itemNumber: 3, partNumberNormalized: "C", sourceRow: 2 }),
    ];
    const rowsB = [
      createRow({ itemNumber: 1, partNumberNormalized: "A", sourceRow: 0 }),
      createRow({ itemNumber: 2, partNumberNormalized: "B", sourceRow: 1 }),
    ];

    const result = reconcileDualPass(rowsA, rowsB);
    // All rowsA rows should be present + any pass B extras
    expect(result.rows.length).toBeGreaterThanOrEqual(rowsA.length);
    expect(result.passAMetrics.rowCount).toBe(3);
    expect(result.passBMetrics.rowCount).toBe(2);
  });
});
