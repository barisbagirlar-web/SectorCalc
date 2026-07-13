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

  const outputMap = new Map<string, { value: string | number | boolean | null; unit: string | null }>();
  for (const out of input.outputs) {
    outputMap.set(out.id, { value: out.value, unit: out.unit ?? null });
  }

  const resolvedSections = contract.sections.map((section: ReportSection) => {
    const entries = section.entries.map((entry) => {
      const match = outputMap.get(entry.sourceOutputId);
      const value = resolveReportValue(match?.value, entry.valueLabels, entry.valueMultiplier);
      return {
        label: entry.businessLabel,
        value,
        unit:
          typeof value === "string" && entry.valueLabels
            ? null
            : resolveReportUnit(match?.unit ?? null, entry.unit, input.displayCurrency),
        explanation: entry.explanation ?? null,
      };
    });

    return {
      sectionTitle: section.sectionTitle,
      priority: section.priority,
      entries,
    };
  });

  resolvedSections.sort((a, b) => a.priority - b.priority);

  return {
    contract,
    resolvedSections,
  };
}
