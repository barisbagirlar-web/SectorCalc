/**
 * Workbook Integrity Tests
 *
 * Fixture-based tests that generate and reopen workbooks to verify:
 * - Required sheets exist
 * - Required headers exist  
 * - Leading zeroes preserved
 * - Formula injection neutralized
 * - Clean/review row separation correct
 * - Source mapping complete
 * - No corrupted workbook
 */

import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import {
  generateMaintenanceBomWorkbook,
} from "@/lib/document-intelligence/workbook/workbook-generator";
import { generateSourceMapCsv } from "@/lib/document-intelligence/workbook/csv-generator";
import type { BomRow, ProcessingSummary } from "@/types/document-intelligence";
import type { DispositionResult } from "@/lib/document-intelligence/validators/export-disposition";

/* ── Helpers ─────────────────────────────────────────────────────── */

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

function makeSummary(overrides: Partial<ProcessingSummary> = {}): ProcessingSummary {
  return {
    inputFilename: "test_manual.pdf",
    processedPages: 12,
    extractedRows: 10,
    cleanRows: 7,
    reviewRows: 2,
    blockedRows: 1,
    duplicateGroups: 1,
    missingFieldCount: 2,
    revisionConflictCount: 1,
    lowConfidenceCount: 1,
    engineVersion: "1.0.0",
    validatorVersion: "1.0.0",
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    passARowCount: 10,
    passBRowCount: 10,
    reconciliationAgreedCount: 8,
    reconciliationDisagreementCount: 0,
    reconciliationMissingPassB: 0,
    hasHierarchy: false,
    hierarchyExceptionCount: 0,
    qaStatus: "passed",
    qaAutomatic: true,
    procurementReadyCount: 7,
    dependencyAuditPassed: true,
    ...overrides,
  };
}

/* ── Tests ────────────────────────────────────────────────────────── */

