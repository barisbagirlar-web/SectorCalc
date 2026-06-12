export type FormulaAction = "preserve-existing" | "create-new";

export type ActivationRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "regulated"
  | "safety-critical";

export type ActivationInputDraft = {
  key: string;
  unit?: string;
  label?: string;
};

export type ActivationOutputDraft = {
  key: string;
  unit?: string;
};

export type ActivationTestCase = {
  name: string;
  inputs: Record<string, unknown>;
  expectedOutput: Record<string, unknown>;
};

export type ActivationDraft = {
  slug: string;
  formulaAction: FormulaAction;
  riskLevel: ActivationRiskLevel;
  inputs: ActivationInputDraft[];
  outputs: ActivationOutputDraft[];
  formulaExpression?: string;
  testCases: ActivationTestCase[];
  metadata?: Record<string, unknown>;
  validationNotes?: string[];
};

export type ActivationScanToolRecord = {
  slug: string;
  routeStatus: string;
  tier: string;
  hasFormulaContract: boolean;
  hasExistingFormulaExpression: boolean;
  riskLevel: ActivationRiskLevel;
};

export type ActivationScanReport = {
  generatedAt: string;
  selectedReferenceSlug: string;
  selectedReferenceReason: string;
  referenceHasActiveRoute: boolean;
  referenceHasFormulaContract: boolean;
  referenceFormulaPreserved: boolean;
  tools: ActivationScanToolRecord[];
};

export type ActivationApplyManifest = {
  slug: string;
  appliedAt: string;
  referenceSlugLock: string;
  formulaAction: FormulaAction;
  formulaPreserved: boolean;
  productionSourceModified: false;
  stagingPath: string;
  appliedOperations: string[];
};
