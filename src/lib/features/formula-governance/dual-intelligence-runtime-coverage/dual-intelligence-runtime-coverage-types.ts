/**
 * Dual-intelligence runtime coverage types — read-only classification.
 */

export type DualIntelligenceRuntimeTier =
  /** Full Mind 2 → calc → Mind 1 loop on premium calculate path. */
  | "full_loop_runtime"
  /** Smart Form pilot live on route when NEXT_PUBLIC_SMART_FORM_PILOT is on. */
  | "live_smart_form_pilot"
  /** Calculation bridge registered; rollout pending or flag off. */
  | "staged_calculation_bridge"
  /** Render-only Smart Form eligible; no calculation bridge yet. */
  | "staged_render_only"
  /** Controlled input patch — Mind 2 fields at manifest build, classic calc at runtime. */
  | "governed_buildtime_only"
  /** Formula contract + audit pipeline only (alignment/requirement/validation in CI). */
  | "audit_pipeline_only"
  /** No formula contract in governance registry. */
  | "no_governance";

export type DualIntelligenceRuntimeCoverageEntry = {
  readonly slug: string;
  readonly title: string;
  readonly tier: DualIntelligenceRuntimeTier;
  readonly mind1Runtime: boolean;
  readonly mind2Runtime: boolean;
  readonly fullLoopRuntime: boolean;
  readonly routeSlug: string | null;
  readonly notes: readonly string[];
};

export type DualIntelligenceRuntimeCoverageResult = {
  readonly totalContracts: number;
  readonly liveSmartFormPilot: number;
  readonly stagedCalculationBridge: number;
  readonly stagedRenderOnly: number;
  readonly governedBuildtimeOnly: number;
  readonly auditPipelineOnly: number;
  readonly noGovernance: number;
  readonly fullLoopRuntimeCount: number;
  readonly mind1RuntimeCount: number;
  readonly mind2RuntimeCount: number;
  readonly entries: readonly DualIntelligenceRuntimeCoverageEntry[];
};
