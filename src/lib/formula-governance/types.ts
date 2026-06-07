/**
 * SectorCalc Formula Assurance & Governance Platform — core types.
 * Contract-driven audit; not a substitute for domain review.
 */

export type RiskLevel = "critical" | "high" | "medium" | "low";

export type AuditStatus = "PASS" | "NEEDS_REVIEW" | "FAIL" | "DISABLE_OR_SOFTEN";

export type DecisionImpact =
  | "financial"
  | "pricing"
  | "investment"
  | "credit"
  | "purchase"
  | "operational"
  | "technical"
  | "informational";

export type ValidationRuleKind =
  | "dimensional"
  | "scenario"
  | "monotonicity"
  | "edge"
  | "purpose"
  | "decision_language";

export type ValidationRule = {
  readonly id: string;
  readonly description: string;
  readonly kind: ValidationRuleKind;
};

export type ScenarioTestSpec = {
  readonly id: string;
  readonly description: string;
  /** Declared test exists and is wired in test suite */
  readonly present: boolean;
};

export type MonotonicityDirection =
  | "increase_should_increase"
  | "increase_should_decrease";

export type MonotonicityRule = {
  readonly id: string;
  readonly description: string;
  readonly inputKey: string;
  readonly direction: MonotonicityDirection;
  readonly outputKey: string;
};

export type DecisionLanguageRule = {
  readonly id: string;
  readonly description: string;
  readonly acceptablePhrases?: readonly string[];
  readonly forbiddenPhrases?: readonly string[];
  readonly requiredDisclaimer?: boolean;
};

export type FormulaContract = {
  readonly toolId: string;
  readonly toolName: string;
  readonly slug: string;
  readonly purpose: string;
  readonly userDecision: string;
  readonly riskLevel: RiskLevel;
  readonly decisionImpact: DecisionImpact;
  readonly requiredInputs: readonly string[];
  readonly criticalInputs: readonly string[];
  readonly outputs: readonly string[];
  readonly assumptions: readonly string[];
  readonly formulaSummary: string;
  readonly missingParameterWarnings: readonly string[];
  readonly validationRules: readonly ValidationRule[];
  readonly scenarioTests: readonly ScenarioTestSpec[];
  readonly monotonicityRules: readonly MonotonicityRule[];
  readonly oracleRequired: boolean;
  readonly propertyTestsRegistered: boolean;
  readonly decisionLanguageRules: readonly DecisionLanguageRule[];
  readonly mustNotClaim: readonly string[];
  readonly auditOwner: string;
  /** Set by audit runner after evaluation; omitted on static registry entries */
  readonly auditStatus?: AuditStatus;
};

export type FormulaInventoryEntry = {
  readonly toolId: string;
  readonly slug: string;
  readonly name: string;
  readonly source: "free-traffic" | "revenue" | "premium-schema" | "legacy";
  readonly inputKeys: readonly string[];
  readonly outputLabels: readonly string[];
  readonly formulaFile?: string;
  readonly suggestedRiskLevel: RiskLevel;
  readonly hasContract: boolean;
};

export type AuditFinding = {
  readonly code: string;
  readonly severity: "blocker" | "warning" | "info";
  readonly message: string;
};

export type ContractAuditResult = {
  readonly toolId: string;
  readonly slug: string;
  readonly toolName: string;
  readonly riskLevel: RiskLevel;
  readonly status: AuditStatus;
  readonly findings: readonly AuditFinding[];
};

export type GovernanceAuditReport = {
  readonly generatedAt: string;
  readonly strictMode: boolean;
  readonly totalToolsScanned: number;
  readonly totalContracts: number;
  readonly passCount: number;
  readonly needsReviewCount: number;
  readonly failCount: number;
  readonly disableOrSoftenCount: number;
  readonly criticalToolsDetected: number;
  readonly highToolsDetected: number;
  readonly criticalToolsWithoutContract: readonly string[];
  readonly criticalFails: readonly ContractAuditResult[];
  readonly launchBlockers: readonly string[];
  readonly warnings: readonly string[];
  readonly recommendedNextActions: readonly string[];
  readonly results: readonly ContractAuditResult[];
};
