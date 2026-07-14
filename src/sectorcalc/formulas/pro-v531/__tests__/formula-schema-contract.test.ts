import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import type { ProFormulaModule } from "../pro-formula-contract";
import {
  validateFormulaModuleBinding,
  validateFormulaResultContract,
} from "../formula-schema-contract";

vi.mock("server-only", () => ({}));

function loadSchema(): SuperV4Schema {
  const schemaPath = path.join(
    process.cwd(),
    "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
  );
  return JSON.parse(readFileSync(schemaPath, "utf8")) as SuperV4Schema;
}

async function loadFormula(): Promise<ProFormulaModule> {
  return import("../break-even-survival-cash-calculator.formula");
}

describe("strict formula schema contract", () => {
  it("accepts the exact governed input, version, and output contract", async () => {
    const schema = loadSchema();
    const formula = await loadFormula();
    const result = formula.calculate(formula.sampleInputs);

    expect(
      validateFormulaModuleBinding(schema, formula, formula.sampleInputs),
    ).toEqual([]);
    expect(validateFormulaResultContract(schema, formula, result)).toEqual([]);
  });

  it("rejects a cross-tool normalized input", async () => {
    const schema = loadSchema();
    const formula = await loadFormula();

    const errors = validateFormulaModuleBinding(schema, formula, {
      ...formula.sampleInputs,
      n_initial_investment: 500000,
    });

    expect(errors.join(" ")).toContain("Runtime normalized input set");
  });

  it("rejects formula version drift", async () => {
    const schema = loadSchema();
    const formula = await loadFormula();
    const driftedModule: ProFormulaModule = {
      ...formula,
      formulaVersion: "5.3.1-pro-baris.invalid",
    };

    const errors = validateFormulaModuleBinding(
      schema,
      driftedModule,
      formula.sampleInputs,
    );

    expect(errors.join(" ")).toContain("does not match schema version");
  });

  it("rejects a missing schema output and a non-finite result", async () => {
    const schema = loadSchema();
    const formula = await loadFormula();
    const result = formula.calculate(formula.sampleInputs);
    const corrupted = {
      ...result,
      outputs: {
        ...result.outputs,
        out_break_even_monthly_revenue: Number.NaN,
      },
      outputKeys: result.outputKeys.filter(
        (outputId) => outputId !== "out_decision_code",
      ),
    };

    const errors = validateFormulaResultContract(schema, formula, corrupted);

    expect(errors.join(" ")).toContain("outputKeys");
    expect(errors.join(" ")).toContain("non-finite");
  });
});
