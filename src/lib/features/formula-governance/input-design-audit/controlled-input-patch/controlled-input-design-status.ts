/**
 * Controlled input design patch completion status - Phase 5H-F.
 */

import {
  ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
  getControlledInputDesignPatch,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
} from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import type { ControlledInputDesignNextGate } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";

export const CONTROLLED_INPUT_DESIGN_PATCH_PHASE = "5H-F-5" as const;

export {
  ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  SECOND_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  THIRD_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FOURTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
  FIFTH_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
};

export function isControlledInputDesignPatchCompleted(slug: string): boolean {
  return slug in CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY;
}

export function listCompletedControlledInputDesignPatchSlugs(): readonly string[] {
  return ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS;
}

export function resolveCompletedPatchNextGate(slug: string): ControlledInputDesignNextGate | undefined {
  return getControlledInputDesignPatch(slug)?.nextGate;
}
