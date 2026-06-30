export type ToolArchetype =
  | "technical-measurement"
  | "cost-margin"
  | "production-operations"
  | "energy-loss"
  | "finance-hr"
  | "construction-field"
  | "logistics-route"
  | "quality-lean"
  | "engineering-standard"
  | "generic";

export type DecisionLevel =
  | "quick"
  | "standard"
  | "case-study"
  | "engineering-review"
  | "compliance-sensitive";

export type InputCompleteness = "minimal" | "sufficient" | "advanced";

export type RiskLevel = "low" | "medium" | "high";

export type UnitSystem = "metric" | "imperial" | "mixed";

export type SectorCalcCaseState = {
  readonly toolSlug: string;
  readonly locale: string;
  readonly region: string;
  readonly archetype: ToolArchetype;
  readonly decisionLevel: DecisionLevel;
  readonly sector?: string;
  readonly costType?: string;
  readonly technicalDomain?: string;
  readonly riskLevel: RiskLevel;
  readonly inputCompleteness: InputCompleteness;
  readonly unitSystem: UnitSystem;
  readonly currency: string;
  readonly standards?: readonly string[];
  readonly trustTraceEnabled: boolean;
};

export type DecisionEngineResolveInput = {
  readonly toolSlug: string;
  readonly locale: string;
  readonly region?: string;
  readonly tier?: "free" | "premium" | "premium-schema";
  readonly sector?: string;
  readonly category?: string;
  readonly inputKeys?: readonly string[];
  readonly filledInputCount?: number;
  readonly totalInputCount?: number;
  readonly unitSystem?: UnitSystem;
  readonly currency?: string;
};

export type DecisionEngineContext = {
  readonly caseState: SectorCalcCaseState;
  readonly archetypes: readonly ToolArchetype[];
  readonly mappingSource: "slug" | "category" | "keywords" | "generic";
};
