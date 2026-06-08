/**
 * Smart Form Architecture governance types — Phase 5H-G-A (spec only; no UI).
 */

export type SmartFormFieldGroup = "required" | "optional" | "advanced" | "derived";

export type SmartFormSectionGroup =
  | SmartFormFieldGroup
  | "assumptions"
  | "trust_trace"
  | "derived_outputs";

export type SmartFormArchitectureNextGate =
  | "smart_form_rendering_ready"
  | "smart_form_architecture_pending";

export type SmartFormFieldSpec = {
  readonly variableId: string;
  readonly label: string;
  readonly group: SmartFormFieldGroup;
  readonly displayOrder: number;
  readonly dimension: string;
  readonly unit: string;
  readonly missingRisk: string;
  readonly helpText?: string;
};

export type SmartFormAssumptionDisplay = {
  readonly id: string;
  readonly text: string;
  readonly category: "default" | "accepted" | "limitation" | "professional" | "user_burden";
  readonly displayOrder: number;
};

export type SmartFormMissingInputQuestion = {
  readonly variableId: string;
  readonly question: string;
  readonly missingRisk: string;
  readonly priority: SmartFormFieldGroup;
};

export type SmartFormValidationMessagePlan = {
  readonly ruleId: string;
  readonly message: string;
  readonly kind: string;
  readonly trigger: string;
};

export type SmartFormSectionPlan = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly group: SmartFormSectionGroup;
  readonly fieldIds: readonly string[];
  readonly collapsedByDefault: boolean;
};

export type SmartFormTrustTraceMapping = {
  readonly outputId: string;
  readonly label: string;
  readonly traceSource: string;
  readonly disclaimerRequired: boolean;
  readonly narrativeOutput: boolean;
};

export type SmartFormArchitectureSpec = {
  readonly slug: string;
  readonly toolName: string;
  readonly nextGate: SmartFormArchitectureNextGate;
  readonly productionImpact: "none";
  readonly uiImpact: "none";
  readonly fields: readonly SmartFormFieldSpec[];
  readonly assumptionDisplays: readonly SmartFormAssumptionDisplay[];
  readonly missingInputQuestions: readonly SmartFormMissingInputQuestion[];
  readonly validationMessagePlans: readonly SmartFormValidationMessagePlan[];
  readonly sections: readonly SmartFormSectionPlan[];
  readonly trustTraceMappings: readonly SmartFormTrustTraceMapping[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type BatchSmartFormArchitecturePlan = {
  readonly totalTools: number;
  readonly renderingReady: number;
  readonly pending: number;
  readonly specs: readonly SmartFormArchitectureSpec[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
