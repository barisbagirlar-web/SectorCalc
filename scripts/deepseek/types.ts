export type ToolDiscoverySource =
  | "revenue-tools"
  | "formula-governance-contract"
  | "formula-governance-locator";

export type DiscoveredTool = {
  readonly slug: string;
  readonly sources: readonly ToolDiscoverySource[];
  readonly contextSnippet: string;
  /** Set when slug appears in revenue-tools as freeSlug or paidSlug. */
  readonly revenueRole?: "free" | "paid";
  /** Revenue registry field hint for premium filtering (e.g. paidSlug). */
  readonly source?: string;
};

export type ScannedToolInput = {
  readonly id: string;
  readonly label: string;
  readonly type: string;
  readonly unit: string;
  readonly required: boolean;
};

export type ScannedToolOutput = {
  readonly id: string;
  readonly label: string;
  readonly unit: string;
  readonly format: string;
};

export type DeepSeekToolScanPayload = {
  readonly slug: string;
  readonly schema: {
    readonly inputs: readonly ScannedToolInput[];
    readonly outputs: readonly ScannedToolOutput[];
    readonly formulaSummary: string;
    readonly validationRules: readonly string[];
    readonly assumptions: readonly string[];
  };
  readonly audit: {
    readonly riskLevel: "low" | "medium" | "high" | "critical";
    readonly formulaConsistent: boolean;
    readonly safeForCalculation: boolean;
    readonly findings: readonly string[];
    readonly recommendedActions: readonly string[];
  };
};

export type IndustrialToolInput = {
  readonly id: string;
  readonly label: string;
  readonly type: "number" | "select" | "boolean";
  readonly unit: string;
  readonly default?: number | string | boolean;
  readonly min?: number | null;
  readonly max?: number | null;
  readonly options?: readonly string[] | null;
  readonly businessContext: string;
};

export type IndustrialToolSchema = {
  readonly toolName: string;
  readonly inputs: readonly IndustrialToolInput[];
  readonly validation: {
    readonly rules: readonly string[];
    readonly thresholds: Readonly<Record<string, string>>;
  };
  readonly formulas: Readonly<Record<string, string>>;
  readonly outputs: {
    readonly primary: string;
    readonly breakdown: Readonly<Record<string, string>>;
    readonly hiddenLossDrivers: readonly string[];
    readonly suggestedActions: readonly string[];
    readonly dataConfidenceAdjusted: string;
  };
  readonly premiumFeatures: readonly string[];
  readonly premiumRequired: boolean;
};

export type ToolScanRecord = {
  readonly slug: string;
  readonly sources: readonly ToolDiscoverySource[];
  readonly scannedAt: string;
  readonly model: string;
  readonly ok: boolean;
  readonly error?: string;
  readonly schemaPath?: string;
  readonly payload?: DeepSeekToolScanPayload;
  readonly industrialSchema?: IndustrialToolSchema;
  readonly outputs?: readonly ScannedToolOutput[];
};

export type ScanProgressDocument = {
  readonly generatedAt: string;
  readonly generator: "scripts/deepseek/scan-tools.ts";
  readonly summary: {
    readonly discovered: number;
    readonly scanned: number;
    readonly succeeded: number;
    readonly failed: number;
  };
  readonly tools: readonly ToolScanRecord[];
};

export type ToolsSchemaDocument = {
  readonly generatedAt: string;
  readonly generator: "scripts/deepseek/scan-tools.ts";
  readonly summary: {
    readonly discovered: number;
    readonly scanned: number;
    readonly succeeded: number;
    readonly failed: number;
  };
  readonly tools: readonly ToolScanRecord[];
};

export type DeepSeekScannedFormulaEntry = {
  readonly slug: string;
  readonly formulaSummary: string;
  readonly riskLevel: "low" | "medium" | "high" | "critical";
  readonly safeForCalculation: boolean;
  readonly formulaConsistent: boolean;
  readonly inputCount: number;
  readonly outputCount: number;
  readonly scannedAt: string;
};
