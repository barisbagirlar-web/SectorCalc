/**
 * Fixture ontology expansion types - Phase 5I-K (plan only).
 */

export type FixtureExpansionStatus = "ready_for_fixture_draft" | "needs_manual_review" | "blocked";

export type FixtureExpansionPlan = {
  readonly slug: string;
  readonly targetOutput: string;
  readonly alignmentAlias: string | null;
  readonly dimensionCoverage: readonly string[];
  readonly requiredInputCoverage: readonly string[];
  readonly missingInputs: readonly string[];
  readonly expectedInputDesignLift: number;
  readonly status: FixtureExpansionStatus;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type FixtureExpansionAuditResult = {
  readonly totalCandidates: number;
  readonly readyForFixtureDraft: number;
  readonly needsManualReview: number;
  readonly blocked: number;
  readonly top10FixtureCandidates: readonly string[];
  readonly expectedInputDesignLift: number;
  readonly plans: readonly FixtureExpansionPlan[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
