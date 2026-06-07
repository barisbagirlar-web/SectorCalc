import { describe, expect, test } from "vitest";
import {
  buildPremiumReportCsvRows,
  buildPremiumReportExportPayload,
  buildPremiumReportSummaryText,
  escapeCsvField,
  serializePremiumReportCsv,
} from "@/lib/premium-schema/premium-report-export";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/premium-schema/premium-schema-engine";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

const FIXED_DATE = "2026-06-04T12:00:00.000Z";

function buildPayload(slug: string) {
  const schema = getPremiumCalculatorSchema(slug);
  expect(schema).not.toBeNull();
  if (!schema) {
    throw new Error(`Schema not found: ${slug}`);
  }
  const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
  return buildPremiumReportExportPayload(schema, result, "en", FIXED_DATE);
}

describe("premium-report-export", () => {
  test("buildPremiumReportExportPayload produces payload", () => {
    const payload = buildPayload("cnc-oee-loss");
    expect(payload.schemaSlug).toBe("cnc-oee-loss");
    expect(payload.reportId).toContain("cnc-oee-loss");
    expect(payload.generatedAt).toBe(FIXED_DATE);
  });

  test("bigNumber value is formatted string", () => {
    const payload = buildPayload("cnc-oee-loss");
    expect(payload.bigNumber.value.length).toBeGreaterThan(0);
    expect(payload.bigNumber.label.length).toBeGreaterThan(0);
    expect(Number.isFinite(payload.bigNumber.rawValue)).toBe(true);
  });

  test("hiddenDrivers list is populated", () => {
    const payload = buildPayload("logistics-route-loss");
    expect(payload.hiddenDrivers.length).toBeGreaterThan(0);
    payload.hiddenDrivers.forEach((driver) => {
      expect(driver.label.length).toBeGreaterThan(0);
      expect(driver.value.length).toBeGreaterThan(0);
    });
  });

  test("thresholds list is populated", () => {
    const payload = buildPayload("cnc-oee-loss");
    expect(payload.thresholds.length).toBeGreaterThan(0);
    payload.thresholds.forEach((threshold) => {
      expect(["safe", "warning", "critical"]).toContain(threshold.level);
    });
  });

  test("legalNote is present in payload", () => {
    const payload = buildPayload("energy-peak-cost");
    expect(payload.legalNote.length).toBeGreaterThan(10);
    expect(payload.legalNote.toLowerCase()).toMatch(/decision-support|advice/);
  });

  test("CSV serialize includes header row", () => {
    const payload = buildPayload("cnc-oee-loss");
    const csv = serializePremiumReportCsv(payload);
    expect(csv.startsWith("section,label,value,description")).toBe(true);
    expect(csv).toContain("executive_verdict");
    expect(csv).toContain("big_number");
  });

  test("CSV serialize uses Turkish headers for tr locale", () => {
    const payload = buildPayload("cnc-oee-loss");
    const csv = serializePremiumReportCsv(payload, "tr");
    expect(csv.startsWith("bolum,etiket,deger,aciklama")).toBe(true);
  });

  test("TR legal note is localized", () => {
    const schema = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }
    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema), "tr");
    const payload = buildPremiumReportExportPayload(schema, result, "tr", FIXED_DATE);
    expect(payload.legalNote).toMatch(/danışmanlığı|girdileri/i);
  });

  test("CSV escapes comma quote and newline", () => {
    expect(escapeCsvField("plain")).toBe("plain");
    expect(escapeCsvField('say "hello"')).toBe('"say ""hello"""');
    expect(escapeCsvField("a,b")).toBe('"a,b"');
    expect(escapeCsvField("line1\nline2")).toBe('"line1\nline2"');

    const payload = buildPayload("cnc-oee-loss");
    const rows = buildPremiumReportCsvRows({
      ...payload,
      executiveVerdict: {
        ...payload.executiveVerdict,
        explanation: 'Value "test", with comma\nand newline',
      },
    });
    const csv = serializePremiumReportCsv({
      ...payload,
      executiveVerdict: {
        ...payload.executiveVerdict,
        explanation: 'Value "test", with comma\nand newline',
      },
    });
    expect(rows.some((row) => row.value.includes('"test"'))).toBe(true);
    expect(csv).toContain('""');
  });

  test("NaN and Infinity are not in export strings", () => {
    const payload = buildPayload("cnc-oee-loss");
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toMatch(/\bNaN\b/);
    expect(serialized).not.toMatch(/\bInfinity\b/i);

    const summary = buildPremiumReportSummaryText(payload);
    expect(summary).not.toMatch(/\bNaN\b/);
    expect(summary).not.toMatch(/\bInfinity\b/i);
  });

  test("suggested actions has at least one entry", () => {
    const payload = buildPayload("cnc-oee-loss");
    expect(payload.suggestedActions.length).toBeGreaterThanOrEqual(1);
    payload.suggestedActions.forEach((action) => {
      expect(action.length).toBeGreaterThan(0);
    });
  });

  test("missing data does not crash payload builder", () => {
    const schema = getPremiumCalculatorSchema("cnc-oee-loss");
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const emptyInputs = Object.fromEntries(schema.inputs.map((input) => [input.id, ""]));
    expect(() => runPremiumSchemaEngine(schema, emptyInputs)).not.toThrow();

    const result = runPremiumSchemaEngine(schema, emptyInputs);
    expect(() => buildPremiumReportExportPayload(schema, result, "en", FIXED_DATE)).not.toThrow();

    const payload = buildPremiumReportExportPayload(schema, result, "en", FIXED_DATE);
    expect(payload.bigNumber.value).not.toMatch(/\bNaN\b/);
    expect(payload.legalNote.length).toBeGreaterThan(0);
  });
});
