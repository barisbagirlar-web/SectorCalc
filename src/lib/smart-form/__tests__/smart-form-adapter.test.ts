import { describe, expect, test } from "vitest";
import { buildSmartFormForTool } from "@/lib/smart-form/smart-form-adapter";
import { getRevenueToolByFreeSlug, getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";

describe("smart-form-adapter", () => {
  test("builds contract metadata for full-loop free slug", () => {
    const result = buildSmartFormForTool("profit-margin-calculator");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe("contract");
      expect(result.allInputs.length).toBeGreaterThan(0);
      expect(result.simpleSections.length).toBeGreaterThan(0);
    }
  });

  test("builds revenue metadata when explicit revenue config is supplied", () => {
    const tool = getRevenueToolByFreeSlug("machine-time-calculator");
    expect(tool).not.toBeNull();
    const result = buildSmartFormForTool("revenue-adapter-test-slug", {
      kind: "revenue",
      inputs: tool!.freeInputs,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toBe("revenue");
      expect(result.allInputs.every((input) => input.canonicalKey === input.key)).toBe(true);
    }
  });

  test("builds revenue metadata for premium tool", () => {
    const tool = getRevenueToolByPaidSlug("change-order-impact-analyzer");
    expect(tool).not.toBeNull();
    const result = buildSmartFormForTool(tool!.paidSlug, {
      kind: "revenue",
      inputs: tool!.paidInputs,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.simpleSections.flatMap((section) => section.inputs).length).toBeLessThanOrEqual(6);
    }
  });

  test("returns safe failure when no config", () => {
    const result = buildSmartFormForTool("nonexistent-tool-slug-xyz");
    expect(result.ok).toBe(false);
  });
});
