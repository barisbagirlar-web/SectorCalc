/**
 * Premium decision report formatting — pure helpers, no formula logic.
 */

import type {
  PremiumCalculatorSchema,
  PremiumOutputFormat,
  PremiumSchemaEngineResult,
  SchemaPipelineOutput,
  ThresholdAlert,
  ThresholdSeverity,
} from "@/lib/premium-schema/premium-calculator-schema";

export type ExecutiveVerdictStatus = "Critical" | "Warning" | "Acceptable";

export interface ExecutiveVerdict {
  readonly status: ExecutiveVerdictStatus;
  readonly severity: ThresholdSeverity;
  readonly verdict: string;
  readonly explanation: string;
}

export type ThresholdLevel = "critical" | "warning" | "safe";

export interface ThresholdSummaryItem {
  readonly fieldId: string;
  readonly fieldLabel: string;
  readonly level: ThresholdLevel;
  readonly value: string;
  readonly message: string;
}

export interface SuggestedActionSteps {
  readonly immediate: string;
  readonly monitoring: string;
  readonly decision: string;
}

const VERDICT_COPY: Record<
  ThresholdSeverity,
  { status: ExecutiveVerdictStatus; verdict: string; explanation: string }
> = {
  critical: {
    status: "Critical",
    verdict: "Hidden loss is above the critical threshold.",
    explanation:
      "Review the main driver before accepting similar work or repeating this process.",
  },
  warning: {
    status: "Warning",
    verdict: "Loss exposure is close to the warning threshold.",
    explanation:
      "Track this variable before pricing, scheduling or approving the next cycle.",
  },
  ok: {
    status: "Acceptable",
    verdict: "Current inputs are inside the acceptable range.",
    explanation:
      "Keep monitoring the main driver and compare it against future cycles.",
  },
};

const ACTION_STEPS: Record<ThresholdSeverity, SuggestedActionSteps> = {
  critical: {
    immediate: "Stop treating this as normal operating cost.",
    monitoring: "Find the input driving the threshold.",
    decision: "Reprice, reschedule or redesign before repeating this work.",
  },
  warning: {
    immediate: "Track the driver for one cycle.",
    monitoring: "Compare against threshold.",
    decision: "Adjust before scaling.",
  },
  ok: {
    immediate: "Keep the baseline.",
    monitoring: "Monitor after next cycle.",
    decision: "Use as reference for similar jobs.",
  },
};

const BIG_NUMBER_MEANING: Record<PremiumOutputFormat, string> = {
  currency: "This is the primary exposure estimated from the current inputs.",
  percentage: "This is the main operating score or drift ratio based on current inputs.",
  number: "This is the primary metric estimated from the current inputs.",
  duration: "This is the primary time exposure based on the current inputs.",
  score: "This is the main operating score based on the current inputs.",
};

const OUTPUT_MEANING: Record<PremiumOutputFormat, string> = {
  currency: "Cost or exposure component in this analysis.",
  percentage: "Ratio or drift relative to target band.",
  number: "Supporting quantity in the loss stack.",
  duration: "Time-based exposure component.",
  score: "Operating score component.",
};

export function formatPremiumValue(
  value: number,
  format: PremiumOutputFormat,
  unit: string,
  locale = "en"
): string {
  const safe = Number.isFinite(value) ? value : 0;

  switch (format) {
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(safe);
    case "percentage":
      return `${safe.toFixed(1)}%`;
    case "duration":
      return `${safe.toFixed(1)} h`;
    case "score":
      return safe.toFixed(2);
    default:
      return unit
        ? `${safe.toLocaleString(locale, { maximumFractionDigits: 2 })} ${unit}`.trim()
        : safe.toFixed(2);
  }
}

export function worstSeverityFromAlerts(
  alerts: readonly ThresholdAlert[]
): ThresholdSeverity {
  if (alerts.some((alert) => alert.severity === "critical")) {
    return "critical";
  }
  if (alerts.some((alert) => alert.severity === "warning")) {
    return "warning";
  }
  return "ok";
}

export function getVerdictFromThresholds(
  alerts: readonly ThresholdAlert[]
): ExecutiveVerdict {
  const severity = worstSeverityFromAlerts(alerts);
  const copy = VERDICT_COPY[severity];
  return {
    status: copy.status,
    severity,
    verdict: copy.verdict,
    explanation: copy.explanation,
  };
}

function resolveFieldLabel(schema: PremiumCalculatorSchema, fieldId: string): string {
  const input = schema.inputs.find((item) => item.id === fieldId);
  if (input) {
    return input.label;
  }
  const output = schema.outputs.find((item) => item.id === fieldId);
  if (output) {
    return output.label;
  }
  return fieldId;
}

export function getThresholdSummary(
  schema: PremiumCalculatorSchema,
  alerts: readonly ThresholdAlert[],
  outputs: readonly SchemaPipelineOutput[]
): readonly ThresholdSummaryItem[] {
  if (schema.thresholds.length === 0) {
    return [];
  }

  const alertByField = new Map(alerts.map((alert) => [alert.fieldId, alert]));

  return schema.thresholds.map((rule) => {
    const alert = alertByField.get(rule.fieldId);
    const output = outputs.find((item) => item.id === rule.fieldId);
    const value = alert
      ? formatPremiumValue(alert.value, output?.format ?? "number", output?.unit ?? "", "en")
      : output?.formatted ?? "—";

    if (alert?.severity === "critical") {
      return {
        fieldId: rule.fieldId,
        fieldLabel: resolveFieldLabel(schema, rule.fieldId),
        level: "critical" as const,
        value,
        message: alert.message,
      };
    }

    if (alert?.severity === "warning") {
      return {
        fieldId: rule.fieldId,
        fieldLabel: resolveFieldLabel(schema, rule.fieldId),
        level: "warning" as const,
        value,
        message: alert.message,
      };
    }

    return {
      fieldId: rule.fieldId,
      fieldLabel: resolveFieldLabel(schema, rule.fieldId),
      level: "safe" as const,
      value,
      message: "Inside acceptable range.",
    };
  });
}

export function getSuggestedActionSteps(severity: ThresholdSeverity): SuggestedActionSteps {
  return ACTION_STEPS[severity];
}

export function getBigNumberMeaning(format: PremiumOutputFormat): string {
  return BIG_NUMBER_MEANING[format];
}

export function getOutputMeaning(output: SchemaPipelineOutput): string {
  return OUTPUT_MEANING[output.format];
}

export function getHiddenDriverOutputs(
  result: PremiumSchemaEngineResult
): readonly SchemaPipelineOutput[] {
  return result.outputs.filter((output) => !output.isBigNumber);
}

export function getAssumptionLines(schema: PremiumCalculatorSchema): readonly string[] {
  return schema.assumptions.assumptionNotes;
}

export function reportPreviewSections(): readonly string[] {
  return [
    "Executive summary",
    "Loss breakdown",
    "Threshold check",
    "Suggested action",
    "Assumptions",
    "PDF/export ready",
  ];
}

export function formatResultStrings(result: PremiumSchemaEngineResult): string {
  return [
    result.executiveSummary,
    result.suggestedAction,
    result.legalNote,
    ...result.outputs.map((output) => output.formatted),
    String(result.p90Exposure),
    String(result.minimumSafePrice),
    result.bigNumber.formatted,
  ].join(" ");
}

export function hasInvalidResultStrings(result: PremiumSchemaEngineResult): boolean {
  const joined = formatResultStrings(result);
  return /\bNaN\b/.test(joined) || /\bInfinity\b/i.test(joined);
}
