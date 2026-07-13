import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("break-even public schema protection", () => {
  it("does not expose executable formula expressions in the public schema", () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      formulas: unknown[];
      form_runtime_binding: {
        client_formula_execution: string;
        server_execution_required: boolean;
      };
    };

    expect(schema.formulas).toEqual([]);
    expect(schema.form_runtime_binding.client_formula_execution).toBe(
      "FORBIDDEN",
    );
    expect(schema.form_runtime_binding.server_execution_required).toBe(true);
  });
});
