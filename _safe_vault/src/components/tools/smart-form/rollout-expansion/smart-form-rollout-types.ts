/**
 * Smart form rollout expansion types — Phase 5I-H (governance only).
 */

export type SmartFormRolloutCategory =
  | "live_already"
  | "eligible_for_calculation_bridge"
  | "eligible_for_render_only"
  | "premium_only_requires_later_gate"
  | "blocked";

export type SmartFormRolloutToolEntry = {
  readonly governanceSlug: string;
  readonly routeSlug: string;
  readonly category: SmartFormRolloutCategory;
  readonly submitKeys: readonly string[];
  readonly exclusionReason: string | null;
  readonly rollbackSafe: boolean;
};

export type SmartFormRolloutPayloadPlan = {
  readonly governanceSlug: string;
  readonly allowedSubmitKeys: readonly string[];
  readonly excludedDerivedKeys: readonly string[];
  readonly excludedAssumptionKeys: readonly string[];
  readonly excludedOptionalKeys: readonly string[];
  readonly optionalGateOpen: boolean;
};

export type SmartFormRolloutExpansionAuditResult = {
  readonly totalCompletedPatchTools: number;
  readonly liveAlready: number;
  readonly eligibleForCalculationBridge: number;
  readonly eligibleForRenderOnly: number;
  readonly premiumOnlyRequiresLaterGate: number;
  readonly blocked: number;
  readonly addedRouteMappings: Readonly<Record<string, string>>;
  readonly addedPayloadBridges: readonly string[];
  readonly excludedWithReason: readonly { readonly slug: string; readonly reason: string }[];
  readonly rollbackSafe: boolean;
  readonly entries: readonly SmartFormRolloutToolEntry[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
