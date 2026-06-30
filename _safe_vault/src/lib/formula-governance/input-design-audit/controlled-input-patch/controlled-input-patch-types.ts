/**
 * Controlled input design patch types — Phase 5H-F read-only governance patches.
 */

export type ControlledInputPatchType = "input_design_only";

export type ControlledInputProductionImpact = "none";

export type ControlledInputUiImpact = "none" | "future_smart_form_required";

export type ControlledInputOracleImpact = "none";

export type ControlledInputDesignNextGate =
  | "smart_form_architecture"
  | "trust_trace_report"
  | "controlled_patch_ready";

export type ControlledInputDesignPatch = {
  readonly slug: string;
  readonly patchType: ControlledInputPatchType;
  readonly requiredInputs: readonly string[];
  readonly optionalInputs: readonly string[];
  readonly advancedInputs: readonly string[];
  readonly derivedInputs: readonly string[];
  readonly defaultAssumptions: readonly string[];
  readonly userBurdenNotes: readonly string[];
  readonly professionalDepthNotes: readonly string[];
  readonly nextGate: ControlledInputDesignNextGate;
  readonly productionImpact: ControlledInputProductionImpact;
  readonly uiImpact: ControlledInputUiImpact;
  readonly oracleImpact: ControlledInputOracleImpact;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type ControlledInputDesignPatchResult = {
  readonly slug: string;
  readonly applied: boolean;
  readonly productionImpact: ControlledInputProductionImpact | "blocked";
  readonly uiImpact: ControlledInputUiImpact;
  readonly oracleImpact: ControlledInputOracleImpact;
  readonly beforePatchLevel: string;
  readonly afterPatchLevel: string;
  readonly nextGate: ControlledInputDesignNextGate | "blocker_resolution";
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
