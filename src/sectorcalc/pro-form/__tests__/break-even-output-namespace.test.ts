import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REQUIRED_OUTPUTS = [
  "out_break_even_monthly_revenue",
  "out_current_revenue_gap",
  "out_stressed_monthly_revenue",
  "out_monthly_cash_burn",
  "out_cash_runway_months",
  "out_survival_cash_target",
  "out_funding_gap",
  "out_margin_of_safety_ratio",
  "out_source_confidence_ratio",
  "out_uncertainty_cash_buffer",
  "out_target_runway_breached",
  "out_decision_code",
].sort();

describe("break-even output namespace", () => {
  it("declares one unique output for every governed domain metric", () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      outputs: Array<{ id: string }>;
    };
    const ids = schema.outputs.map((output) => output.id);

    expect(ids.length).toBe(new Set(ids).size);
    expect([...ids].sort()).toEqual(REQUIRED_OUTPUTS);
  });
});
