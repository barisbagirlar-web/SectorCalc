/**
 * Tool factory orchestrator types — Phase 5I-A skeleton (no deploy execution).
 */

export const TOOL_FACTORY_PIPELINE_STAGES = [
  "ToolIdea",
  "CalculationOntology",
  "RequirementEngine",
  "InputDesign",
  "FormulaContract",
  "OraclePlan",
  "ScenarioPlan",
  "PropertyPlan",
  "SmartFormPlan",
  "TrustTracePlan",
  "ReportPlan",
  "AuditGate",
  "PatchPlan",
  "HumanApproval",
  "DeployReady",
] as const;

export type ToolFactoryPipelineStage = (typeof TOOL_FACTORY_PIPELINE_STAGES)[number];

export const TOOL_FACTORY_GATES = [
  "input_intelligence_gate",
  "formula_contract_gate",
  "oracle_gate",
  "scenario_gate",
  "property_gate",
  "ui_form_gate",
  "trust_trace_gate",
  "report_gate",
  "build_gate",
  "secret_gate",
  "human_approval_gate",
  "deploy_gate",
] as const;

export type ToolFactoryGate = (typeof TOOL_FACTORY_GATES)[number];

export const LLM_FORBIDDEN_ACTIONS = [
  "calculate_result",
  "choose_formula",
  "override_oracle",
  "bypass_validation",
  "create_formula_from_prompt",
  "change_production_output",
] as const;

export type LlmForbiddenAction = (typeof LLM_FORBIDDEN_ACTIONS)[number];

export type ToolFactoryPlanStatus =
  | "draft"
  | "needs_metadata"
  | "needs_fixture"
  | "ready_for_patch_plan"
  | "waiting_human_approval"
  | "deploy_ready"
  | "blocked";

export type ToolFactoryArtifactPresence = {
  readonly calculationOntology: boolean;
  readonly requirementEngine: boolean;
  readonly inputDesign: boolean;
  readonly formulaContract: boolean;
  readonly oraclePlan: boolean;
  readonly scenarioPlan: boolean;
  readonly propertyPlan: boolean;
  readonly smartFormPlan: boolean;
  readonly trustTracePlan: boolean;
  readonly reportPlan: boolean;
  readonly auditGatePassed: boolean;
  readonly patchPlan: boolean;
  readonly humanApproval: boolean;
};

export type ToolFactoryIdea = {
  readonly title: string;
  readonly sector: string;
  readonly targetUser: string;
  readonly calculationGoal: string;
  readonly notes?: string;
};

export type ToolFactoryPlan = {
  readonly idea: ToolFactoryIdea;
  readonly sector: string;
  readonly targetUser: string;
  readonly calculationGoal: string;
  readonly requiredArtifacts: ToolFactoryArtifactPresence;
  readonly gates: readonly ToolFactoryGate[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly status: ToolFactoryPlanStatus;
  readonly currentStage: ToolFactoryPipelineStage;
  readonly llmActions: readonly string[];
};

export type ToolFactoryStateMachineEvent =
  | "register_ontology"
  | "complete_requirement_engine"
  | "complete_input_design"
  | "register_formula_contract"
  | "complete_oracle_plan"
  | "complete_scenario_plan"
  | "complete_property_plan"
  | "complete_smart_form_plan"
  | "complete_trust_trace_plan"
  | "complete_report_plan"
  | "pass_audit_gate"
  | "complete_patch_plan"
  | "approve_human"
  | "request_deploy";

export type ToolFactoryAuditResult = {
  readonly pipelineStageCount: number;
  readonly gateCount: number;
  readonly autoDeployEnabled: false;
  readonly humanApprovalRequired: true;
  readonly status: "skeleton_ready" | "blocked";
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
