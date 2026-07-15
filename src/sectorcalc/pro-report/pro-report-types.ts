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
  /** Exact customer-facing decimal precision. Omit to preserve the legacy adaptive formatter. */
  displayDecimals?: number;
}

export interface ReportSection {
  sectionTitle: string;
  priority: number;
  entries: ReportOutputEntry[];
}

export interface ReportInsightRule {
  id: string;
  severity: "critical" | "opportunity" | "info";
  /** Evaluated against raw numeric formula outputs (out_* keys) and raw normalized inputs (n_* keys). */
  when: (outputs: Record<string, number>, rawInputs: Record<string, number>) => boolean;
  message: (outputs: Record<string, number>, rawInputs: Record<string, number>) => string;
}

export interface ReportSensitivityDriver {
  /** normalized_id of the schema input to perturb, e.g. "n_purchase_price" */
  inputId: string;
  label: string;
}

export interface ParetoSegment {
  /** out_* key holding this segment's numeric value (a cost/time/mass component, not a ratio). */
  outputId: string;
  label: string;
}

export interface ParetoBreakdown {
  title: string;
  segments: ParetoSegment[];
}

export interface ProReportContract {
  toolSlug: string;
  sections: ReportSection[];
  primarySection?: ReportSection;
  /** Fail closed when a declared report output is missing or duplicated. */
  strict?: boolean;
  /**
   * Optional narrative insight rules, evaluated server-side against the raw numeric outputs
   * and raw normalized inputs of a single calculate() call. Added 2026-07-15 alongside the
   * machine-hourly-rate-proof-report rebuild -- opt-in per tool, does not affect any tool
   * that doesn't declare insights.
   */
  insights?: ReportInsightRule[];
  /**
   * Optional list of inputs to run a +/-10% sensitivity sweep against (re-invokes calculate()
   * with each input perturbed in isolation, holding all others constant). Opt-in per tool.
   */
  sensitivityDrivers?: ReportSensitivityDriver[];
  /** normalized_id of the primary output to track across the sensitivity sweep. */
  sensitivityTargetOutput?: string;
  /**
   * Optional Pareto/cost-breakdown chart declaration: which raw numeric outputs together
   * decompose one total, ranked by magnitude. Only declare this where the formula genuinely
   * exposes separate component values (not just a dominant-driver index) -- do not invent a
   * breakdown a tool's formula doesn't actually compute.
   */
  paretoBreakdown?: ParetoBreakdown;
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
      displayDecimals?: number;
    }>;
  }>;
  /** Insight rules from the contract whose `when()` matched this calculation's outputs. Empty
   *  array if the tool declares no insights, or none fired. */
  firedInsights: Array<{
    id: string;
    severity: "critical" | "opportunity" | "info";
    message: string;
  }>;
  /** Resolved Pareto breakdown (sorted descending by value), null if the tool doesn't declare one. */
  paretoBreakdown: { title: string; segments: Array<{ label: string; value: number }> } | null;
}

export type ResolvedReportSection = ProReportAdapterResult["resolvedSections"][number];
