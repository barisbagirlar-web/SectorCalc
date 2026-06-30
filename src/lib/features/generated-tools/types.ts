import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

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

export type GeneratedToolAboutDescription = {
  readonly short: string;
  readonly long: string;
  readonly short_i18n?: GeneratedToolI18nText;
  readonly long_i18n?: GeneratedToolI18nText;
};

export type GeneratedToolAboutExample = {
  readonly title: string;
  readonly scenario: string;
  readonly steps: readonly string[];
  readonly result: string;
  readonly title_i18n?: GeneratedToolI18nText;
  readonly scenario_i18n?: GeneratedToolI18nText;
  readonly steps_i18n?: Readonly<Partial<Record<SupportedLocale, readonly string[]>>>;
  readonly result_i18n?: GeneratedToolI18nText;
};

export type GeneratedToolAboutFaq = {
  readonly question: string;
  readonly answer: string;
  readonly question_i18n?: GeneratedToolI18nText;
  readonly answer_i18n?: GeneratedToolI18nText;
};

export type GeneratedToolAboutContent = {
  readonly description: GeneratedToolAboutDescription;
  readonly example?: GeneratedToolAboutExample;
  readonly faqs?: readonly GeneratedToolAboutFaq[];
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
  /** Taxonomy sector id from assign-sector-profession-category (e.g. makine). */
  readonly sectorId?: string;
  /** Taxonomy calculation-type category id (e.g. efficiency). */
  readonly categoryId?: string;
  /** Turkish sector label snapshot on schema. */
  readonly sector?: string;
  /** Turkish category label snapshot on schema. */
  readonly category?: string;
  /** Assigned profession label (Turkish source). */
  readonly profession?: string;
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
    /** Display unit for the primary result (e.g. MB, kg, %). */
    readonly unit?: string;
    readonly breakdown: Readonly<Record<string, string>>;
    /**
     * Locale-aware breakdown labels keyed by breakdown id.
     * Falls back to `breakdown` key for missing locales.
     * Example: { en: { materialCost: "Material Cost" }, tr: { materialCost: "Malzeme Maliyeti" } }
     */
    readonly breakdown_i18n?: Partial<Record<SupportedLocale, Readonly<Record<string, string>>>>;
    /** Formula/output units keyed by breakdown id (e.g. minutes, %, dimensionless). */
    readonly breakdownUnits?: Readonly<Record<string, string>>;
    readonly hiddenLossDrivers: readonly string[];
    readonly suggestedActions: readonly string[];
    readonly dataConfidenceAdjusted: string;
  };
  readonly premiumFeatures: readonly string[];
  readonly premiumRequired: boolean;
  readonly cbam?: {
    readonly enabled: boolean;
    readonly description?: string;
  };
  readonly about?: GeneratedToolAboutContent;
};

export type GeneratedToolBreakdown = Readonly<Record<string, number | undefined>>;

export type GeneratedToolResult = {
  readonly breakdown: GeneratedToolBreakdown;
  readonly hiddenLossDrivers: readonly string[];
  readonly suggestedActions: readonly string[];
  readonly dataConfidenceAdjusted: number;
  readonly premiumRequired: boolean;
  readonly premiumFeatures: readonly string[];
  /** Display unit for the primary result (e.g. MB, kg, %). */
  readonly unit: string;
  /** Trust Trace verification hash — enables public result verification */
  readonly trustTrace?: {
    readonly hash: string;
    readonly verificationUrl: string;
    readonly timestamp: string;
  };
  readonly [key: string]: unknown;
};

export type TrustGateStatus = "PASS" | "WARN" | "FAIL" | "RUNTIME_FAIL" | "QUARANTINE";

export type GeneratedCalculatorModule = {
  readonly inputSchema: import("zod").ZodTypeAny;
  readonly calculate: (input: Record<string, unknown>) => GeneratedToolResult;
  readonly trustStatus?: TrustGateStatus;
};

export type GeneratedInputGroup = {
  readonly id: string;
  readonly title: string;
  readonly inputIds: readonly string[];
};
