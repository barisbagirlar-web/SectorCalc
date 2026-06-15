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
  readonly businessContext: string;
  readonly businessContext_i18n?: GeneratedToolI18nText;
  readonly group?: string;
};

export type GeneratedToolSchema = {
  readonly toolName: string;
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
