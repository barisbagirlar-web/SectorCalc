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
  if (unit.startsWith("currency/")) {
    return `${displayCurrency}/${unit.slice("currency/".length)}`;
  }

  return unit;
}

function humanizeInputId(inputId: string): string {
  return inputId
    .replace(/^n_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function unwrapRawInput(
  raw: unknown,
): string | number | boolean | null {
  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean"
  ) {
    return raw;
  }
  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    const candidate = record.display_value ?? record.base_value ?? record.value;
    if (
      typeof candidate === "string" ||
      typeof candidate === "number" ||
      typeof candidate === "boolean"
    ) {
      return candidate;
    }
  }
  return null;
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

  for (const output of input.outputs) {
    outputCounts.set(output.id, (outputCounts.get(output.id) ?? 0) + 1);
    outputMap.set(output.id, { value: output.value, unit: output.unit ?? null });
  }

  if (contract.strict) {
    const requiredOutputIds = new Set(
      contract.sections.flatMap((reportSection) =>
        reportSection.entries.map((reportEntry) => reportEntry.sourceOutputId),
      ),
    );

    for (const outputId of requiredOutputIds) {
      const match = outputMap.get(outputId);
      if (!match || match.value === null || outputCounts.get(outputId) !== 1) {
        return null;
      }
      if (typeof match.value === "number" && !Number.isFinite(match.value)) {
        return null;
      }
    }
  }

  const resolvedSections = contract.sections.map((reportSection: ReportSection) => {
    const entries = reportSection.entries.map((reportEntry) => {
      const match = outputMap.get(reportEntry.sourceOutputId);
      const value = resolveReportValue(
        match?.value,
        reportEntry.valueLabels,
        reportEntry.valueMultiplier,
      );
      return {
        label: reportEntry.businessLabel,
        value,
        unit:
          typeof value === "string" && reportEntry.valueLabels
            ? null
            : resolveReportUnit(
                match?.unit ?? null,
                reportEntry.unit,
                input.displayCurrency,
              ),
        explanation: reportEntry.explanation ?? null,
        displayDecimals: reportEntry.displayDecimals,
      };
    });

    return {
      sectionTitle: reportSection.sectionTitle,
      priority: reportSection.priority,
      entries,
    };
  });

  const inputTraceEntries = Object.entries(input.rawInputs)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([inputId, raw]) => {
      const value = unwrapRawInput(raw);
      const selectedUnit = input.selectedUnits[inputId] ?? null;
      return {
        label: humanizeInputId(inputId),
        value,
        unit: resolveReportUnit(
          selectedUnit,
          selectedUnit ?? undefined,
          input.displayCurrency,
        ),
        explanation: null,
      };
    });

  if (inputTraceEntries.length > 0) {
    resolvedSections.push({
      sectionTitle: "Input Trace",
      priority: 90,
      entries: inputTraceEntries,
    });
  }

  resolvedSections.sort((a, b) => a.priority - b.priority);

  return {
    contract,
    resolvedSections,
  };
}
