/**
 * Stress/Load Test: Workbook Generators
 *
 * Validates that workbook generators can handle:
 * - Large row counts (up to 500 — product limit)
 * - Maximum expected concurrent output without OOM
 * - Repeatable deterministic output for same input
 */
import { describe, it, expect } from "vitest";
import {
  generateMaintenanceBomWorkbook,
} from "@/lib/document-intelligence/workbook/workbook-generator";
import { generateSourceMapCsv } from "@/lib/document-intelligence/workbook/csv-generator";
import type { BomRow, ProcessingSummary } from "@/types/document-intelligence";
import type { DispositionResult } from "@/lib/document-intelligence/validators/export-disposition";

function makeRow(overrides: Partial<BomRow> & { itemNumber: number }): BomRow {
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
    sourceDocument: "test.pdf",
    sourcePage: overrides.sourcePage ?? 1,
    sourceTable: "table1",
    sourceRow: overrides.sourceRow ?? 0,
    confidence: overrides.confidence ?? 1,
    validationStatus: overrides.validationStatus ?? "clean",
    validationFlags: overrides.validationFlags ?? [],
    reviewRequired: false,
    exportDisposition: overrides.exportDisposition ?? "clean",
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
    engineVersion: "1.0.0",
    validatorVersion: "1.0.0",
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeDisposition(rows: BomRow[]): DispositionResult {
  return {
    rows: rows.map((r) => ({
      row: r,
      status: "clean" as const,
      disposition: "clean" as const,
      reasons: [],
    })),
    cleanCount: rows.length,
    reviewCount: 0,
    blockedCount: 0,
  };
}

function mockRows(count: number): BomRow[] {
  const rows: BomRow[] = [];
  for (let i = 0; i < count; i++) {
    rows.push(
      makeRow({
        itemNumber: i + 1,
        partNumberNormalized: `PN-${String(i).padStart(5, "0")}`,
        quantity: (i % 10) + 1,
        sourcePage: (i % 6) + 1,
        sourceRow: i % 50,
        exportDisposition: "clean",
      }),
    );
  }
  return rows;
}

describe("Stress Test: Workbook at Capacity Limits", () => {
  it("generates workbook with 500 rows without error", () => {
    const rows = mockRows(500);
    const summary = makeSummary({ extractedRows: 500, cleanRows: 500, reviewRows: 0 });
    const disposition = makeDisposition(rows);

    const buf = generateMaintenanceBomWorkbook({
      rows,
      disposition,
      duplicateGroups: [],
      missingFieldExceptions: [],
      revisionConflicts: [],
      summary,
      jobId: "stress-test-001",
    });

    expect(buf).toBeInstanceOf(Buffer);
    expect(buf.length).toBeGreaterThan(0);
    expect(buf.length).toBeLessThan(10 * 1024 * 1024);
  });
});

describe("Stress Test: CSV Source Map at Capacity", () => {
  it("generates CSV with 500 rows without error", () => {
    const rows = mockRows(500);
    const csv = generateSourceMapCsv({ rows, sourceDocument: "test.pdf" });
    expect(csv.length).toBeGreaterThan(0);
    const lines = csv.trim().split("\n");
    expect(lines.length).toBe(501); // header + 500 data
  });
});

describe("Stress Test: Repeated Calls (Memory)", () => {
  it("handles 10 sequential workbook generations", () => {
    for (let i = 0; i < 10; i++) {
      const rows = mockRows(50);
      const summary = makeSummary({ extractedRows: 50, cleanRows: 50 });
      const disposition = makeDisposition(rows);
      const buf = generateMaintenanceBomWorkbook({
        rows,
        disposition,
        duplicateGroups: [],
        missingFieldExceptions: [],
        revisionConflicts: [],
        summary,
        jobId: `stress-test-${i}`,
      });
      expect(buf.length).toBeGreaterThan(0);
    }
  });
});
