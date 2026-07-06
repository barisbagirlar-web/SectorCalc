export type FreeV531RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type FreeV531DecisionState = "PASS" | "REVIEW" | "BLOCKED" | "REPRICE" | "REJECT" | "HOLD" | "REPAIR" | "INSPECT" | "REWORK";
export type FreeV531RedactionStatus = "PUBLIC_SAFE_REDACTED" | "INTERNAL_TRACE_RESTRICTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";
export type FreeV531Severity = "INFO" | "REVIEW" | "WARNING" | "CRITICAL" | "BLOCKER" | "REPAIR" | "REPRICE" | "HOLD" | "REJECT";

export interface FreeV531InputSpec {
  readonly id: string;
  readonly label: string;
  readonly quantityKind: string;
  readonly required: true;
  readonly criticality: FreeV531RiskLevel;
  readonly baseUnit: string;
  readonly sourceStatus: "USER_VERIFIED" | "NEEDS_SOURCE_VERIFICATION" | "CONTEXT_ONLY";
  readonly defaultPolicy: "NO_DEFAULT_ALLOWED" | "USER_SELECTABLE_SMART_DEFAULT" | "NON_CRITICAL_SAFE_DEFAULT";
  readonly publicHelpText: string;
}

export interface FreeV531OutputMetric {
  readonly id: string;
  readonly value: number;
  readonly unit: string;
  readonly role: "PRIMARY_DECISION" | "SECONDARY_METRIC" | "BUSINESS_IMPACT" | "WARNING_DRIVER" | "AUDIT";
  readonly publicExplanation: string;
}

export interface FreeV531Warning {
  readonly severity: FreeV531Severity;
  readonly message: string;
  readonly suggestedAction: string;
}

export interface FreeV531AuditSeal {
  readonly toolId: string;
  readonly toolKey: string;
  readonly formulaVersion: string;
  readonly runtimeVersion: string;
  readonly normalizedInputHash: string;
  readonly outputHash: string;
  readonly redactionStatus: FreeV531RedactionStatus;
}

export interface FreeV531ExecuteResponse {
  readonly status: FreeV531DecisionState;
  readonly toolId: string;
  readonly toolKey: string;
  readonly primaryMetricId: string;
  readonly outputs: readonly FreeV531OutputMetric[];
  readonly warnings: readonly FreeV531Warning[];
  readonly hiddenRiskSummary: string;
  readonly nextAction: string;
  readonly proUnlockReason: string;
  readonly redactionStatus: FreeV531RedactionStatus;
  readonly auditSeal: FreeV531AuditSeal;
}

export interface FreeV531FormulaModule {
  readonly toolId: string;
  readonly toolKey: string;
  readonly toolName: string;
  readonly category: string;
  readonly funnelTarget: string;
  readonly riskLevel: FreeV531RiskLevel;
  readonly primaryMetricId: string;
  readonly runtimeBoundary: "SERVER_ONLY";
  readonly publicFormulaExpressionPolicy: "FORBIDDEN";
  readonly llmRuntimeUsage: "FORBIDDEN";
  readonly clientFormulaExecution: "FORBIDDEN";
  readonly inputs: readonly FreeV531InputSpec[];
  readonly execute: (rawInputs: Readonly<Record<string, unknown>>) => FreeV531ExecuteResponse;
}
