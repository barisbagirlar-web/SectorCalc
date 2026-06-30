/**
 * Next smart form pilot candidate readiness — Phase 5H-G-F (read-only; no UI wiring).
 */

import { getControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { isControlledInputDesignPatchCompleted } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";
import { buildPilotUiBridgeManifestForSlug } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import { isPilotCalculationBridgeEnabled } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

export const NEXT_SMART_FORM_PILOT_CANDIDATE_SLUG = "electrical-labor-estimator" as const;

export type NextSmartFormPilotCandidate = {
  readonly slug: string;
  readonly calculationBridgeEnabled: boolean;
  readonly uiBridgeReady: boolean;
  readonly inputDesignPatchCompleted: boolean;
  readonly smartFormReadyForSpec: boolean;
  readonly reason: string;
};

function buildMigrationItem(slug: string) {
  return {
    slug,
    currentStatus: "usable" as const,
    inputSufficiencyScore: 80,
    professionalDepthScore: 75,
    migrationRiskScore: 10,
    recommendedPatchLevel: "none" as const,
    migrationPriority: "low" as const,
    migrationRiskLevel: "low" as const,
    canPatchWithoutUIBreak: true,
    hasFullGovernanceCoverage: true,
    requiredActions: [],
    blockedBy: [],
    expectedBenefit: "",
    affectedAreas: [],
    testRequirements: [],
    nextGate: "",
    notes: [],
    inputDesignPatchCompleted: true,
    smartFormArchitectureReady: false,
  };
}

export function getNextSmartFormPilotCandidate(): NextSmartFormPilotCandidate {
  const slug = NEXT_SMART_FORM_PILOT_CANDIDATE_SLUG;
  const inputDesignPatchCompleted = isControlledInputDesignPatchCompleted(slug);
  const patch = getControlledInputDesignPatch(slug);
  const manifest = buildPilotUiBridgeManifestForSlug(slug);
  const uiBridgeReady = manifest?.status === "ui_bridge_ready";
  const smartFormPlan = buildSmartFormPlan({
    migrationPlanItem: buildMigrationItem(slug),
    controlledInputPatch: patch,
  });

  return {
    slug,
    calculationBridgeEnabled: isPilotCalculationBridgeEnabled(slug),
    uiBridgeReady,
    inputDesignPatchCompleted,
    smartFormReadyForSpec: smartFormPlan.readinessStatus === "ready_for_spec",
    reason: isPilotCalculationBridgeEnabled(slug)
      ? "Smart form spec, UI bridge manifest, controlled input patch, and calculation bridge are ready for this slug."
      : "Smart form spec, UI bridge manifest, and controlled input design patch are ready; calculation bridge is not enabled for this slug.",
  };
}
