/**
 * Phase 5H-G-A — smart form architecture CLI shape tests.
 */

import { describe, expect, test } from "vitest";
import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
import {
  buildBatchSmartFormArchitecturePlan,
  formatSmartFormArchitectureReport,
} from "@/lib/formula-governance/input-design-audit/smart-form-architecture/smart-form-architecture-builder";

describe("audit smart form architecture script shape", () => {
  test("summary shape is produced for patched tools", () => {
    const plan = buildBatchSmartFormArchitecturePlan(ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS);

    expect(plan.totalTools).toBe(15);
    expect(plan.renderingReady).toBe(15);
    expect(plan.pending).toBe(0);
    expect(plan.specs).toHaveLength(15);
  });

  test("formatted report does not throw", () => {
    const plan = buildBatchSmartFormArchitecturePlan(ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS);
    expect(() => formatSmartFormArchitectureReport(plan)).not.toThrow();
    const formatted = formatSmartFormArchitectureReport(plan);
    expect(formatted).toContain("Smart Form Architecture Summary");
    expect(formatted).toContain("Rendering ready: 15");
  });
});
