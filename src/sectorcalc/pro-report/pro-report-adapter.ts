// SectorCalc PRO V2 — Report Adapter
// Transforms raw formula outputs into structured business-labeled report sections.

import type {
  ProReportAdapterInput,
  ProReportAdapterResult,
  ReportSection,
} from "./pro-report-types";
import { getProReportContract } from "./pro-report-contract-registry";
import { getProReportContractOverride } from "./pro-report-contract-overrides";

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
      return {
        label: entry.businessLabel,
        value: match?.value ?? null,
        unit: match?.unit ?? entry.unit ?? null,
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
