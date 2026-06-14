export type RuntimeTrustLoopStatus =
  | "SUCCESS"
  | "READY_TO_CALCULATE"
  | "NEED_DATA"
  | "PHYSICS_OR_LOGIC_ERROR"
  | "BLOCKED"
  | "pending";

export type RuntimeTrustTraceView = {
  readonly slug: string;
  readonly status: "pending" | "blocked" | "success";
  readonly loopStatus: RuntimeTrustLoopStatus;
  readonly canonicalInputs: readonly string[];
  readonly requirementStatus: string;
  readonly validationPassed: boolean;
  readonly formulaPath: readonly string[];
  readonly rejectedKeys: readonly string[];
  readonly requiredMissingInputs: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly validationSources: readonly string[];
  readonly validationErrors: readonly string[];
  readonly limitations: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly derivedResolutionPlan: readonly string[];
  readonly validationWarnings: readonly string[];
  readonly blockers: readonly string[];
};
