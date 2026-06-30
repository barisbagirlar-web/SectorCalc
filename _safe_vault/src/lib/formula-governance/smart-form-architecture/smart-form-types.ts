/**
 * Smart Form Architecture governance types — Phase 5H-G-A (spec only; no UI).
 */

export type SmartFormReadinessStatus =
  | "ready_for_spec"
  | "needs_input_design_patch"
  | "needs_alignment_review"
  | "blocked";

export type SmartFormFieldRole =
  | "required"
  | "optional"
  | "advanced"
  | "derived"
  | "assumption"
  | "validation_only";

export type SmartFormSectionType =
  | "decision_goal"
  | "required_inputs"
  | "optional_refinements"
  | "advanced_professional_inputs"
  | "default_assumptions"
  | "derived_values"
  | "validation_messages"
  | "result_preview"
  | "trust_trace";

export type SmartFormFieldSource =
  | "controlled_input_patch"
  | "requirement_engine"
  | "contract"
  | "derived"
  | "assumption";

export type SmartFormFieldVisibility =
  | "always"
  | "conditional"
  | "advanced_toggle"
  | "hidden_derived";

export type SmartFormFieldSpec = {
  readonly key: string;
  readonly label: string;
  readonly role: SmartFormFieldRole;
  readonly section: SmartFormSectionType;
  readonly dimension?: string;
  readonly unit?: string;
  readonly source: SmartFormFieldSource;
  readonly userEditable: boolean;
  readonly requiredForCalculation: boolean;
  readonly defaultValue?: number | string;
  readonly missingQuestion?: string;
  readonly validationMessages: readonly string[];
  readonly professionalNote?: string;
  readonly visibility: SmartFormFieldVisibility;
};

export type SmartFormSection = {
  readonly type: SmartFormSectionType;
  readonly title: string;
  readonly description: string;
  readonly fieldKeys: readonly string[];
  readonly collapsedByDefault: boolean;
};

export type SmartFormMissingInputQuestion = {
  readonly fieldKey: string;
  readonly question: string;
  readonly priority: SmartFormFieldRole;
};

export type SmartFormAssumptionDisplay = {
  readonly id: string;
  readonly text: string;
  readonly displayOrder: number;
};

export type SmartFormDerivedValueDisplay = {
  readonly fieldKey: string;
  readonly label: string;
  readonly description: string;
};

export type SmartFormValidationMessagePlan = {
  readonly ruleId: string;
  readonly message: string;
  readonly kind: string;
};

export type SmartFormTrustTraceMapping = {
  readonly usedInputs: readonly string[];
  readonly defaultAssumptions: readonly string[];
  readonly derivedValues: readonly string[];
  readonly validationSources: readonly string[];
  readonly professionalInputs: readonly string[];
  readonly hiddenNonEditableValues: readonly string[];
  readonly modelLimitationsSource: readonly string[];
};

export type SmartFormPlan = {
  readonly slug: string;
  readonly readinessStatus: SmartFormReadinessStatus;
  readonly sections: readonly SmartFormSection[];
  readonly fields: readonly SmartFormFieldSpec[];
  readonly missingInputQuestions: readonly SmartFormMissingInputQuestion[];
  readonly defaultAssumptionDisplays: readonly SmartFormAssumptionDisplay[];
  readonly derivedValueDisplays: readonly SmartFormDerivedValueDisplay[];
  readonly validationMessagePlan: readonly SmartFormValidationMessagePlan[];
  readonly trustTraceMapping: SmartFormTrustTraceMapping;
  readonly nextGate: string;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type SmartFormReadinessResult = {
  readonly status: SmartFormReadinessStatus;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type BatchSmartFormPlanAuditResult = {
  readonly totalTools: number;
  readonly readyForSpec: number;
  readonly needsInputDesignPatch: number;
  readonly needsAlignmentReview: number;
  readonly blocked: number;
  readonly plans: readonly SmartFormPlan[];
  readonly recommendedFirstSmartFormBatch: readonly string[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
