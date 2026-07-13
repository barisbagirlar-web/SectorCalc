// SectorCalc PRO V2 — Tool-Specific Report Types

export type ReportOutputFormat =
  | "currency"
  | "percentage"
  | "ratio"
  | "number"
  | "string"
  | "boolean"
  | "hourly_rate";

export interface ReportOutputEntry {
  sourceOutputId: string;
  businessLabel: string;
  format?: ReportOutputFormat;
  unit?: string;
  explanation?: string;
  valueLabels?: Record<string, string>;
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
  /** Fail closed when a declared report output is missing or duplicated. */
  strict?: boolean;
}

export interface ProReportAdapterInput {
  toolSlug: string;
  outputs: Array<{
    id: string;
    name: string;
    value: string | number | boolean | null;
    unit?: string;
  }>;
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
