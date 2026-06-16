import type { SupportedLocale } from "@/lib/i18n/locale-config";

export type GeneratedToolInputType = "number" | "select" | "boolean";

/** Per-locale copy for generated tool schema fields (scan output). */
export type GeneratedToolI18nText = Readonly<
  Partial<Record<SupportedLocale, string>> & {
    readonly en: string;
  }
>;

export type GeneratedToolStandardOption = {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
};

export type GeneratedToolInput = {
  readonly id: string;
  readonly label: string;
  readonly label_i18n?: GeneratedToolI18nText;
  readonly type: GeneratedToolInputType;
  readonly unit: string;
  readonly default?: number | string | boolean;
  readonly min?: number | null;
  readonly max?: number | null;
  readonly options?: readonly string[] | null;
  readonly optionLabels?: Readonly<Record<string, string>>;
  readonly businessContext: string;
  readonly businessContext_i18n?: GeneratedToolI18nText;
  readonly group?: string;
};

export type GeneratedToolSchema = {
  readonly toolName: string;
  /** Free-traffic catalog category (e.g. finance-business). */
  readonly catalogCategory?: string;
  /** Industry hub slug for sector pages (e.g. cnc-manufacturing). */
  readonly sectorSlug?: string;
  /** Premium 152 global category slug (e.g. lean-production). */
  readonly categorySlug?: string;
  /** Optional ISO date (YYYY-MM-DD) when formulas/inputs were last reviewed. */
  readonly lastUpdated?: string;
  readonly standardOptions?: readonly GeneratedToolStandardOption[];
  readonly inputs: readonly GeneratedToolInput[];
  readonly validation: {
    readonly rules: readonly string[];
    readonly thresholds: Readonly<Record<string, unknown>>;
  };
  readonly formulas: Readonly<Record<string, string>>;
  readonly outputs: {
    readonly primary: string;
    readonly breakdown: Readonly<Record<string, string>>;
    /** Formula/output units keyed by breakdown id (e.g. minutes, %, dimensionless). */
    readonly breakdownUnits?: Readonly<Record<string, string>>;
    readonly hiddenLossDrivers: readonly string[];
    readonly suggestedActions: readonly string[];
    readonly dataConfidenceAdjusted: string;
  };
  readonly premiumFeatures: readonly string[];
  readonly premiumRequired: boolean;
};

export type GeneratedToolBreakdown = Readonly<Record<string, number | undefined>>;

export type GeneratedToolResult = {
  readonly breakdown: GeneratedToolBreakdown;
  readonly hiddenLossDrivers: readonly string[];
  readonly suggestedActions: readonly string[];
  readonly dataConfidenceAdjusted: number;
  readonly premiumRequired: boolean;
  readonly premiumFeatures: readonly string[];
  readonly [key: string]: unknown;
};

export type GeneratedCalculatorModule = {
  readonly inputSchema: import("zod").ZodTypeAny;
  readonly calculate: (input: Record<string, unknown>) => GeneratedToolResult;
};

export type GeneratedInputGroup = {
  readonly id: string;
  readonly title: string;
  readonly inputIds: readonly string[];
};
