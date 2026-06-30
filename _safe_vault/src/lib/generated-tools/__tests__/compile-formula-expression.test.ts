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
    expect(compiled).toBe("Math.ceil((toNumericFormulaValue(results[\"thickness_with_corrosion\"])) * 2) / 2");
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

  it("compiles multi-statement inputs.* loan formula via script fallback", () => {
    const compiled = compileFormulaExpression(
      "const boatPrice = inputs.boatPrice; const salesTaxRate = inputs.salesTaxRate; return boatPrice * (1 + salesTaxRate / 100);",
      {
        inputIds: ["boatPrice", "salesTaxRate"],
        inputToAccess: (id: string) => `input.${id}`,
        formulaKeys: ["monthlyPayment"],
        selfKey: "monthlyPayment",
      },
    );
    expect(compiled).toContain("input.boatPrice");
    expect(compiled).not.toBeNull();
  });

  it("compiles invoked arrow function formulas", () => {
    const compiled = compileFormulaExpression(
      "((n,k,d) => { return k > 0 ? n * k : 0; })(n, k_eff, decimalPlaces)",
      {
        inputIds: ["n", "k", "decimalPlaces"],
        inputToAccess: (id: string) => `input.${id}`,
        formulaKeys: ["k_eff", "primary"],
        selfKey: "primary",
      },
    );
    expect(compiled).toContain("input.n");
    expect(compiled).not.toBeNull();
  });

  it("compiles python-style if/else conditionals without dotAll regex", () => {
    const compiled = compileFormulaExpression(
      "if design_pressure > 1: 3.5; else: 2.5",
      {
        inputIds: ["design_pressure"],
        inputToAccess: (id: string) => `input.${id}`,
        formulaKeys: ["primary_result"],
        selfKey: "primary_result",
      },
    );
    expect(compiled).toBe("((input.design_pressure > 1) ? (3.5) : (2.5))");
  });
});
