import type {
  ConversionRegistryItem,
  ServerOutput,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";

const BREAK_EVEN_TOOL_KEY = "break-even-survival-cash-calculator";
const DISPLAY_CURRENCY_UNIT = "display_currency";
const NEUTRAL_CURRENCY_LABEL = "Currency";

type SchemaOutputWithMetadata = ServerOutput & {
  quantity_kind?: string;
  base_unit?: string | null;
};

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
  const currencyEntry = registry.currency as ConversionRegistryItem | undefined;
  const existingUnits = currencyEntry?.units ?? [];
  const hasDisplayCurrency = existingUnits.some((entry) => entry.unit === DISPLAY_CURRENCY_UNIT);
  const currencyUnits = hasDisplayCurrency
    ? existingUnits
    : [...existingUnits, { unit: DISPLAY_CURRENCY_UNIT, factor: 1, label: NEUTRAL_CURRENCY_LABEL }];

  return {
    ...schema,
    unit_conversion_contract: {
      ...schema.unit_conversion_contract,
      conversion_registry: {
        ...registry,
        currency: {
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
            physical_hard_bounds: input.physical_hard_bounds
              ? { ...input.physical_hard_bounds, unit: NEUTRAL_CURRENCY_LABEL }
              : input.physical_hard_bounds,
            engineering_range: input.engineering_range
              ? { ...input.engineering_range, unit: NEUTRAL_CURRENCY_LABEL }
              : input.engineering_range,
            engineering_reference_range: input.engineering_reference_range
              ? { ...input.engineering_reference_range, unit: NEUTRAL_CURRENCY_LABEL }
              : input.engineering_reference_range,
          }
        : input,
    ),
    outputs: schema.outputs.map((output) => {
      const typedOutput = output as SchemaOutputWithMetadata;
      return typedOutput.quantity_kind === "currency"
        ? { ...output, unit: DISPLAY_CURRENCY_UNIT }
        : output;
    }),
  };
}
