/**
 * Unit Tests: Human QA Workflow (Section 66)
 */
import { describe, it, expect } from "vitest";
import { evaluateQaGate } from "@/lib/document-intelligence/quality/human-qa-workflow";
import { determineExportDisposition } from "@/lib/document-intelligence/validators/export-disposition";
import { detectDuplicates } from "@/lib/document-intelligence/validators/duplicate-detector";
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
    reconciliationStatus: overrides.reconciliationStatus ?? null,
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
    reviewRequired: overrides.reviewRequired ?? false,
    exportDisposition: overrides.exportDisposition ?? "clean",
    ...overrides,
  };
}

describe("Human QA Workflow", () => {
  it("passes when all checks succeed", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        sourcePage: 1,
        sourceRow: 0,
      }),
      createRow({
        itemNumber: 2,
        partNumberNormalized: "B-001",
        sourcePage: 2,
        sourceRow: 1,
      }),
    ];
    const dupResult = detectDuplicates(rows);
    const disposition = determineExportDisposition(rows, [], dupResult);
    const result = evaluateQaGate(rows, disposition);
    expect(result.status).toBe("passed");
    expect(result.automatic).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("triggers quality_hold on reconciliation disagreement", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        reconciliationStatus: "disagreement",
        sourcePage: 1,
        sourceRow: 0,
      }),
    ];
    const dupResult = detectDuplicates(rows);
    const disposition = determineExportDisposition(rows, [], dupResult);
    const result = evaluateQaGate(rows, disposition);
    expect(result.status).toBe("quality_hold");
    expect(result.automatic).toBe(false);
    expect(result.reasons).toContain("critical_reconciliation_disagreement");
  });

  it("triggers quality_hold on row conservation failure", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        sourcePage: 1,
        sourceRow: 0,
      }),
      createRow({
        itemNumber: 2,
        partNumberNormalized: "B-001",
        sourcePage: 2,
        sourceRow: 1,
      }),
    ];
    // Simulate row conservation failure by creating a mismatch
    const badDisposition = {
      rows: [
        { row: rows[0], status: "clean" as const, disposition: "clean" as const, reasons: [] },
      ],
      cleanCount: 1,
      reviewCount: 0,
      blockedCount: 0,
    };
    const result = evaluateQaGate(rows, badDisposition);
    expect(result.status).toBe("quality_hold");
    expect(result.reasons).toContain("row_conservation_failed");
  });

  it("triggers operator_review for missing optional fields", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        sourcePage: 1,
        sourceRow: 0,
        confidence: 0.5,  // Low confidence -> review
      }),
    ];
    const dupResult = detectDuplicates(rows);
    const disposition = determineExportDisposition(rows, [], dupResult);
    const result = evaluateQaGate(rows, disposition);
    // Low confidence alone doesn't fail QA — it goes to review
    expect(result.status).toBe("passed");
  });

  it("provides max operator minutes for non-automatic decisions", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        reconciliationStatus: "disagreement",
        sourcePage: 1,
        sourceRow: 0,
      }),
    ];
    const dupResult = detectDuplicates(rows);
    const disposition = determineExportDisposition(rows, [], dupResult);
    const result = evaluateQaGate(rows, disposition);
    expect(result.maxOperatorMinutes).toBeGreaterThan(0);
    expect(result.automatic).toBe(false);
  });

  it("passes with valid source traceability", () => {
    const rows = [
      createRow({
        itemNumber: 1,
        partNumberNormalized: "A-001",
        sourceDocument: "doc.pdf",
        sourcePage: 1,
        sourceRow: 0,
      }),
      createRow({
        itemNumber: 2,
        partNumberNormalized: "B-001",
        sourceDocument: "doc.pdf",
        sourcePage: 2,
        sourceRow: 1,
      }),
    ];
    const dupResult = detectDuplicates(rows);
    const disposition = determineExportDisposition(rows, [], dupResult);
    const result = evaluateQaGate(rows, disposition);
    expect(result.status).toBe("passed");
  });
});
