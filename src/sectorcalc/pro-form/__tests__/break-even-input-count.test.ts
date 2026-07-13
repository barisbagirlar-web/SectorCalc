import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("break-even input contract size", () => {
  it("contains exactly ten decision inputs and ten normalized inputs", () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      inputs: unknown[];
      normalized_inputs: unknown[];
    };

    expect(schema.inputs).toHaveLength(10);
    expect(schema.normalized_inputs).toHaveLength(10);
  });
});
