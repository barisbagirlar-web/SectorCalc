import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import {
  INVESTMENT_APPRAISAL_FORMULA_VERSION,
  INVESTMENT_APPRAISAL_MODEL_ID,
  calculateDiscreteNpv,
  evaluateInvestmentAppraisal,
  type InvestmentAppraisalInput,
  type InvestmentAppraisalResult,
} from "@/sectorcalc/formulas/pro-v531/investment-appraisal-core";
import * as formula from "@/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula";
import { normalizeInputs } from "@/sectorcalc/pro-form/unit-normalizer";
import { normalizeProSchema } from "@/sectorcalc/runtime/pro-schema-loader";
import type { ExecuteRequest, SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

interface ReferenceCase {
  name: string;
  input: InvestmentAppraisalInput;
  expected: InvestmentAppraisalResult;
}

interface ReferenceFixture {
  model_id: string;
  formula_version: string;
  cases: ReferenceCase[];
}

const fixture = JSON.parse(
  readFileSync(
    join(
      process.cwd(),
      "tests/fixtures/pro-calculation-reference/investment-appraisal-discrete-v1.json",
    ),
    "utf8",
  ),
) as ReferenceFixture;

function expectClose(actual: number | null, expected: number | null): void {
  if (expected === null) {
    expect(actual).toBeNull();
    return;
  }
  expect(actual).not.toBeNull();
  expect(actual as number).toBeCloseTo(expected, 9);
}

function loadProductionSchema(): SuperV4Schema {
  const raw = JSON.parse(
    readFileSync(
      join(
        process.cwd(),
        "src/sectorcalc/schemas/pro-v531/capital-equipment-investment-appraisal-npv-irr.schema.json",
      ),
      "utf8",
    ),
  );
  return normalizeProSchema(raw);
}

describe("investment appraisal reference contract", () => {
  it("binds the fixture to the reviewed model and formula version", () => {
    expect(fixture.model_id).toBe(INVESTMENT_APPRAISAL_MODEL_ID);
    expect(fixture.formula_version).toBe(INVESTMENT_APPRAISAL_FORMULA_VERSION);
    expect(formula.formulaVersion).toBe(INVESTMENT_APPRAISAL_FORMULA_VERSION);
  });

  for (const reference of fixture.cases) {
    it(`matches independent reference values: ${reference.name}`, () => {
      const actual = evaluateInvestmentAppraisal(reference.input);

      for (const key of Object.keys(reference.expected) as Array<keyof InvestmentAppraisalResult>) {
        const expectedValue = reference.expected[key];
        const actualValue = actual[key];
        if (typeof expectedValue === "number" && typeof actualValue === "number") {
          expectClose(actualValue, expectedValue);
        } else {
          expect(actualValue).toBe(expectedValue);
        }
      }

      if (actual.internalRateOfReturn !== null) {
        expect(
          calculateDiscreteNpv(
            reference.input.initialInvestment,
            reference.input.annualCashFlow,
            actual.internalRateOfReturn,
            reference.input.periods,
            reference.input.residualValue,
          ),
        ).toBeCloseTo(0, 6);
      }
    });
  }

  it("counts residual value exactly once", () => {
    const withoutResidual = calculateDiscreteNpv(500000, 150000, 0.1, 5, 0);
    const withResidual = calculateDiscreteNpv(500000, 150000, 0.1, 5, 50000);
    expect(withResidual - withoutResidual).toBeCloseTo(50000 / 1.1 ** 5, 9);
  });

  it("rejects fractional periods instead of silently rounding", () => {
    expect(() =>
      evaluateInvestmentAppraisal({
        ...fixture.cases[0].input,
        periods: 5.5,
      }),
    ).toThrow(/whole number/);
  });

  it("does not invent an IRR for a non-conventional cash-flow pattern", () => {
    const result = evaluateInvestmentAppraisal({
      initialInvestment: 1000,
      annualCashFlow: -10,
      discountRate: 0.1,
      periods: 5,
      residualValue: 0,
      downsideFactor: 0,
      sourceConfidenceRatio: 1,
      uncertaintyMultiplier: 0,
    });
    expect(result.internalRateOfReturn).toBeNull();
  });

  it("publishes semantic finite outputs and fails closed on missing inputs", () => {
    const valid = formula.calculate({
      n_initial_investment: 500000,
      n_annual_net_cash_flow: 150000,
      n_discount_rate: 0.1,
      n_analysis_years: 5,
      n_residual_value: 50000,
      n_stress_downside_factor: 0.2,
      n_source_confidence_ratio: 0.95,
      n_uncertainty_multiplier: 1.2,
    });
    expect(valid.outputs.out_net_present_value).toBeCloseTo(99664.08156422499, 9);
    expect(valid.outputKeys.every((key) => key.startsWith("out_"))).toBe(true);
    expect(valid.outputKeys.every((key) => Number.isFinite(valid.outputs[key]))).toBe(true);
    expect(valid.outputKeys).not.toContain("out_normalized_demand");

    const invalid = formula.calculate({});
    expect(invalid.status).toBe("BLOCKED");
    expect(invalid.outputKeys).toEqual([]);
    expect(invalid.warnings.length).toBeGreaterThan(0);
  });

  it("uses the production form schema and percent normalization end to end", () => {
    const schema = loadProductionSchema();
    expect(schema.inputs.map((input) => input.id)).toEqual([
      "initial_investment",
      "annual_net_cash_flow",
      "discount_rate",
      "analysis_years",
      "residual_value",
      "stress_downside_factor",
      "source_confidence_ratio",
      "uncertainty_multiplier",
    ]);
    expect(schema.metadata.formula_version).toBe(INVESTMENT_APPRAISAL_FORMULA_VERSION);
    expect(schema.outputs.map((output) => output.id)).toContain("out_net_present_value");

    const rawInputs = {
      initial_investment: 500000,
      annual_net_cash_flow: 150000,
      discount_rate: 10,
      analysis_years: 5,
      residual_value: 50000,
      stress_downside_factor: 20,
      source_confidence_ratio: 95,
      uncertainty_multiplier: 1.2,
    };
    const selectedUnits = {
      initial_investment: "currency_unit",
      annual_net_cash_flow: "currency_unit",
      discount_rate: "percent",
      analysis_years: "year",
      residual_value: "currency_unit",
      stress_downside_factor: "percent",
      source_confidence_ratio: "percent",
      uncertainty_multiplier: "ratio",
    };
    const normalized = normalizeInputs(
      rawInputs,
      selectedUnits,
      schema,
      schema.unit_conversion_contract.conversion_registry,
    );
    expect(normalized.errors).toEqual([]);

    const formulaInputs: Record<string, number> = {};
    for (const input of schema.inputs) {
      formulaInputs[input.normalized_id as string] = normalized.normalized[input.id].baseValue;
    }
    const result = formula.calculate(formulaInputs);
    expect(formulaInputs.n_discount_rate).toBeCloseTo(0.1, 12);
    expect(formulaInputs.n_stress_downside_factor).toBeCloseTo(0.2, 12);
    expect(result.outputs.out_net_present_value).toBeCloseTo(99664.08156422499, 9);
  });

  it("propagates the executed formula version into the API audit seal", async () => {
    const schema = loadProductionSchema();
    const body = {
      tool_id: schema.tool_id,
      tool_key: schema.tool_key,
      schema_version: schema.metadata.schema_version,
      raw_inputs: {
        initial_investment: 500000,
        annual_net_cash_flow: 150000,
        discount_rate: 10,
        analysis_years: 5,
        residual_value: 50000,
        stress_downside_factor: 20,
        source_confidence_ratio: 95,
        uncertainty_multiplier: 1.2,
      },
      selected_units: {
        initial_investment: "currency_unit",
        annual_net_cash_flow: "currency_unit",
        discount_rate: "percent",
        analysis_years: "year",
        residual_value: "currency_unit",
        stress_downside_factor: "percent",
        source_confidence_ratio: "percent",
        uncertainty_multiplier: "ratio",
      },
      output_units: {},
      display_currency: "USD",
      user_profile_mode: "engineering",
    } as ExecuteRequest;
    const { pass2RuntimeExecution, pass3PublicControl } = await import(
      "@/app/api/pro-calculator/execute/route"
    );

    const pass2 = await pass2RuntimeExecution(body, schema);
    expect(pass2.ok).toBe(true);
    expect(pass2.formulaVersion).toBe(INVESTMENT_APPRAISAL_FORMULA_VERSION);
    const npv = pass2.outputs.find((output) => output.id === "out_net_present_value")?.value;
    expect(Number(npv)).toBeCloseTo(99664.08156422499, 9);

    const pass3 = pass3PublicControl(body, schema, pass2);
    expect(pass3.auditSeal.formula_version).toBe(INVESTMENT_APPRAISAL_FORMULA_VERSION);
    expect(pass3.auditSeal.seal_status).toBe("SEALED");
    expect(pass3.auditSeal.signature_status).toBe("SERVER_SIGNATURE_OPTIONAL");
    expect(pass3.auditSeal.schema_hash).toMatch(/^sha256:[0-9a-f]{64}$/);
  });
});
