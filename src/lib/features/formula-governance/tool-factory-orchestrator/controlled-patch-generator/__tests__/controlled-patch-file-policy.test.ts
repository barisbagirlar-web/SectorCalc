/**
 * Controlled patch file policy tests — Phase 5I-E.
 */

import { describe, expect, test } from "vitest";
import {
  isForbiddenTargetPath,
  validateProposedOperations,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-file-policy";

describe("controlled patch file policy — Phase 5I-E", () => {
  test("calculators path is forbidden", () => {
    expect(isForbiddenTargetPath("src/lib/calculators/foo.ts")).toBe(true);
  });

  test("validateProposedOperations produces blocker for calculators", () => {
    const violations = validateProposedOperations([
      {
        kind: "update_file",
        targetPath: "src/lib/calculators/risk.ts",
        summary: "bad",
      },
    ]);
    expect(violations.some((v) => v.includes("calculators"))).toBe(true);
  });

  test("governance metadata path is allowed", () => {
    expect(isForbiddenTargetPath("src/lib/formula-governance/contracts/foo.ts")).toBe(false);
  });
});
