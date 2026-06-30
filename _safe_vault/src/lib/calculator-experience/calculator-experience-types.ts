export type CalculatorExperienceMode = "quick" | "expert";

export type CalculatorFieldMode = "quick" | "expert" | "both";

export type CalculatorExperienceLayout =
  | "compact-premium"
  | "technical-premium"
  | "financial-premium";

export type CalculatorExperienceField = {
  readonly key: string;
  readonly required?: boolean;
  readonly advanced?: boolean;
  readonly mode?: string;
};

export type CalculatorExperienceContract = {
  readonly toolSlug: string;
  readonly hasExpertMode: boolean;
  readonly defaultMode: CalculatorExperienceMode;
  readonly resultSummaryVisibleOnlyAfterCalculation: boolean;
  readonly guidanceRequired: boolean;
  readonly layout: CalculatorExperienceLayout;
  readonly fieldModes: Readonly<Record<string, CalculatorFieldMode>>;
};
