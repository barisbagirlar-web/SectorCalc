import type { ToolArchetype } from "@/lib/decision-engine/decision-engine-types";

export const SEMANTIC_LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;

export type SemanticLocale = (typeof SEMANTIC_LOCALES)[number];

export type SemanticToolTier = "free" | "premium" | "premium-schema";

export type SemanticValueType = "number" | "text" | "select" | "boolean";

export type SemanticLocaleRecord = Record<string, string>;

export type SemanticInputParameter = {
  readonly key: string;
  readonly label: SemanticLocaleRecord;
  readonly description: SemanticLocaleRecord;
  readonly unitGroup?: string;
  readonly unitText?: string;
  readonly required: boolean;
  readonly valueType: SemanticValueType;
};

export type SemanticOutputParameter = {
  readonly key: string;
  readonly label: SemanticLocaleRecord;
  readonly description: SemanticLocaleRecord;
  readonly unitText?: string;
};

export type SemanticToolContract = {
  readonly toolSlug: string;
  readonly localeAwareSlug?: Record<string, string>;
  readonly title: SemanticLocaleRecord;
  readonly description: SemanticLocaleRecord;
  readonly tier: SemanticToolTier;
  readonly category: string;
  readonly sector?: string;
  readonly archetype: ToolArchetype;
  readonly urlPath: string;
  readonly imagePath?: string;
  readonly inputParameters: readonly SemanticInputParameter[];
  readonly outputParameters: readonly SemanticOutputParameter[];
  readonly isFinancialServiceCandidate: boolean;
  readonly isPublic: boolean;
};

export type GetSemanticToolContractInput = {
  readonly slug: string;
  readonly locale: string;
  readonly tier: SemanticToolTier;
};
