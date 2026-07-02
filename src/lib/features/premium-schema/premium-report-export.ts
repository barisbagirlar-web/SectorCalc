/**
 * Premium report export - payload, CSV, and summary helpers.
 * No server-side PDF; browser print / CSV download only.
 */

import {
  formatLocalizedDate,
  normalizeLocale,
  NOT_AVAILABLE,
  TECHNICAL_SIMULATION_NOTICE,
  type SupportedLocale,
} from "@/lib/core/format/localization";
import type {
  PremiumCalculatorSchema,
  PremiumSchemaEngineResult,
  ThresholdSeverity,
} from "@/lib/features/premium-schema/premium-calculator-schema";
import {
  getAssumptionLines,
  getHiddenDriverOutputs,
  getOutputMeaning,
  getSuggestedActionSteps,
  getThresholdSummary,
  getVerdictFromThresholds,
} from "@/lib/features/premium-schema/format-premium-result";
import { worstThresholdSeverity } from "@/lib/features/premium-schema/premium-schema-engine";

export type PremiumReportExportStatus = "critical" | "warning" | "acceptable";

export interface PremiumReportExportPayload {
  readonly reportId: string;
  readonly generatedAt: string;
  readonly schemaSlug: string;
  readonly schemaName: string;
  readonly sectorSlug: string;
  readonly title: string;
  readonly executiveVerdict: {
    readonly status: PremiumReportExportStatus;
    readonly verdict: string;
    readonly explanation: string;
  };
  readonly bigNumber: {
    readonly label: string;
    readonly value: string;
    readonly rawValue: number;
    readonly unit: string;
  };
  readonly hiddenDrivers: readonly {
    readonly label: string;
    readonly value: string;
    readonly rawValue: number;
    readonly description: string;
  }[];
  readonly thresholds: readonly {
    readonly label: string;
    readonly level: "safe" | "warning" | "critical";
    readonly value: string;
    readonly message: string;
  }[];
  readonly suggestedActions: readonly string[];
  readonly assumptions: readonly string[];
  readonly legalNote: string;
}

export interface PremiumReportCsvRow {
  readonly section: string;
  readonly label: string;
  readonly value: string;
  readonly description: string;
}

export function getTechnicalSimulationNotice(): string {
  return TECHNICAL_SIMULATION_NOTICE;
}

function sanitizeExportString(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || /\bNaN\b/.test(trimmed) || /\bInfinity\b/i.test(trimmed)) {
    return NOT_AVAILABLE;
  }
  return trimmed;
}

function sanitizeRawValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function toExportStatus(
  status: "Critical" | "Warning" | "Acceptable"
): PremiumReportExportStatus {
  switch (status) {
    case "Critical":
      return "critical";
    case "Warning":
      return "warning";
    case "Acceptable":
      return "acceptable";
  }
}

function buildSuggestedActions(severity: ThresholdSeverity): readonly string[] {
  const steps = getSuggestedActionSteps(severity);
  return [
    sanitizeExportString(steps.immediate),
    sanitizeExportString(steps.monitoring),
    sanitizeExportString(steps.decision),
  ];
}

