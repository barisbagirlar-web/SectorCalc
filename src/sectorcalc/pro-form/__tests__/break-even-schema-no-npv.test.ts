import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getFormToSchemaMap } from "../pro-execute-payload-adapter";

const NPV_FIELDS = [
  "initial_investment",
  "annual_net_cash_flow",
  "discount_rate",
  "analysis_years",
  "residual_value",
  "stress_downside_factor",
];

describe("break-even schema NPV contamination guard", () => {
  it("contains no capital-appraisal fields in schema or adapter mapping", () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      inputs: Array<{ id: string }>;
      normalized_inputs: Array<{ id: string }>;
    };
    const adapter = getFormToSchemaMap(
      "break-even-survival-cash-calculator",
    );
    const schemaIds = [
      ...schema.inputs.map((input) => input.id),
      ...schema.normalized_inputs.map((input) => input.id),
    ];
    const adapterIds = Object.keys(adapter ?? {});

    for (const field of NPV_FIELDS) {
      expect(schemaIds).not.toContain(field);
      expect(schemaIds).not.toContain(`n_${field}`);
      expect(adapterIds).not.toContain(field);
      expect(adapterIds).not.toContain(`n_${field}`);
    }
  });
});
