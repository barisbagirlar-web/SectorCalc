export type RiskLevel = "low" | "medium" | "high";
export type AuditStatus = "pending";
export type DecisionImpact = "unknown";
export type ValidationRule = { readonly id: string };
export type ScenarioTestSpec = { readonly id: string };

export type FormulaContract = {
  readonly slug: string;
  readonly toolId?: string;
  readonly toolName?: string;
  readonly status?: string;
  readonly auditOwner?: string;
  readonly formulaSummary?: string;
  readonly requiredInputs?: readonly string[];
  readonly criticalInputs?: readonly string[];
  readonly outputs?: readonly string[];
  readonly assumptions?: readonly string[];
  readonly validationRules?: readonly ValidationRule[];
  readonly riskLevel?: RiskLevel;
  readonly warningPolicy?: { readonly acceptedAssumptions?: readonly string[] };
  readonly propertyTestsRegistered?: boolean;
  readonly scenarioTests?: readonly ScenarioTestSpec[];
};
