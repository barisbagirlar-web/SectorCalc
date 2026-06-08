/**
 * Smart Form Architecture phase status — Phase 5H-G-A.
 */

import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
import {
  buildBatchSmartFormArchitecturePlan,
  isSmartFormRenderingReady,
} from "@/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-architecture-builder";

export const SMART_FORM_ARCHITECTURE_PHASE = "5H-G-A" as const;

export const SMART_FORM_ARCHITECTURE_SOURCE_SLUGS = ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS;

export function listSmartFormRenderingReadySlugs(): readonly string[] {
  return SMART_FORM_ARCHITECTURE_SOURCE_SLUGS.filter((slug) => isSmartFormRenderingReady(slug));
}

export function resolveSmartFormArchitectureCoverage(): {
  readonly total: number;
  readonly renderingReady: number;
  readonly pending: number;
} {
  const plan = buildBatchSmartFormArchitecturePlan(SMART_FORM_ARCHITECTURE_SOURCE_SLUGS);
  return {
    total: plan.totalTools,
    renderingReady: plan.renderingReady,
    pending: plan.pending,
  };
}
