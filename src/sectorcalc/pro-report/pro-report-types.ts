// SectorCalc PRO V2 — Tool-Specific Report Types

export type ReportOutputFormat = "currency" | "percentage" | "ratio" | "number" | "string" | "boolean" | "hourly_rate";

export interface ReportOutputEntry {
  /** Generic output ID from formula (e.g. "out_demand_metric") */
  sourceOutputId: string;
  /** Business label shown to user (e.g. "Wire / Electrode Cost") */
  businessLabel: string;
  /** Optional override for the display format */
  format?: ReportOutputFormat;
  /** Optional unit override */
  unit?: string;
  /** Optional explanation/context shown below the value */
  explanation?: string;
}

export interface ReportSection {
  /** Section title (e.g. "Cost Breakdown") */
  sectionTitle: string;
  /** Section priority for ordering (lower = first) */
  priority: number;
  /** Output entries in this section */
  entries: ReportOutputEntry[];
}

export interface ProReportContract {
  toolSlug: string;
  sections: ReportSection[];
  /** Optional summary/primary headline metrics shown at the top */
  primarySection?: ReportSection;
}

export interface ProReportAdapterInput {
  toolSlug: string;
  outputs: Array<{ id: string; name: string; value: string | number | boolean | null; unit?: string }>;
  rawInputs: Record<string, string | number | boolean | null>;
  selectedUnits: Record<string, string>;
}

export interface ProReportAdapterResult {
  contract: ProReportContract;
  resolvedSections: Array<{
    sectionTitle: string;
    priority: number;
    entries: Array<{
      label: string;
      value: string | number | boolean | null;
      unit: string | null;
      explanation: string | null;
    }>;
  }>;
}

export type ResolvedReportSection = ProReportAdapterResult["resolvedSections"][number];