export function buildPremiumReportExportPayload(
  schema: PremiumCalculatorSchema,
  result: PremiumSchemaEngineResult,
  locale: SupportedLocale | string = "en",
  generatedAt = new Date().toISOString()
): PremiumReportExportPayload {
  const formatLocale = normalizeLocale(locale);
  const verdict = getVerdictFromThresholds(result.thresholdAlerts);
  const thresholdItems = getThresholdSummary(
    schema,
    result.thresholdAlerts,
    result.outputs,
    formatLocale,
  );
  const severity = worstThresholdSeverity(result.thresholdAlerts);
  const drivers = getHiddenDriverOutputs(result);
  const assumptions = getAssumptionLines(schema);

  return {
    reportId: `${schema.id}-${Date.parse(generatedAt)}`,
    generatedAt,
    schemaSlug: schema.id,
    schemaName: schema.name,
    sectorSlug: schema.sectorSlug,
    title: schema.reportTemplate.title,
    executiveVerdict: {
      status: toExportStatus(verdict.status),
      verdict: sanitizeExportString(verdict.verdict),
      explanation: sanitizeExportString(verdict.explanation),
    },
    bigNumber: {
      label: sanitizeExportString(result.bigNumber.label),
      value: sanitizeExportString(result.bigNumber.formatted),
      rawValue: sanitizeRawValue(result.bigNumber.raw),
      unit: sanitizeExportString(result.bigNumber.unit),
    },
    hiddenDrivers: drivers.map((output) => ({
      label: sanitizeExportString(output.label),
      value: sanitizeExportString(output.formatted),
      rawValue: sanitizeRawValue(output.raw),
      description: sanitizeExportString(getOutputMeaning(output)),
    })),
    thresholds: thresholdItems.map((item) => ({
      label: sanitizeExportString(item.fieldLabel),
      level: item.level,
      value: sanitizeExportString(item.value),
      message: sanitizeExportString(item.message),
    })),
    suggestedActions: buildSuggestedActions(severity),
    assumptions:
      assumptions.length > 0
        ? assumptions.map((line) => sanitizeExportString(line))
        : [NOT_AVAILABLE],
    legalNote: sanitizeExportString(result.legalNote),
  };
}

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildPremiumReportCsvRows(
  payload: PremiumReportExportPayload,
): readonly PremiumReportCsvRow[] {
  const rows: PremiumReportCsvRow[] = [
    {
      section: "executive_verdict",
      label: "status",
      value: payload.executiveVerdict.status,
      description: payload.executiveVerdict.verdict,
    },
    {
      section: "executive_verdict",
      label: "explanation",
      value: payload.executiveVerdict.explanation,
      description: "",
    },
    {
      section: "big_number",
      label: payload.bigNumber.label,
      value: payload.bigNumber.value,
      description: payload.bigNumber.unit,
    },
  ];

  payload.hiddenDrivers.forEach((driver, index) => {
    rows.push({
      section: "hidden_driver",
      label: driver.label || `driver_${index + 1}`,
      value: driver.value,
      description: driver.description,
    });
  });

  payload.thresholds.forEach((threshold) => {
    rows.push({
      section: "threshold",
      label: threshold.label,
      value: `${threshold.level}: ${threshold.value}`,
      description: threshold.message,
    });
  });

  payload.suggestedActions.forEach((action, index) => {
    rows.push({
      section: "action",
      label: String(index + 1),
      value: action,
      description: "",
    });
  });

  payload.assumptions.forEach((assumption, index) => {
    rows.push({
      section: "assumption",
      label: String(index + 1),
      value: assumption,
      description: "",
    });
  });

  rows.push({
    section: "legal",
    label: "legal_note",
    value: payload.legalNote,
    description: TECHNICAL_SIMULATION_NOTICE,
  });

  return rows;
}

export function serializePremiumReportCsv(
  payload: PremiumReportExportPayload,
  locale: SupportedLocale | string = "en",
): string {
  const formatLocale = normalizeLocale(locale);
  const rows = buildPremiumReportCsvRows(payload);
  const header = "section,label,value,description";
  const lines = rows.map((row) =>
    [row.section, row.label, row.value, row.description]
      .map((field) => escapeCsvField(field))
      .join(",")
  );
  return [header, ...lines].join("\n");
}

export function buildPremiumReportSummaryText(
  payload: PremiumReportExportPayload,
  locale: SupportedLocale | string = "en",
): string {
  const formatLocale = normalizeLocale(locale);
  const generatedLabel = formatLocalizedDate(payload.generatedAt, formatLocale);
  const lines: string[] = [
    `SectorCalc - ${payload.schemaName}`,
    payload.title,
    `Report ID: ${payload.reportId}`,
    `Generated: ${generatedLabel}`,
    "",
    `Verdict (${payload.executiveVerdict.status}): ${payload.executiveVerdict.verdict}`,
    payload.executiveVerdict.explanation,
    "",
    `${payload.bigNumber.label}: ${payload.bigNumber.value}${payload.bigNumber.unit ? ` ${payload.bigNumber.unit}` : ""}`,
  ];

  if (payload.hiddenDrivers.length > 0) {
    lines.push("", "Hidden drivers:");
    payload.hiddenDrivers.forEach((driver) => {
      lines.push(`- ${driver.label}: ${driver.value}`);
    });
  }

  if (payload.thresholds.length > 0) {
    lines.push("", "Threshold check:");
    payload.thresholds.forEach((threshold) => {
      lines.push(`- ${threshold.label} (${threshold.level}): ${threshold.value} - ${threshold.message}`);
    });
  }

  lines.push("", "Suggested actions:");
  payload.suggestedActions.forEach((action, index) => {
    lines.push(`${index + 1}. ${action}`);
  });

  lines.push("", "Assumptions:");
  payload.assumptions.forEach((assumption) => {
    lines.push(`- ${assumption}`);
  });

  lines.push("", payload.legalNote);
  lines.push(TECHNICAL_SIMULATION_NOTICE);

  return lines.join("\n");
}
