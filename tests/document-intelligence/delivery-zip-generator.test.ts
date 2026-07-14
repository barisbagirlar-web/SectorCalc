import { describe, it, expect } from "vitest";
import { generateDeliveryZip } from "@/lib/document-intelligence/workbook/delivery-zip-generator";
import type { DeliveryZipInput } from "@/lib/document-intelligence/workbook/delivery-zip-generator";
import type { ProcessingSummary } from "@/types/document-intelligence";

const SAMPLE_SUMMARY: ProcessingSummary = {
  inputFilename: "test.pdf",
  processedPages: 10,
  extractedRows: 25,
  cleanRows: 18,
  reviewRows: 5,
  blockedRows: 2,
  duplicateGroups: 2,
  missingFieldCount: 3,
  revisionConflictCount: 1,
  lowConfidenceCount: 2,
  engineVersion: "1.0.0",
  validatorVersion: "1.0.0",
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
};

function makeBuf(size = 256): Buffer {
  return Buffer.alloc(size, 0x41);
}

function makeInput(overrides: Partial<DeliveryZipInput> = {}): DeliveryZipInput {
  return {
    jobId: "test-job-001",
    bomXlsx: makeBuf(512),
    exceptionReportXlsx: makeBuf(512),
    sourceMapCsv: makeBuf(256),
    summaryHtml: makeBuf(1024),
    dataDictionaryHtml: makeBuf(2048),
    importChecklistHtml: makeBuf(1024),
    manifestJson: makeBuf(512),
    summary: SAMPLE_SUMMARY,
    retentionDays: 7,
    engineVersion: "1.0.0",
    validatorVersion: "1.0.0",
    schemaVersion: "1.0.0",
    supportContact: "support@sectorcalc.com",
    ...overrides,
  };
}

describe("Delivery ZIP Generator", () => {
  it("returns zipBuffer and sha256", async () => {
    const r = await generateDeliveryZip(makeInput());
    expect(r.zipBuffer).toBeInstanceOf(Buffer);
    expect(r.sha256).toHaveLength(64);
  });

  it("sha256 is hex", async () => {
    const r = await generateDeliveryZip(makeInput());
    expect(/^[0-9a-f]{64}$/.test(r.sha256)).toBe(true);
  });

  it("ZIP > 500 bytes", async () => {
    const r = await generateDeliveryZip(makeInput());
    expect(r.zipBuffer.length).toBeGreaterThan(500);
  });

  it("deterministic output", async () => {
    const inp = makeInput();
    const [a, b] = await Promise.all([generateDeliveryZip(inp), generateDeliveryZip(inp)]);
    expect(a.sha256).toBe(b.sha256);
  });

  it("PK signature", async () => {
    const r = await generateDeliveryZip(makeInput());
    expect(r.zipBuffer[0]).toBe(0x50);
    expect(r.zipBuffer[1]).toBe(0x4b);
  });
});
