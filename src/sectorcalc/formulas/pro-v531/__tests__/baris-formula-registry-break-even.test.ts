import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("Baris formula registry break-even binding", () => {
  it("registers the isolated domain version and exact output contract", async () => {
    const { formulaRegistry } = await import(
      "@/sectorcalc/pro-runtime/formula-registry"
    );
    const formula = await import(
      "../break-even-survival-cash-calculator.formula"
    );
    await import("../baris-formula-registry");

    const record = formulaRegistry.fetch("PRO_031", formula.formulaVersion);
    expect(record).not.toBeNull();
    expect(record?.tool_key).toBe(formula.toolKey);
    expect(record?.formula_version).toBe("5.3.1-pro-baris.3");
    expect(record?.nodes.map((node) => node.output_ref)).toEqual([
      ...formula.declaredOutputKeys,
    ]);
  });
});
