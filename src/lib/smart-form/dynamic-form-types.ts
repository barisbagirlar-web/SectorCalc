export type SmartFormMode = "simple" | "advanced";

export type SmartInputKind =
  | "number"
  | "text"
  | "select"
  | "boolean"
  | "currency"
  | "percentage"
  | "duration"
  | "unit";

export type SmartFormCondition = {
  readonly key: string;
  readonly equals?: string | number | boolean;
  readonly notEquals?: string | number | boolean;
};

export type SmartInputRequirement = {
  readonly key: string;
  readonly labelKey: string;
  readonly helpKey?: string;
  readonly kind: SmartInputKind;
  readonly required: boolean;
  readonly unit?: string;
  readonly min?: number;
  readonly max?: number;
  readonly options?: readonly {
    readonly value: string;
    readonly labelKey: string;
  }[];
  readonly visibleWhen?: readonly SmartFormCondition[];
  readonly requiredWhen?: readonly SmartFormCondition[];
  readonly mode?: SmartFormMode;
};

export type SmartFormScenario = {
  readonly id: string;
  readonly labelKey: string;
  readonly descriptionKey?: string;
  readonly inputKeys: readonly string[];
};

export type SmartFormDefinition = {
  readonly toolSlug: string;
  readonly scenarios: readonly SmartFormScenario[];
  readonly inputs: readonly SmartInputRequirement[];
  readonly defaultScenarioId: string;
};

export type SmartFormValidationResult = {
  readonly ok: boolean;
  readonly missing: readonly string[];
  readonly invalid: readonly {
    readonly key: string;
    readonly messageKey: string;
  }[];
  readonly normalizedValues: Record<string, unknown>;
};

export const DYNAMIC_SMART_FORM_PILOT_SLUGS = [
  "cnc-quote-risk-analyzer",
  "welding-bid-risk-analyzer",
  "hvac-project-margin-guard",
] as const;

export type DynamicSmartFormPilotSlug = (typeof DYNAMIC_SMART_FORM_PILOT_SLUGS)[number];

/** @deprecated Use hasPremiumSmartFormDefinition from premium-smart-form-definitions */
export function isDynamicSmartFormPilotSlug(slug: string): slug is DynamicSmartFormPilotSlug {
  return (DYNAMIC_SMART_FORM_PILOT_SLUGS as readonly string[]).includes(slug);
}

export function slugToSmartFormToolKey(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}
