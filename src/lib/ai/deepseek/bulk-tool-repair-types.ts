/** ASR-0 — DeepSeek bulk tool repair factory types. */

export type BulkRepairPatchType =
  | "i18n_fix"
  | "schema_fix"
  | "validation_fix"
  | "contract_alignment"
  | "result_renderer"
  | "submit_handler"
  | "unit_fix"
  | "guide_hide"
  | "route_wiring";

export type BulkRepairRiskLevel = "low" | "medium" | "high" | "critical";

export type BulkRepairDecision =
  | "auto_apply"
  | "auto_apply_candidate"
  | "manual_review"
  | "keep_safe_state"
  | "skip";

export type BulkRepairPatchPlan = {
  readonly type: BulkRepairPatchType;
  readonly targetFile: string;
  readonly targetFileHint?: string;
  readonly description: string;
  readonly safeToApply: boolean;
  readonly requiresHumanApproval?: boolean;
  readonly metadata?: Record<string, string>;
};

export type BulkToolRepairItem = {
  readonly slug: string;
  readonly tier: string;
  readonly route: string;
  readonly p24Status: string;
  readonly runtimeTrustStatus: string | null;
  readonly findings: string[];
  readonly formulaContractExists: boolean;
  readonly validationExists: boolean;
  readonly formSchemaExists: boolean;
  readonly submitHandlerExists: boolean;
  readonly resultRendererExists: boolean;
  readonly localeCoverage: Record<string, boolean>;
  readonly unitIssues: string[];
  readonly guideStatus: string;
  readonly knownFormulaAuditFindings: string[];
  readonly riskLevel: BulkRepairRiskLevel;
  readonly repairDecision: BulkRepairDecision;
  readonly rootCause: string;
  readonly patches: BulkRepairPatchPlan[];
  readonly whyNotPatchable?: string;
  readonly expectedAuditAfterPatch: "PASS" | "WARN" | "REVIEW";
  readonly testCommands: string[];
};

export type BulkToolRepairEnvelope = {
  readonly taskType: "bulk_tool_repair";
  readonly items: BulkToolRepairItem[];
};

export type SelectionDiagnostics = {
  readonly selectedCount: number;
  readonly selectedAutoRepair: number;
  readonly selectedLow: number;
  readonly selectedMedium: number;
  readonly selectedQuarantine: number;
  readonly selectedManualReview: number;
};

export type DeepSeekDiagnostics = {
  readonly rawItems: number;
  readonly parsedItems: number;
  readonly itemsWithPatches: number;
  readonly itemsWithoutPatches: number;
  readonly allSafeStateKept: boolean;
  readonly commonWhyNotPatchable: string[];
};

export type PatchCandidateSummary = {
  readonly slug: string;
  readonly repairDecision: BulkRepairDecision;
  readonly riskLevel: BulkRepairRiskLevel;
  readonly patchCount: number;
  readonly patchTypes: string[];
  readonly rootCause: string;
  readonly whyNotPatchable?: string;
};

export type BulkToolRepairReport = {
  readonly generatedAt: string;
  readonly mode: "apply" | "plan";
  readonly limit: number;
  readonly selected: string[];
  readonly patched: string[];
  readonly skipped: string[];
  readonly manualReview: string[];
  readonly safeStateKept: string[];
  readonly blockedByPolicy: string[];
  readonly before: ExtendedAuditCounts;
  readonly after: ExtendedAuditCounts;
  readonly testResults: string[];
  readonly blockers: string[];
  readonly deepseekStatus: "ok" | "skipped" | "api_error" | "missing_api_key";
  readonly items: BulkToolRepairItem[];
  readonly selectionDiagnostics: SelectionDiagnostics;
  readonly deepseekDiagnostics: DeepSeekDiagnostics;
  readonly patchCandidates: PatchCandidateSummary[];
  readonly notPatchableReasons: string[];
  readonly policyBlocks: string[];
};

export type AuditCounts = {
  readonly PASS: number;
  readonly WARN: number;
  readonly FAIL: number;
  readonly QUARANTINE: number;
};

export type ExtendedAuditCounts = AuditCounts & {
  readonly paymentEligible: number;
  readonly formulaGateEligible: number;
  readonly freePaymentEligible: number;
};

export type P24ToolRow = {
  slug: string;
  tier?: string;
  verdict?: string;
  routePath?: string;
  findings?: Array<{ checkId: string; severity: string; message?: string }>;
  evidence?: { schemaPath?: string | null; contractPath?: string | null; dedicatedTests?: string[] };
};

export type ControlPlaneTool = {
  slug: string;
  tier?: string;
  route?: string;
  routeStatus?: string;
  qualityStatus?: string;
  runtimeStatus?: string;
  severityScore?: number;
  repairDifficulty?: string;
  revenuePotential?: string;
  recommendedAction?: string;
  eligible?: {
    paymentEligible?: boolean;
    formulaGateEligible?: boolean;
    repairEligible?: boolean;
  };
  formulaContract?: {
    exists?: boolean;
    aligned?: boolean;
    unitIssues?: string[];
  };
  schema?: {
    exists?: boolean;
    suspiciousLabels?: string[];
  };
  validation?: {
    exists?: boolean;
    missingRules?: string[];
  };
  resultRenderer?: {
    exists?: boolean;
    placeholderOnly?: boolean;
  };
  submitHandler?: {
    exists?: boolean;
  };
  i18n?: {
    complete?: boolean;
    mixedLabel?: boolean;
    missingLocales?: string[];
  };
  guide?: {
    hasSpec?: boolean;
    genericGuideBlocked?: boolean;
  };
  findings?: string[];
};
