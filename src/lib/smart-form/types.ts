/**
 * Engineering-grade Smart Form — shared metadata types.
 * Canonical input keys are never renamed here; adapter preserves source keys.
 */

export type SmartFormTier = "free" | "premium";

export type SmartFormViewMode = "simple" | "expert" | "trust";

export type SmartFormInputType = "number" | "currency" | "percent" | "select" | "text";

export type SmartFormValidationTone = "neutral" | "valid" | "warning" | "error";

export type SmartFormGroupId =
  | "material-geometry"
  | "time-labor"
  | "cost-margin"
  | "quantity-output"
  | "risk-conditions"
  | "advanced";

export type SmartFormGroupLabel =
  | "Material & Geometry"
  | "Time & Labor"
  | "Cost & Margin"
  | "Quantity & Output"
  | "Risk & Conditions"
  | "Advanced Parameters";

export type SmartFormUnitOption = {
  readonly value: string;
  readonly label: string;
};

export type SmartFormInput = {
  readonly key: string;
  readonly canonicalKey: string;
  readonly label: string;
  readonly type: SmartFormInputType;
  readonly unit?: string;
  readonly unitOptions?: readonly SmartFormUnitOption[];
  readonly required: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly placeholder?: string;
  readonly helperText?: string;
  readonly helpWhy?: string;
  readonly helpTypical?: string;
  readonly helpReference?: string;
  readonly helpExample?: string;
  readonly group: SmartFormGroupId;
  readonly options?: readonly { readonly value: string; readonly label: string }[];
  readonly defaultValue?: number | string;
};

export type SmartFormSectionConfig = {
  readonly id: SmartFormGroupId;
  readonly title: SmartFormGroupLabel;
  readonly description: string;
  readonly inputs: readonly SmartFormInput[];
};

export type SmartFormValidationState = {
  readonly tone: SmartFormValidationTone;
  readonly message?: string;
};

export type SmartFormCalculationStep = {
  readonly id: string;
  readonly label: string;
  readonly formulaText?: string;
  readonly description?: string;
};

export type SmartFormResultMetric = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly tone?: "safe" | "watch" | "danger" | "neutral";
};

export type SmartFormResult = {
  readonly primaryLabel?: string;
  readonly primaryValue?: string;
  readonly status?: "safe" | "watch" | "danger" | "neutral";
  readonly secondaryMetrics?: readonly SmartFormResultMetric[];
  readonly actionRecommendation?: string;
};

export type SmartFormAdapterSuccess = {
  readonly ok: true;
  readonly slug: string;
  readonly source: "contract" | "revenue" | "traffic" | "schema" | "tool-definition";
  readonly simpleSections: readonly SmartFormSectionConfig[];
  readonly expertSections: readonly SmartFormSectionConfig[];
  readonly allInputs: readonly SmartFormInput[];
  readonly decisionGoal?: string;
  readonly calculationSteps: readonly SmartFormCalculationStep[];
};

export type SmartFormAdapterFailure = {
  readonly ok: false;
  readonly slug: string;
  readonly reason: string;
};

export type SmartFormAdapterResult = SmartFormAdapterSuccess | SmartFormAdapterFailure;

export const SMART_FORM_SIMPLE_INPUT_LIMIT = 6;

export const SMART_FORM_GROUP_LABELS: Record<SmartFormGroupId, SmartFormGroupLabel> = {
  "material-geometry": "Material & Geometry",
  "time-labor": "Time & Labor",
  "cost-margin": "Cost & Margin",
  "quantity-output": "Quantity & Output",
  "risk-conditions": "Risk & Conditions",
  advanced: "Advanced Parameters",
};
