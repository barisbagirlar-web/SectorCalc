import type { DecisionLevel, RiskLevel, ToolArchetype } from "@/lib/features/decision-engine/decision-engine-types";

export type DisclaimerDepth = "standard" | "elevated" | "engineering";

export type ResolvedDisclaimer = {
  readonly depth: DisclaimerDepth;
  readonly titleKey: string;
  readonly bodyKey: string;
  readonly showUsageAgreement: boolean;
};

export type DisclaimerResolveInput = {
  readonly archetype: ToolArchetype;
  readonly decisionLevel: DecisionLevel;
  readonly riskLevel: RiskLevel;
};
