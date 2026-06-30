/**
 * Tests for the report ID service
 */
import { describe, it, expect } from "vitest";
import { createReportId, createValidationStampId, parseReportId } from "./report-id";

describe("createReportId", () => {
  it("generates ID in SC-YYYYMMDD-TOOLSHORT-ID format", () => {
    const id = createReportId("cnc-quote-risk-analyzer");
    expect(id).toMatch(/^SC-\d{8}-[A-Z0-9]+-[A-Z0-9]+$/);
  });

  it("uses fixed date when provided", () => {
    const date = new Date("2026-06-10T00:00:00Z");
    const id = createReportId("test-tool", date);
    expect(id).toMatch(/^SC-20260610-/);
  });

  it("sanitizes toolSlug to uppercase alphanumeric", () => {
    const id = createReportId("cnc-quote-risk-analyzer");
    expect(id).toContain("CNCQUOTERI");
  });

  it("truncates toolShort to max 10 chars", () => {
    const id = createReportId("a-very-long-tool-slug-that-exceeds-limit");
    const parts = id.split("-");
    // SC-YYYYMMDD-TOOLSHORT-ID → parts[2] is TOOLSHORT
    expect(parts[2].length).toBeLessThanOrEqual(10);
  });

  it("generates different IDs for same tool (random suffix)", () => {
    const id1 = createReportId("test-tool");
    const id2 = createReportId("test-tool");
    // With random suffix, these should be different (extremely unlikely to collide)
    expect(id1).not.toBe(id2);
  });

  it("uses TOOL as fallback if slug is empty", () => {
    const id = createReportId("---");
    expect(id).toMatch(/^SC-\d{8}-TOOL-/);
  });
});

describe("createValidationStampId", () => {
  it("generates VS- prefixed stamp", () => {
    const reportId = "SC-20260610-CNCQUOTE-A1B2C3";
    const stamp = createValidationStampId(reportId);
    expect(stamp).toMatch(/^VS-SC-20260610-CNCQUOTE-A1B2C3-[A-Z0-9]+$/);
  });

  it("two stamps for same reportId are different", () => {
    const reportId = "SC-20260610-TEST-ABCDEF";
    const s1 = createValidationStampId(reportId);
    const s2 = createValidationStampId(reportId);
    expect(s1).not.toBe(s2);
  });
});

describe("parseReportId", () => {
  it("parses valid report ID", () => {
    const result = parseReportId("SC-20260610-CNCQUOTE-A1B2C3");
    expect(result.ok).toBe(true);
    expect(result.date).toBe("2026-06-10");
    expect(result.toolShort).toBe("CNCQUOTE");
    expect(result.id).toBe("A1B2C3");
  });

  it("returns ok=false for invalid format", () => {
    expect(parseReportId("invalid").ok).toBe(false);
    expect(parseReportId("").ok).toBe(false);
    expect(parseReportId("SC-2026-TOOL-ID").ok).toBe(false);
  });

  it("returns ok=false for invalid date", () => {
    expect(parseReportId("SC-20261399-TOOL-ABCDEF").ok).toBe(false);
  });
});