// SectorCalc PRO V2 — Report Adapter
// Transforms raw formula outputs into structured business-labeled report sections.

import type {
  ProReportAdapterInput,
  ProReportAdapterResult,
  ReportSection,
} from "./pro-report-types";
import { getProReportContract } from "./pro-report-contract-registry";
import { getProReportContractOverride } from "./pro-report-contract-overrides";

function resolveReportValue(
  value: string | number | boolean | null | undefined,
  valueLabels?: Record<string, string>,
  valueMultiplier?: number,
): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (valueLabels) return valueLabels[String(value)] ?? value;
  if (
    typeof value === "number" &&
    typeof valueMultiplier === "number" &&
    Number.isFinite(valueMultiplier)
  ) {
    return value * valueMultiplier;
  }
  return value;
}

function resolveReportUnit(
  sourceUnit: string | null,
  contractUnit: string | undefined,
  displayCurrency: string | null | undefined,
): string | null {
  const unit = sourceUnit ?? contractUnit ?? null;
  if (!unit || !displayCurrency) return unit;

  if (unit === "currency") return displayCurrency;
  if (unit === "currency/month") return `${displayCurrency}/month`;
  if (unit === "currency/hour") return `${displayCurrency}/hour`;
  if (unit === "currency/unit") return `${displayCurrency}/unit`;

  return unit;
}

export function buildProReport(input: ProReportAdapterInput): ProReportAdapterResult | null {
  const contract =
    getProReportContractOverride(input.toolSlug) ??
    getProReportContract(input.toolSlug);
  if (!contract) return null;

  const outputMap = new Map<
    string,
    { value: string | number | boolean | null; unit: string | null }
  >();
  const outputCounts = new Map<string, number>();
  // Raw numeric lookup for insight rules -- separate from outputMap because insight `when`/
  // `message` functions need plain numbers (out_x > 0.15), not the display-formatted/relabeled
  // values entries.value can hold (valueLabels, valueMultiplier, currency symbols, etc).
  const numericOutputs: Record<string, number> = {};

  for (const output of input.outputs) {
    outputCounts.set(output.id, (outputCounts.get(output.id) ?? 0) + 1);
    outputMap.set(output.id, { value: output.value, unit: output.unit ?? null });
    if (typeof output.value === "number" && Number.isFinite(output.value)) {
      numericOutputs[output.id] = output.value;
    }
  }

  if (contract.strict) {
    const requiredOutputIds = new Set(
      contract.sections.flatMap((section) =>
        section.entries.map((entry) => entry.sourceOutputId),
      ),
    );

    for (const outputId of requiredOutputIds) {
      const match = outputMap.get(outputId);
      if (!match || match.value === null || outputCounts.get(outputId) !== 1) {
        return null;
      }
    }
  }

  const resolvedSections = contract.sections.map((section: ReportSection) => {
    const entries = section.entries.map((entry) => {
      const match = outputMap.get(entry.sourceOutputId);
      const value = resolveReportValue(
        match?.value,
        entry.valueLabels,
        entry.valueMultiplier,
      );
      return {
        label: entry.businessLabel,
        value,
        unit:
          typeof value === "string" && entry.valueLabels
            ? null
            : resolveReportUnit(
                match?.unit ?? null,
                entry.unit,
                input.displayCurrency,
              ),
        explanation: entry.explanation ?? null,
        displayDecimals: entry.displayDecimals,
      };
    });

    return {
      sectionTitle: section.sectionTitle,
      priority: section.priority,
      entries,
    };
  });

  resolvedSections.sort((a, b) => a.priority - b.priority);

  const numericRawInputs: Record<string, number> = {};
  for (const [key, value] of Object.entries(input.rawInputs)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      numericRawInputs[key] = value;
    }
  }

  const firedInsights = (contract.insights ?? [])
    .filter((rule) => {
      try {
        return rule.when(numericOutputs, numericRawInputs);
      } catch {
        // A rule referencing an output this tool doesn't produce must not crash the report.
        return false;
      }
    })
    .map((rule) => ({
      id: rule.id,
      severity: rule.severity,
      message: rule.message(numericOutputs, numericRawInputs),
    }));

  let paretoBreakdown: ProReportAdapterResult["paretoBreakdown"] = null;
  if (contract.paretoBreakdown) {
    const segments = contract.paretoBreakdown.segments
      .map((seg) => ({ label: seg.label, value: numericOutputs[seg.outputId] }))
      .filter((seg): seg is { label: string; value: number } => typeof seg.value === "number" && Number.isFinite(seg.value) && seg.value >= 0)
      .sort((a, b) => b.value - a.value);
    if (segments.length > 0) {
      paretoBreakdown = { title: contract.paretoBreakdown.title, segments };
    }
  }

  return {
    contract,
    resolvedSections,
    firedInsights,
    paretoBreakdown,
  };
}
