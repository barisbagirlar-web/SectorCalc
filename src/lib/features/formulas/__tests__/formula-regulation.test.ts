import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import {
  assertFormulaRegulationMetadata,
  resolveFormulaRegulationMetadata,
} from "@/lib/features/formulas/formula-regulation";

describe("formula-regulation", () => {
  test("every FormulaContract resolves regulation metadata", () => {
    for (const contract of FORMULA_CONTRACTS) {
      const metadata = resolveFormulaRegulationMetadata(contract);
      expect(() => assertFormulaRegulationMetadata(metadata)).not.toThrow();
      expect(metadata.source).toContain(contract.slug);
    }
  });
});
