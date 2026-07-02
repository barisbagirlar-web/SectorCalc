/**
 * Batch smart form render audit - Phase 5H-G-B read-only governance audit.
 */

import { FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import type { SmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-types";
import { buildSmartFormRenderPlan } from "@/lib/features/formula-governance/smart-form-rendering/smart-form-render-adapter";
import type {
  BatchSmartFormRenderAuditResult,
  SmartFormRenderMode,
  SmartFormRenderPlan,
} from "@/lib/features/formula-governance/smart-form-rendering/smart-form-render-types";

export type RunBatchSmartFormRenderAuditParams = {
  readonly smartFormPlans: readonly SmartFormPlan[];
  readonly renderMode: SmartFormRenderMode;
};

function countDerivedReadonlyViolations(renderPlans: readonly SmartFormRenderPlan[]): number {
  let violations = 0;
  for (const plan of renderPlans) {
    for (const section of plan.sections) {
      for (const field of section.fields) {
        if (field.role === "derived" && field.editable) {
          violations += 1;
        }
      }
    }
  }
  return violations;
}

function selectRecommendedFirstUiPilot(
  renderPlans: readonly SmartFormRenderPlan[],
): readonly string[] {
  const readySlugs = new Set(
    renderPlans
      .filter((plan) => plan.readinessStatus === "rendering_adapter_ready")
      .map((plan) => plan.slug),
  );

  const fromFirstBatch = FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.filter((slug) =>
    readySlugs.has(slug),
  );

  if (fromFirstBatch.length >= 3) {
    return fromFirstBatch.slice(0, 3);
  }

  return renderPlans
    .filter((plan) => plan.readinessStatus === "rendering_adapter_ready")
    .map((plan) => plan.slug)
    .slice(0, 3);
}

export function runBatchSmartFormRenderAudit(
  params: RunBatchSmartFormRenderAuditParams,
): BatchSmartFormRenderAuditResult {
  const { smartFormPlans, renderMode } = params;
  const renderPlans: SmartFormRenderPlan[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  const readySpecs = smartFormPlans.filter(
    (plan) => plan.readinessStatus === "ready_for_spec",
  ).length;

  for (const spec of smartFormPlans) {
    const renderPlan = buildSmartFormRenderPlan({ smartFormSpec: spec, renderMode });
    renderPlans.push(renderPlan);
    warnings.push(...renderPlan.warnings.map((warning) => `${spec.slug}: ${warning}`));
    blockers.push(...renderPlan.blockers.map((blocker) => `${spec.slug}: ${blocker}`));
  }

  const renderingAdapterReady = renderPlans.filter(
    (plan) => plan.readinessStatus === "rendering_adapter_ready",
  ).length;

  const derivedReadonlyViolations = countDerivedReadonlyViolations(renderPlans);

  const trustTracePanelCount = renderPlans.filter(
    (plan) => plan.trustTracePanel.enabled,
  ).length;

  return {
    readySpecs,
    renderingAdapterReady,
    blocked: renderPlans.filter((plan) => plan.readinessStatus === "blocked").length,
    derivedReadonlyViolations,
    trustTracePanelCount,
    renderPlans,
    recommendedFirstUiPilot: selectRecommendedFirstUiPilot(renderPlans),
    warnings,
    blockers,
  };
}

export function formatBatchSmartFormRenderAuditReport(
  result: BatchSmartFormRenderAuditResult,
): string {
  const lines = [
    "Smart Form Rendering Audit",
    `Ready specs: ${result.readySpecs}`,
    `Rendering adapter ready: ${result.renderingAdapterReady}`,
    `Blocked: ${result.blocked}`,
    `Derived readonly violations: ${result.derivedReadonlyViolations}`,
    "",
    "Recommended first UI pilot:",
  ];

  if (result.recommendedFirstUiPilot.length === 0) {
    lines.push("- (none - resolve blockers first)");
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
