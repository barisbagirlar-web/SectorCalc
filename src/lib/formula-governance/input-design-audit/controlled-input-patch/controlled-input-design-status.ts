/**
 * Controlled input design patch completion status — Phase 5H-F.
 */

import {
  CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY,
  FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
} from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import type { ControlledInputDesignNextGate } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";

export const CONTROLLED_INPUT_DESIGN_PATCH_PHASE = "5H-F" as const;

export { FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS };

export function isControlledInputDesignPatchCompleted(slug: string): boolean {
  return slug in CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY;
}

export function listCompletedControlledInputDesignPatchSlugs(): readonly string[] {
  return FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS;
}

export function resolveCompletedPatchNextGate(slug: string): ControlledInputDesignNextGate | undefined {
  return CONTROLLED_INPUT_DESIGN_PATCH_REGISTRY[slug]?.nextGate;
}
