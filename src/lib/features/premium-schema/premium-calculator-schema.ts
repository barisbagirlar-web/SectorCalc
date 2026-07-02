/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable */
// @ts-nocheck — Premium Schema types (locked type system)

/**
 * SectorCalc Premium Schema Engine v1 — schema types.
 *
 * Architecture contract:
 * - Dynamic UI renders; never calculates.
 * - Schema defines inputs, thresholds, report — NO expressions.
 * - Safe Formula Registry executes typed functions by formulaId.
 * - Schema Linter validates before build.
 */

import type { FormulaFamilyId } from "@/lib/features/premium-schema/formula-families";


export type { PremiumCalculatorCategory } from "@/lib/features/premium-schema/formula-families";

export type PremiumInputType = "number" | "select" | "slider" | "boolean";

export type PremiumOutputFormat =
  | "currency"
  | "percentage"
  | "number"
  | "duration"
  | "score";

export type ThresholdDirection = "higher_is_bad" | "lower_is_bad";

export type ReportSectionId =
  | "executive_summary"
  | "loss_breakdown"
  | "thresholds"
  | "sensitivity"
  | "action_plan"
  | "assumptions";

export type ExportFormat = "pdf" | "excel" | "csv";

export interface PremiumInputSchema {
  readonly id: string;
  readonly label: string;
  /** Optional 6-locale label map (en, tr, de, fr, es, ar) — falls back to label */
  readonly label_i18n?: Readonly<Record<string, string>>;
  readonly type: PremiumInputType;
  readonly unit: string;
  readonly placeholder?: string;
  readonly group?: string;
  readonly required?: boolean;
  readonly smartDefault?: number | string | boolean;
  readonly array?: boolean;
  readonly matrix?: boolean;
  readonly enumValues?: readonly string[];
  readonly validation?: {
    readonly min?: number;
    readonly max?: number;
    readonly step?: number;
  };
  readonly helper?: string;
  /** Optional 6-locale helper map (en, tr, de, fr, es, ar) — falls back to helper */
  readonly helper_i18n?: Readonly<Record<string, string>>;
  readonly expertMeaning?: string;
  /** Optional 6-locale expertMeaning map */
  readonly expertMeaning_i18n?: Readonly<Record<string, string>>;
  readonly options?: readonly { readonly value: string; readonly label: string }[];
}

export interface FormulaPipelineStep {
  readonly formulaId: string;
  /** Optional override when step uses a cross-family formula intentionally. */
  readonly formulaFamily?: FormulaFamilyId;
  readonly inputMap: Readonly<Record<string, string>>;
  readonly outputId: string;
}

export interface PremiumOutputSchema {
  readonly id: string;
  readonly label: string;
  /** Optional 6-locale label map */
  readonly label_i18n?: Readonly<Record<string, string>>;
  readonly unit: string;
  readonly format: PremiumOutputFormat;
  readonly isBigNumber?: boolean;
}

export interface PremiumThresholdSchema {
  readonly fieldId: string;
  readonly warning: number;
  readonly critical: number;
  readonly direction: ThresholdDirection;
  readonly warningMessage: string;
  /** Optional 6-locale warningMessage map */
  readonly warningMessage_i18n?: Readonly<Record<string, string>>;
  readonly criticalMessage: string;
  /** Optional 6-locale criticalMessage map */
  readonly criticalMessage_i18n?: Readonly<Record<string, string>>;
}

export interface PremiumReportTemplate {
  readonly title: string;
  /** Optional 6-locale title map */
  readonly title_i18n?: Readonly<Record<string, string>>;
  readonly sections: readonly ReportSectionId[];
  readonly exportFormats: readonly ExportFormat[];
}

export interface SectorAssumptionPack {
  readonly hiddenLossMultiplier: number;
  readonly volatilityPercent: number;
  readonly targetMarginPercent: number;
  readonly assumptionNotes: readonly string[];
  /** Optional 6-locale assumption notes array — parallel to assumptionNotes */
  readonly assumptionNotes_i18n?: readonly Readonly<Record<string, string>>[];
}

export interface PremiumCalculatorSchema {
  readonly id: string;
  readonly name: string;
  /** Optional 6-locale name map */
  readonly name_i18n?: Readonly<Record<string, string>>;
  readonly sectorSlug: string;
  readonly category: FormulaFamilyId;
  readonly painStatement: string;
  /** Optional 6-locale painStatement map */
  readonly painStatement_i18n?: Readonly<Record<string, string>>;
  readonly inputs: readonly PremiumInputSchema[];
  readonly formulaPipeline?: readonly FormulaPipelineStep[];
  readonly outputs: readonly PremiumOutputSchema[];
  readonly thresholds: readonly PremiumThresholdSchema[];
  readonly reportTemplate: PremiumReportTemplate;
  readonly assumptions: SectorAssumptionPack;
  readonly legacyPaidSlug?: string;
}

export type SchemaInputValues = Record<string, number | string | boolean | number[]>;

export type ThresholdSeverity = "ok" | "warning" | "critical";

export interface ThresholdAlert {
  readonly fieldId: string;
  readonly severity: ThresholdSeverity;
  readonly message: string;
  readonly value: number;
}

export interface SchemaPipelineOutput {
  readonly id: string;
  readonly label: string;
  readonly unit: string;
  readonly format: PremiumOutputFormat;
  readonly raw: number;
  readonly formatted: string;
  readonly isBigNumber: boolean;
}

export interface SchemaReportSection {
  readonly id: ReportSectionId;
  readonly title: string;
  readonly body: string;
}

export interface PremiumSchemaEngineResult {
  readonly schemaId: string;
  readonly schemaName: string;
  readonly outputs: readonly SchemaPipelineOutput[];
  readonly bigNumber: SchemaPipelineOutput;
  readonly thresholdAlerts: readonly ThresholdAlert[];
  readonly reportSections: readonly SchemaReportSection[];
  readonly executiveSummary: string;
  readonly suggestedAction: string;
  readonly legalNote: string;
  readonly p90Exposure: number;
  readonly p90ExposureFormatted: string;
  readonly minimumSafePrice: number;
  readonly minimumSafePriceFormatted: string;
}
