import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

const BREAK_EVEN_TOOL_KEY = "break-even-survival-cash-calculator";
const DISPLAY_CURRENCY_UNIT = "display_currency";

/**
 * Applies narrowly scoped presentation metadata without changing the formula
 * namespace, canonical base units, or the no-FX calculation contract.
 *
 * The break-even schema stores monetary values canonically as currency_unit.
 * The universal renderer requires a neutral display token to render the user's
 * selected ISO currency instead of a hardcoded dollar symbol. Both tokens use
 * an identity factor, so this is a presentation conversion only.
 */
export function applySchemaPresentationOverrides(schema: SuperV4Schema): SuperV4Schema {
  if (schema.tool_key !== BREAK_EVEN_TOOL_KEY) return schema;

  const registry = schema.unit_conversion_contract.conversion_registry;
  const currencyEntry = registry.currency as unknown as {
    base_unit?: string;
    unit_family?: string;
    units?: Array<{ unit: string; factor: number; offset?: number; label?: string }>;
  } | undefined;

  const existingUnits = Array.isArray(currencyEntry?.units) ? currencyEntry.units : [];
  const hasDisplayCurrency = existingUnits.some((entry) => entry.unit === DISPLAY_CURRENCY_UNIT);
  const currencyUnits = hasDisplayCurrency
    ? existingUnits
    : [...existingUnits, { unit: DISPLAY_CURRENCY_UNIT, factor: 1, label: "Currency" }];

  return {
    ...schema,
    unit_conversion_contract: {
      ...schema.unit_conversion_contract,
      conversion_registry: {
        ...registry,
        currency: {
          ...(currencyEntry ?? {}),
          base_unit: currencyEntry?.base_unit ?? "currency_unit",
          unit_family: currencyEntry?.unit_family ?? "CURRENCY",
          units: currencyUnits,
        },
      },
    },
    inputs: schema.inputs.map((input) =>
      input.quantity_kind === "currency"
        ? {
            ...input,
            unit_selectable: false,
            allowed_display_units: [DISPLAY_CURRENCY_UNIT],
          }
        : input,
    ),
    outputs: schema.outputs.map((output) =>
      output.quantity_kind === "currency"
        ? ({ ...output, unit: DISPLAY_CURRENCY_UNIT } as typeof output)
        : output,
    ),
  };
}
