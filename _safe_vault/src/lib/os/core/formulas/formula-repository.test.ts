import { describe, expect, test } from "vitest";
import { FormulaRepository, formulaRepository } from "@/lib/os/core/formulas/formula-repository";

describe("FormulaRepository", () => {
  test("executes efficiency score for registered sector", () => {
    expect(formulaRepository.execute("cnc", { target: 100, actual: 100, cost: 50 })).toBe(100);
  });

  test("executeFull returns variance and loss", () => {
    const result = formulaRepository.executeFull("logistics", {
      target: 100,
      actual: 110,
      cost: 20,
    });

    expect(result.sectorId).toBe("logistics");
    expect(result.efficiencyScore).toBe(90);
    expect(result.financialLoss).toBe(200);
  });

  test("allows custom formula registration", () => {
    const repo = new FormulaRepository();
    repo.register("finance", () => 42);
    expect(repo.execute("finance", { target: 1, actual: 1, cost: 1 })).toBe(42);
  });

  test("throws when formula missing", () => {
    const repo = new FormulaRepository({} as never);
    expect(() => repo.execute("cnc", { target: 1, actual: 1, cost: 1 })).toThrow(
      "FORMULA_NOT_FOUND",
    );
  });
});
