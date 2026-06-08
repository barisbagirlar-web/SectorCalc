/**
 * Batch smart form UI bridge audit — Phase 5H-G-C read-only governance audit.
 */

import { FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import type { SmartFormRenderPlan } from "@/lib/formula-governance/smart-form-rendering/smart-form-render-types";
import { buildSmartFormUiBridgeManifest } from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-adapter";
import {
  buildPilotUiBridgeManifests,
  PILOT_UI_BRIDGE_SLUGS,
} from "@/lib/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import type {
  BatchSmartFormUiBridgeAuditResult,
  SmartFormUiBridgeManifest,
} from "@/lib/formula-governance/smart-form-ui-bridge/smart-form-ui-bridge-types";

export type RunBatchSmartFormUiBridgeAuditParams = {
  readonly renderPlans: readonly SmartFormRenderPlan[];
};

function countDerivedReadonlyViolations(manifests: readonly SmartFormUiBridgeManifest[]): number {
  let violations = 0;
  for (const manifest of manifests) {
    for (const field of manifest.fields) {
      if (
        (field.badges.includes("Derived") || field.componentKind === "field_readonly") &&
        field.editable
      ) {
        violations += 1;
      }
    }
  }
  return violations;
}

function selectRecommendedFirstUiPilot(
  manifests: readonly SmartFormUiBridgeManifest[],
): readonly string[] {
  const readySlugs = new Set(
    manifests
      .filter((manifest) => manifest.status === "ui_bridge_ready")
      .map((manifest) => manifest.slug),
  );

  const fromFirstBatch = FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.filter((slug) =>
    readySlugs.has(slug),
  );

  if (fromFirstBatch.length >= 3) {
    return fromFirstBatch.slice(0, 3);
  }

  return manifests
    .filter((manifest) => manifest.status === "ui_bridge_ready")
    .map((manifest) => manifest.slug)
    .slice(0, 3);
}

export function runBatchSmartFormUiBridgeAudit(
  params: RunBatchSmartFormUiBridgeAuditParams,
): BatchSmartFormUiBridgeAuditResult {
  const { renderPlans } = params;
  const manifests: SmartFormUiBridgeManifest[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  const renderingReady = renderPlans.filter(
    (plan) => plan.readinessStatus === "rendering_adapter_ready",
  ).length;

  for (const renderPlan of renderPlans) {
    const manifest = buildSmartFormUiBridgeManifest({ renderPlan });
    manifests.push(manifest);
    warnings.push(...manifest.warnings.map((warning) => `${renderPlan.slug}: ${warning}`));
    blockers.push(...manifest.blockers.map((blocker) => `${renderPlan.slug}: ${blocker}`));
  }

  const pilotManifests = buildPilotUiBridgeManifests({ slugs: PILOT_UI_BRIDGE_SLUGS });
  const pilotManifestsReady = pilotManifests.filter(
    (manifest) => manifest.status === "ui_bridge_ready",
  ).length;

  const uiBridgeReady = manifests.filter(
    (manifest) => manifest.status === "ui_bridge_ready",
  ).length;

  return {
    renderingReady,
    uiBridgeReady,
    blocked: manifests.filter((manifest) => manifest.status === "blocked").length,
    pilotManifestsReady,
    manifests,
    pilotManifests,
    recommendedFirstUiPilot: selectRecommendedFirstUiPilot(manifests),
    derivedReadonlyViolations: countDerivedReadonlyViolations(manifests),
    warnings,
    blockers,
  };
}

export function formatBatchSmartFormUiBridgeAuditReport(
  result: BatchSmartFormUiBridgeAuditResult,
): string {
  const lines = [
    "Smart Form UI Bridge Audit",
    `Rendering ready: ${result.renderingReady}`,
    `UI bridge ready: ${result.uiBridgeReady}`,
    `Blocked: ${result.blocked}`,
    `Pilot manifests ready: ${result.pilotManifestsReady}`,
    "",
    "Recommended first UI pilot:",
  ];

  if (result.recommendedFirstUiPilot.length === 0) {
    lines.push("- (none — resolve blockers first)");
  } else {
    result.recommendedFirstUiPilot.forEach((slug, index) => {
      lines.push(`${index + 1}. ${slug}`);
    });
  }

  if (result.blockers.length > 0) {
    lines.push("", "Blockers:");
    for (const blocker of result.blockers.slice(0, 5)) {
      lines.push(`- ${blocker}`);
    }
  }

  return lines.join("\n");
}
