export type ContractLoopStatus = "pending" | "blocked" | "success";

export type DerivedResolutionStep = {
  readonly variableId: string;
  readonly formulaNodeId?: string;
  readonly requiredInputs?: readonly string[];
  readonly step?: string;
};

export type ReadinessAudit = {
  readonly status: string;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type ValidationResult = {
  readonly passed?: boolean;
  readonly invariantViolations?: readonly string[];
  readonly dimensionErrors?: readonly string[];
};

export type ContractCalculationIntelligenceLoopResult = {
  readonly status: ContractLoopStatus;
  readonly derivedResolutionPlan: readonly DerivedResolutionStep[];
  readonly readinessAudit: ReadinessAudit;
  readonly validationResult: ValidationResult;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
