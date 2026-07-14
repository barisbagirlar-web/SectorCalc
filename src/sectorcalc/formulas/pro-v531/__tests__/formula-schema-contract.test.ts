import { describe, expect, it, vi } from "vitest";
import type { ProFormulaModule } from "../pro-formula-contract";
import {
  validateFormulaModuleBinding,
  validateFormulaResultContract,
} from "../formula-schema-contract";

vi.mock("server-only", () => ({}));

describe("strict Exact Decimal formula schema contract", () => {
  async function loadContract() {
    const formula = await import(
      "../break-even-survival-cash-calculator.formula"
    );
    const { clearSchemaCache, resolveApprovedToolSchema } = await import(
      "@/sectorcalc/runtime/resolve-approved-tool-schema"
    );
    clearSchemaCache();
    const resolved = resolveApprovedToolSchema(formula.toolKey);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) throw new Error(resolved.errors.join(" | "));
    expect(
      (resolved.schema.engine_rules as Record<string, unknown>)
        .strict_formula_schema_contract,
    ).toBe(true);
    return { formula, schema: resolved.schema };
  }

  it("accepts the exact governed input, version, and output contract", async () => {
    const { formula, schema } = await loadContract();
    const result = formula.calculate(formula.sampleInputs);

    expect(
      validateFormulaModuleBinding(schema, formula, formula.sampleInputs),
    ).toEqual([]);
    expect(validateFormulaResultContract(schema, formula, result)).toEqual([]);
  });

  it("rejects a cross-tool normalized input", async () => {
    const { formula, schema } = await loadContract();
    const errors = validateFormulaModuleBinding(schema, formula, {
      ...formula.sampleInputs,
      n_machine_hourly_rate: "500000",
    });
    expect(errors.join(" ")).toContain("Runtime normalized input set");
  });

  it("rejects formula version drift", async () => {
    const { formula, schema } = await loadContract();
    const driftedModule: ProFormulaModule = {
      ...formula,
      formulaVersion: "2.0.0.invalid",
    };
    const errors = validateFormulaModuleBinding(
      schema,
      driftedModule,
      formula.sampleInputs,
    );
    expect(errors.join(" ")).toContain("does not match schema version");
  });

  it("rejects output-key drift and a non-finite result", async () => {
    const { formula, schema } = await loadContract();
    const result = formula.calculate(formula.sampleInputs);
    const corrupted = {
      ...result,
      outputs: {
        ...result.outputs,
        out_break_even_monthly_revenue: Number.NaN,
      },
      outputKeys: result.outputKeys.filter(
        (outputId) => outputId !== "out_decision_state",
      ),
    };
    const errors = validateFormulaResultContract(schema, formula, corrupted);
    expect(errors.join(" ")).toContain("outputKeys");
    expect(errors.join(" ")).toContain("non-finite");
  });
});
