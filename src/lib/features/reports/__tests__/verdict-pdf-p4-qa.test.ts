/**
 * P4 — Premium Decision Summary PDF closeout QA (data + template structure + banned language).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  buildVerdictReportData,
  mapPremiumReportExportToVerdictReportData,
  PREMIUM_DECISION_SUMMARY_METHODOLOGY,
  PREMIUM_DECISION_SUMMARY_TITLE,
  PREMIUM_DECISION_SUMMARY_USAGE_NOTE,
  VERDICT_REPORT_LEGAL_DISCLAIMER,
  type VerdictReportData,
} from "@/lib/features/reports/verdict-report";
import {
  buildDefaultSchemaInputs,
  runPremiumSchemaEngine,
} from "@/lib/features/premium-schema/premium-schema-engine";
import { buildPremiumReportExportPayload } from "@/lib/features/premium-schema/premium-report-export";
import { getPremiumCalculatorSchema } from "@/lib/features/premium-schema/schema-registry";
import { calculatePremiumDecisionReport } from "@/lib/features/tools/premium-decision-engine";
import { calculatePremiumToolResult } from "@/lib/features/tools/premium-tool-results";
import { getRevenueToolByPaidSlug } from "@/lib/features/tools/revenue-tools";

const BANNED_PDF_TERMS = [
  "certified",
  "approved",
  "verified",
  "public verify",
  "hash",
  "qr",
  "official seal",
  "legal-grade",
  "onaylı rapor",
  "mühürlü rapor",
] as const;

const LEGACY_PREMIUM_SLUG = "welding-bid-risk-analyzer";
const PREMIUM_SCHEMA_SLUGS = [
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  "7-israf-muda-avcisi-parasal-karsilik-calculator",
] as const;

function defaultLegacyValues(slug: string): Record<string, number | string> {
  const tool = getRevenueToolByPaidSlug(slug);
  if (!tool) {
    return {};
  }
  const values: Record<string, number | string> = {};
  for (const input of tool.paidInputs) {
    if (input.type === "select") {
      values[input.key] = input.defaultValue ?? input.options?.[0]?.value ?? "no";
      continue;
    }
    values[input.key] =
      input.defaultValue !== undefined
        ? input.defaultValue
        : input.type === "percent"
          ? 10
          : 100;
  }
  return values;
}

function collectPdfText(data: VerdictReportData): string {
  const parts = [
    PREMIUM_DECISION_SUMMARY_TITLE,
    PREMIUM_DECISION_SUMMARY_METHODOLOGY,
    PREMIUM_DECISION_SUMMARY_USAGE_NOTE,
    VERDICT_REPORT_LEGAL_DISCLAIMER,
    data.toolTitle,
    data.sector,
    data.verdict,
    data.headline,
    data.primaryMetricLabel,
    data.primaryMetricValue,
    data.suggestedAction,
    data.legalDisclaimer,
    data.methodologyNote,
    data.usageNote,
    ...data.riskDrivers,
    ...data.inputs.flatMap((input) => [input.label, input.value]),
    ...data.assumptions,
    ...data.scenarios.flatMap((scenario) => [scenario.title, scenario.detail, scenario.metric ?? ""]),
    ...data.validationNotes,
  ];
  return parts.join(" ").toLowerCase();
}

function assertNoBannedLanguage(text: string, toolLabel: string): void {
  for (const term of BANNED_PDF_TERMS) {
    expect(text, `${toolLabel} must not contain banned term "${term}"`).not.toContain(term.toLowerCase());
  }
}

function assertResultSummaryPopulated(data: VerdictReportData): void {
  expect(data.verdict.trim().length).toBeGreaterThan(0);
  expect(data.headline.trim().length).toBeGreaterThan(0);
  expect(data.primaryMetricLabel.trim().length).toBeGreaterThan(0);
  expect(data.primaryMetricValue.trim().length).toBeGreaterThan(0);
  expect(data.suggestedAction.trim().length).toBeGreaterThan(0);
}

function assertLegalSections(data: VerdictReportData): void {
  expect(data.usageNote.toLowerCase()).toContain("usage agreement");
  expect(data.legalDisclaimer.toLowerCase()).toMatch(/decision support|advice/);
  expect(data.methodologyNote.trim().length).toBeGreaterThan(20);
}

describe("P4 Premium Decision Summary PDF closeout", () => {
  test("VerdictPdfDocument template defines exactly 3 A4 pages", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/reports/VerdictPdfDocument.tsx"),
      "utf8",
    );
    expect(source.match(/<Page size="A4"/g)?.length).toBe(3);
    expect(source).toContain("Result summary");
    expect(source).toContain("Input summary");
    expect(source).toContain("Usage agreement");
    expect(source).toContain("Disclaimer");
    for (const term of BANNED_PDF_TERMS) {
      expect(source.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });

  test("export CTA uses mobile-safe touch targets", () => {
    const exportSource = readFileSync(
      join(process.cwd(), "src/components/reports/PremiumReportExportActions.tsx"),
      "utf8",
    );
    const cssSource = readFileSync(join(process.cwd(), "src/styles/design-craft.css"), "utf8");
    expect(exportSource).toContain("min-h-[44px]");
    expect(exportSource).toContain("sc-premium-export-actions__btn");
    expect(cssSource).toContain(".sc-premium-export-actions");
    expect(cssSource).toContain("flex-wrap: wrap");
    expect(cssSource).toMatch(/@media \(max-width: 390px\)[\s\S]*\.sc-premium-export-actions__btn[\s\S]*width: 100%/);
  });

  test("legacy premium tool — welding-bid-risk-analyzer", () => {
    const tool = getRevenueToolByPaidSlug(LEGACY_PREMIUM_SLUG);
    expect(tool).toBeDefined();
    if (!tool) {
      return;
    }

    const values = defaultLegacyValues(LEGACY_PREMIUM_SLUG);
    const decisionReport = calculatePremiumDecisionReport(LEGACY_PREMIUM_SLUG, values);
    const result = calculatePremiumToolResult(tool, values);
    const data = buildVerdictReportData({ tool, values, result, decisionReport });

    assertResultSummaryPopulated(data);
    assertLegalSections(data);
    expect(data.inputs.length).toBeGreaterThan(0);
    data.inputs.forEach((input) => {
      expect(input.label.trim().length).toBeGreaterThan(0);
      expect(input.value.trim().length).toBeGreaterThan(0);
      expect(input.value).not.toBe("-");
    });
    assertNoBannedLanguage(collectPdfText(data), LEGACY_PREMIUM_SLUG);
  });

  test.each(PREMIUM_SCHEMA_SLUGS)("premium-schema tool — %s", (schemaSlug) => {
    const schema = getPremiumCalculatorSchema(schemaSlug);
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const engineResult = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const payload = buildPremiumReportExportPayload(schema, engineResult, "en");
    const { data } = mapPremiumReportExportToVerdictReportData(payload);

    assertResultSummaryPopulated(data);
    assertLegalSections(data);
    expect(data.riskDrivers.length).toBeGreaterThan(0);
    expect(data.assumptions.length).toBeGreaterThan(0);
    expect(data.scenarios.length).toBeGreaterThan(0);
    assertNoBannedLanguage(collectPdfText(data), schemaSlug);
  });
});
