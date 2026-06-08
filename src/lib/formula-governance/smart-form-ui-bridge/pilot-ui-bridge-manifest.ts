/**
 * Pilot UI bridge manifest builder — Phase 5H-G-C governance pipeline.
 */

import { getControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildSmartFormPlan } from "@/lib/formula-governance/smart-form-architecture/smart-form-plan-builder";
import { buildSmartFormRenderPlan } from "@/lib/formula-governance/smart-form-rendering/smart-form-render-adapter";
import type { SmartFormRenderMode } from "@/lib/formula-governance/smart-form-rendering/smart-form-render-types";
import { buildSmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-adapter";
import type { SmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export const PILOT_UI_BRIDGE_SLUGS = [
  "3d-print-cost-check",
  "auto-shop-margin-leak-detector",
  "cabinet-cost-estimator",
] as const;

export type PilotUiBridgeSlug = (typeof PILOT_UI_BRIDGE_SLUGS)[number];

export type BuildPilotUiBridgeManifestsParams = {
  readonly slugs: readonly string[];
  readonly renderMode?: SmartFormRenderMode;
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

export function buildPilotUiBridgeManifestForSlug(
  slug: string,
  renderMode: SmartFormRenderMode = "free_quick_check",
): SmartFormUiBridgeManifest | undefined {
  const patch = getControlledInputDesignPatch(slug);
  if (!patch) {
    return undefined;
  }

  const smartFormSpec = buildSmartFormPlan({
    migrationPlanItem: buildMigrationItem(slug),
    controlledInputPatch: patch,
  });

  const renderPlan = buildSmartFormRenderPlan({ smartFormSpec, renderMode });
  return buildSmartFormUiBridgeManifest({ renderPlan });
}

export function buildPilotUiBridgeManifests(
  params: BuildPilotUiBridgeManifestsParams,
): readonly SmartFormUiBridgeManifest[] {
  const renderMode = params.renderMode ?? "free_quick_check";
  const manifests: SmartFormUiBridgeManifest[] = [];

  for (const slug of params.slugs) {
    const manifest = buildPilotUiBridgeManifestForSlug(slug, renderMode);
    if (manifest) {
      manifests.push(manifest);
    }
  }

  return manifests;
}
