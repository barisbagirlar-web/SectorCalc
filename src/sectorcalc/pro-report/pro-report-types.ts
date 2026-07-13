// SectorCalc PRO V2 — Tool-Specific Report Types

export type ReportOutputFormat = "currency" | "percentage" | "ratio" | "number" | "string" | "boolean" | "hourly_rate";

export interface ReportOutputEntry {
  /** Formula output ID declared by the tool schema. */
  sourceOutputId: string;
  /** Business label shown to the user. */
  businessLabel: string;
  /** Optional override for the display format. */
  format?: ReportOutputFormat;
  /** Optional unit override. */
  unit?: string;
  /** Optional explanation/context shown below the value. */
  explanation?: string;
  /** Optional semantic mapping for encoded outputs such as 0/1/2 decision states. */
  valueLabels?: Record<string, string>;
  /** Optional explicit display scaling. Example: ratio × 100 for percent display. */
  valueMultiplier?: number;
}

export interface ReportSection {
  sectionTitle: string;
  priority: number;
  entries: ReportOutputEntry[];
}

export interface ProReportContract {
  toolSlug: string;
  sections: ReportSection[];
  primarySection?: ReportSection;
}

export interface ProReportAdapterInput {
  toolSlug: string;
  outputs: Array<{ id: string; name: string; value: string | number | boolean | null; unit?: string }>;
  rawInputs: Record<string, string | number | boolean | null>;
  selectedUnits: Record<string, string>;
  displayCurrency?: string | null;
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
