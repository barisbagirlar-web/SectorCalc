import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("break-even formula version contract", () => {
  it("matches schema and formula module exactly", async () => {
    const schemaPath = path.join(
      process.cwd(),
      "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    );
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      metadata: { formula_version: string };
    };
    const formula = await import(
      "@/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula"
    );

    expect(schema.metadata.formula_version).toBe("5.3.1-pro-baris.3");
    expect(formula.formulaVersion).toBe(schema.metadata.formula_version);
  });
});