describe("Workbook Integrity", () => {
  it("generates a valid workbook that reopens without error", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "ABC-001", descriptionNormalized: "Bearing", quantity: 4 }),
    ];
    const disposition: DispositionResult = {
      rows: rows.map((r) => ({
        row: r,
        status: "clean",
        disposition: "clean",
        reasons: [],
      })),
      cleanCount: 1,
      reviewCount: 0,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary(),
      jobId: "test-job-001",
    });

    // Reopen the workbook
    const wb = XLSX.read(buffer, { type: "buffer" });
    expect(wb).toBeDefined();
  });

  it("contains all 8 required sheets", () => {
    const rows = [makeRow({ itemNumber: 1, partNumberNormalized: "A1" })];
    const disposition: DispositionResult = {
      rows: rows.map((r) => ({ row: r, status: "clean", disposition: "clean", reasons: [] })),
      cleanCount: 1,
      reviewCount: 0,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary(),
      jobId: "test-job-001",
    });

    const wb = XLSX.read(buffer, { type: "buffer" });
    const requiredSheets = [
      "Clean BOM",
      "Review Required",
      "Duplicate Parts",
      "Missing Fields",
      "Revision Conflicts",
      "Source Map",
      "Processing Summary",
      "Generic ERP Import Template",
    ];

    for (const sheet of requiredSheets) {
      expect(wb.SheetNames).toContain(sheet);
    }
  });

  it("has correct Clean BOM headers", () => {
    const rows = [makeRow({ itemNumber: 1, partNumberNormalized: "A1" })];
    const disposition: DispositionResult = {
      rows: rows.map((r) => ({ row: r, status: "clean", disposition: "clean", reasons: [] })),
      cleanCount: 1,
      reviewCount: 0,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary(),
      jobId: "test-job-001",
    });

    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets["Clean BOM"];
    const data = XLSX.utils.sheet_to_json<(typeof XLSX.utils.sheet_to_json extends (s: unknown, opts?: infer O) => infer R ? R : never)>(ws as XLSX.WorkSheet, { header: 1 }) as unknown[][];
    const headers = data[0] as string[];

    expect(headers).toContain("Part Number");
    expect(headers).toContain("Description");
    expect(headers).toContain("Quantity");
    expect(headers).toContain("Source Page");
    expect(headers).toContain("Validation Status");
  });

  it("only clean rows appear in Clean BOM", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "CLEAN-01", descriptionNormalized: "Clean Part", quantity: 5 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "REVIEW-01", descriptionNormalized: "Review Part", quantity: 2 }),
    ];
    const disposition: DispositionResult = {
      rows: [
        { row: rows[0], status: "clean", disposition: "clean", reasons: [] },
        { row: rows[1], status: "blocked", disposition: "review_required", reasons: ["Missing field"] },
      ],
      cleanCount: 1,
      reviewCount: 1,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary(),
      jobId: "test-job-001",
    });

    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets["Clean BOM"];
    const data = XLSX.utils.sheet_to_json(ws) as Array<Record<string, unknown>>;

    // Only CLEAN-01 should be in Clean BOM
    const partNumbers = data.map((r: Record<string, unknown>) => r["Part Number"]);
    expect(partNumbers).toContain("CLEAN-01");
    expect(partNumbers).not.toContain("REVIEW-01");
  });

  it("preserves leading zeroes in part numbers as text", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "00123", descriptionNormalized: "Leading Zero Part" }),
    ];
    const disposition: DispositionResult = {
      rows: rows.map((r) => ({ row: r, status: "clean", disposition: "clean", reasons: [] })),
      cleanCount: 1,
      reviewCount: 0,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary(),
      jobId: "test-job-001",
    });

    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets["Clean BOM"];
    const data = XLSX.utils.sheet_to_json(ws) as Array<Record<string, unknown>>;

    // The value should be "00123" not 123 (number)
    expect(data[0]["Part Number"]).toBe("00123");
  });

  it("neutralizes formula injection in part numbers", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "=SUM(A1:A10)", descriptionNormalized: "Formula" }),
      makeRow({ itemNumber: 2, partNumberNormalized: "+IMPORT(\"evil\")", descriptionNormalized: "Formula2" }),
      makeRow({ itemNumber: 3, partNumberNormalized: "@DDE(\"cmd\")", descriptionNormalized: "Formula3" }),
      makeRow({ itemNumber: 4, partNumberNormalized: "-1+1", descriptionNormalized: "Formula4" }),
    ];
    const disposition: DispositionResult = {
      rows: rows.map((r) => ({ row: r, status: "clean", disposition: "clean", reasons: [] })),
      cleanCount: 4,
      reviewCount: 0,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary(),
      jobId: "test-job-001",
    });

    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets["Clean BOM"];
    const data = XLSX.utils.sheet_to_json(ws) as Array<Record<string, unknown>>;

    // All formula-like values should be escaped (prefixed with ')
    expect(data[0]["Part Number"]).toBe("'=SUM(A1:A10)");
    expect(data[1]["Part Number"]).toBe("'+IMPORT(\"evil\")");
    expect(data[2]["Part Number"]).toBe("'@DDE(\"cmd\")");
    expect(data[3]["Part Number"]).toBe("'-1+1");
  });

  it("source map has complete traceability for every row", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "PN-01", sourcePage: 3, sourceTable: "t1", sourceRow: 5 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "PN-02", sourcePage: 5, sourceTable: "t2", sourceRow: 10 }),
    ];
    const disposition: DispositionResult = {
      rows: rows.map((r) => ({ row: r, status: "clean", disposition: "clean", reasons: [] })),
      cleanCount: 2,
      reviewCount: 0,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary(),
      jobId: "test-job-001",
    });

    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets["Source Map"];
    const data = XLSX.utils.sheet_to_json(ws) as Array<Record<string, unknown>>;

    expect(data.length).toBe(2);
    expect(data[0]["Source Page"]).toBe(3);
    expect(data[1]["Source Page"]).toBe(5);
    expect(data[0]["Evidence Reference"]).toContain("p3");
  });

  it("CSV source map has correct headers", () => {
    const rows = [makeRow({ itemNumber: 1, partNumberNormalized: "ABC" })];
    const csv = generateSourceMapCsv({ rows, sourceDocument: "test.pdf" });
    expect(csv).toContain("Row ID");
    expect(csv).toContain("Source Document");
    expect(csv).toContain("Source Page");
    expect(csv).toContain("Evidence Reference");
    expect(csv).toContain("ABC");
  });

  it("processing summary has correct row counts", () => {
    const rows = [
      makeRow({ itemNumber: 1, partNumberNormalized: "A", descriptionNormalized: "Clean", quantity: 1 }),
      makeRow({ itemNumber: 2, partNumberNormalized: "B", descriptionNormalized: "Review", quantity: 2 }),
    ];
    const disposition: DispositionResult = {
      rows: [
        { row: rows[0], status: "clean", disposition: "clean", reasons: [] },
        { row: rows[1], status: "blocked", disposition: "review_required", reasons: ["Missing field"] },
      ],
      cleanCount: 1,
      reviewCount: 1,
      blockedCount: 0,
    };

    const buffer = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary: makeSummary({ extractedRows: 2, cleanRows: 1, reviewRows: 1 }),
      jobId: "test-job-001",
    });

    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets["Processing Summary"];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

    const metricRows = (data as string[][]).filter((r: string[]) => r[0] === "Clean Rows" || r[0] === "Review Required Rows" || r[0] === "Extracted Rows");
    expect(metricRows.length).toBe(3);

    const cleanRow = (data as string[][]).find((r: string[]) => r[0] === "Clean Rows");
    expect(cleanRow?.[1]).toBe(1);
  });
});
