import { describe, expect, it } from "vitest";
import { resolveApprovedToolSchema, clearSchemaCache } from "@/sectorcalc/runtime/resolve-approved-tool-schema";

const TOOL_KEY = "break-even-survival-cash-calculator";

describe("break-even currency presentation override", () => {
  it("uses a neutral display currency token without changing canonical currency units", () => {
    clearSchemaCache();
    const resolved = resolveApprovedToolSchema(TOOL_KEY);

    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    const schema = resolved.schema;
    const currencyInputs = schema.inputs.filter((input) => input.quantity_kind === "currency");
    const currencyOutputs = schema.outputs.filter((output) => output.quantity_kind === "currency");
    const currencyRegistry = schema.unit_conversion_contract.conversion_registry.currency as unknown as {
      base_unit?: string;
      units?: Array<{ unit: string; factor: number }>;
    };

    expect(currencyInputs.length).toBeGreaterThan(0);
    expect(currencyInputs.every((input) => input.base_unit === "currency_unit")).toBe(true);
    expect(currencyInputs.every((input) => input.unit_selectable === false)).toBe(true);
    expect(currencyInputs.every((input) => input.allowed_display_units?.[0] === "display_currency")).toBe(true);

    expect(currencyOutputs.length).toBeGreaterThan(0);
    expect(currencyOutputs.every((output) => (output as typeof output & { unit?: string }).unit === "display_currency")).toBe(true);

    expect(currencyRegistry.base_unit).toBe("currency_unit");
    expect(currencyRegistry.units).toEqual(expect.arrayContaining([
      expect.objectContaining({ unit: "currency_unit", factor: 1 }),
      expect.objectContaining({ unit: "display_currency", factor: 1 }),
    ]));

    expect(schema.metadata.formula_version).toBe("5.3.1-pro-baris.3");
    expect(schema.inputs).toHaveLength(10);
    expect(schema.outputs).toHaveLength(12);
  });
});
