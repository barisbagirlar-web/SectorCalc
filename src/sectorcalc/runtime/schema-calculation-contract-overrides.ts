import type { SuperV4Input, SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

const LIVE_PRO_TOOLS = new Set([
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
]);

const COUNT_INPUT_IDS = new Set([
  "batch_quantity",
  "total_parts",
  "good_parts",
  "total_produced",
  "scrap_quantity",
  "rework_quantity",
]);

const ANNUAL_VOLUME_IDS = new Set(["annual_volume"]);
const MONTHLY_VOLUME_IDS = new Set(["monthly_volume"]);

const REMOVED_GENERATOR_INPUTS: Readonly<Record<string, ReadonlySet<string>>> = {
  "customer-sku-profitability-forensics": new Set(["labor_rate", "overhead_rate"]),
};

function withUnit(
  input: SuperV4Input,
  args: {
    quantityKind: string;
    baseUnit: string;
    displayUnit: string;
    name?: string;
    helpText?: string;
  },
): SuperV4Input {
  return {
    ...input,
    name: args.name ?? input.name,
    quantity_kind: args.quantityKind,
    base_unit: args.baseUnit,
    allowed_display_units: [args.displayUnit],
    unit_selectable: false,
    user_help_text: args.helpText ?? input.user_help_text,
    physical_hard_bounds: input.physical_hard_bounds
      ? { ...input.physical_hard_bounds, unit: args.displayUnit }
      : input.physical_hard_bounds,
    engineering_range: input.engineering_range
      ? { ...input.engineering_range, unit: args.displayUnit }
      : input.engineering_range,
    engineering_reference_range: input.engineering_reference_range
      ? { ...input.engineering_reference_range, unit: args.displayUnit }
      : input.engineering_reference_range,
  };
}

function correctInputContract(toolKey: string, input: SuperV4Input): SuperV4Input {
  if (COUNT_INPUT_IDS.has(input.id)) {
    return withUnit(input, {
      quantityKind: "dimensionless",
      baseUnit: "count",
      displayUnit: "count",
    });
  }

  if (ANNUAL_VOLUME_IDS.has(input.id)) {
    return withUnit(input, {
      quantityKind: "rate",
      baseUnit: "unit_per_year",
      displayUnit: "unit_per_year",
    });
  }

  if (MONTHLY_VOLUME_IDS.has(input.id)) {
    return withUnit(input, {
      quantityKind: "rate",
      baseUnit: "unit_per_month",
      displayUnit: "unit_per_month",
    });
  }

  if (input.id.endsWith("_pct")) {
    return withUnit(input, {
      quantityKind: "dimensionless",
      baseUnit: "percent",
      displayUnit: "percent",
    });
  }

  if (
    toolKey === "customer-sku-profitability-forensics" &&
    input.id === "target_margin"
  ) {
    return withUnit(input, {
      quantityKind: "dimensionless",
      baseUnit: "percent",
      displayUnit: "percent",
      name: "Target Net Margin (%)",
    });
  }

  if (
    toolKey === "weld-procedure-cost-consumable-estimation-suite" &&
    input.id === "weld_density"
  ) {
    return withUnit(input, {
      quantityKind: "density",
      baseUnit: "kg_per_m3",
      displayUnit: "g_per_cm3",
      name: "Weld Metal Density (g/cm³)",
      helpText: "Enter weld metal density in g/cm³; the server converts it to kg/m³ before calculation.",
    });
  }

  return input;
}

/**
 * Versioned correction layer for generated V5.3.1 schemas whose unit metadata
 * conflicts with the physical quantity consumed by the deterministic formula.
 * Both the form and execute API resolve this same corrected schema, so display,
 * normalization, validation and reporting remain one closed contract.
 */
export function applySchemaCalculationContractOverrides(
  schema: SuperV4Schema,
): SuperV4Schema {
  if (!LIVE_PRO_TOOLS.has(schema.tool_key)) return schema;

  const removedIds = REMOVED_GENERATOR_INPUTS[schema.tool_key] ?? new Set<string>();
  const inputs = schema.inputs
    .filter((input) => !removedIds.has(input.id))
    .map((input) => correctInputContract(schema.tool_key, input));
  const normalizedInputs = schema.normalized_inputs.filter(
    (input) => !removedIds.has(input.from_input),
  );
  const densityEntry = schema.unit_conversion_contract.conversion_registry.density;
  const densityUnits = densityEntry?.units ?? [];
  const hasGCm3 = densityUnits.some((unit) => unit.unit === "g_per_cm3");

  return {
    ...schema,
    engine_rules: {
      ...(schema.engine_rules ?? {}),
      strict_formula_schema_contract: true,
    },
    unit_conversion_contract: {
      ...schema.unit_conversion_contract,
      conversion_registry: {
        ...schema.unit_conversion_contract.conversion_registry,
        density: densityEntry
          ? {
              ...densityEntry,
              units: hasGCm3
                ? densityUnits
                : [...densityUnits, { unit: "g_per_cm3", factor: 1000, label: "g/cm³" }],
            }
          : {
              base_unit: "kg_per_m3",
              unit_family: "DENSITY",
              units: [
                { unit: "kg_per_m3", factor: 1, label: "kg/m³" },
                { unit: "g_per_cm3", factor: 1000, label: "g/cm³" },
              ],
            },
      },
    },
    inputs,
    normalized_inputs: normalizedInputs,
  };
}
