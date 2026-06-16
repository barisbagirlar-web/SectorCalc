import { describe, expect, it } from "vitest";
import { compileFormulaExpression } from "@/lib/generated-tools/compile-formula-expression";

const baseOptions = {
  inputIds: ["design_pressure"],
  inputToAccess: (id: string) => `input.${id}`,
  formulaKeys: ["thickness_with_corrosion", "primary_result"],
};

describe("compileFormulaExpression", () => {
  it("maps CEILING without double Math prefix", () => {
    const compiled = compileFormulaExpression("CEILING(thickness_with_corrosion * 2) / 2", {
      ...baseOptions,
      selfKey: "primary_result",
    });
    expect(compiled).toBe("Math.ceil((results[\"thickness_with_corrosion\"] ?? 0) * 2) / 2");
    expect(compiled).not.toContain("Math.Math");
  });

  it("maps IF(cond, then, else) to ternary", () => {
    const compiled = compileFormulaExpression("IF(design_pressure > 1, 3.5, 2.5)", baseOptions);
    expect(compiled).toBe("((input.design_pressure > 1) ? (3.5) : (2.5))");
  });

  it("maps PI constant", () => {
    const compiled = compileFormulaExpression("PI * 2", baseOptions);
    expect(compiled).toBe("Math.PI * 2");
  });

  it("does not double-prefix nested math calls", () => {
    const compiled = compileFormulaExpression("ABS(SQRT(design_pressure))", baseOptions);
    expect(compiled).toBe("Math.abs(Math.sqrt(input.design_pressure))");
    expect(compiled).not.toContain("Math.Math");
  });

  it("expands uniform discounted sum geometric series", () => {
    const compiled = compileFormulaExpression(
      "-initial_investment + SUM_{t=1}^{project_life_years} (adjusted_cash_flow / (1 + discount_rate/100)^t)",
      {
        inputIds: ["initial_investment", "project_life_years", "adjusted_cash_flow", "discount_rate"],
        inputToAccess: (id: string) => `input.${id}`,
        formulaKeys: ["net_present_value"],
        selfKey: "net_present_value",
      },
    );
    expect(compiled).toContain("Math.pow");
    expect(compiled).not.toBeNull();
  });

  it("strips unicode assignment prefix and maps IF THEN", () => {
    const compiled = compileFormulaExpression(
      "μ_eff = IF(population_mean != null, population_mean, sample_mean)",
      {
        inputIds: ["population_mean", "sample_mean"],
        inputToAccess: (id: string) => `input.${id}`,
        formulaKeys: ["effective_mean", "sample_mean", "population_mean"],
        selfKey: "effective_mean",
      },
    );
    expect(compiled).toContain("population_mean");
    expect(compiled).not.toBeNull();
  });
});
