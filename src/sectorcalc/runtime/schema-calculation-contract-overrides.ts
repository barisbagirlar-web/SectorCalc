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

function applyToolSpecificInputContract(
  toolKey: string,
  input: SuperV4Input,
): SuperV4Input | null {
  if (toolKey === "loss-making-job-detector") {
    if (input.id === "machine_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Quoted Selling Price per Unit",
        helpText: "Enter the quoted selling price per unit in the selected currency.",
      });
    }
    if (input.id === "labor_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Labor Cost per Unit",
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Overhead Cost per Unit",
      });
    }
  }

  if (toolKey === "receivables-cost-payment-term-addendum") {
    if (input.id === "machine_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Invoice Amount",
      });
    }
    if (input.id === "cycle_time") {
      return withUnit(input, {
        quantityKind: "time",
        baseUnit: "day",
        displayUnit: "day",
        name: "Payment Term (days)",
      });
    }
    if (input.id === "batch_quantity") {
      return withUnit(input, {
        quantityKind: "dimensionless",
        baseUnit: "count",
        displayUnit: "count",
        name: "Annual Invoice Count",
      });
    }
    if (input.id === "material_cost") {
      return withUnit(input, {
        quantityKind: "dimensionless",
        baseUnit: "percent",
        displayUnit: "percent",
        name: "Annual Financing Rate (%)",
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Administration Cost per Invoice",
      });
    }
    if (input.id === "defect_or_loss_cost") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Expected Credit Loss per Invoice",
      });
    }
  }

  if (toolKey === "setup-time-reduction-roi-smed") {
    if (input.id === "machine_rate") {
      return withUnit(input, {
        quantityKind: "currency_rate",
        baseUnit: "currency_unit_per_h",
        displayUnit: "currency_unit_per_h",
        name: "Downtime Cost Rate per Hour",
      });
    }
    if (input.id === "setup_time") {
      return withUnit(input, {
        quantityKind: "time",
        baseUnit: "s",
        displayUnit: "s",
        name: "Current Setup Time",
      });
    }
    if (input.id === "batch_quantity") {
      return withUnit(input, {
        quantityKind: "time",
        baseUnit: "s",
        displayUnit: "s",
        name: "Target Setup Time",
      });
    }
    if (input.id === "annual_volume") {
      return withUnit(input, {
        quantityKind: "rate",
        baseUnit: "changeover_per_year",
        displayUnit: "changeover_per_year",
        name: "Annual Changeovers",
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "SMED Implementation Cost",
      });
    }
  }

  if (toolKey === "product-sku-margin-ranker") {
    if (input.id === "machine_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Unit Selling Price",
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Annual Overhead Pool",
      });
    }
    if (input.id === "defect_or_loss_cost") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Annual Quality and Loss Cost",
      });
    }
  }

  return null;
}

function correctInputContract(toolKey: string, input: SuperV4Input): SuperV4Input {
  const specific = applyToolSpecificInputContract(toolKey, input);
  if (specific) return specific;

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

export function applySchemaCalculationContractOverrides(
  schema: SuperV4Schema,
): SuperV4Schema {
  if (!LIVE_PRO_TOOLS.has(schema.tool_key)) return schema;

  const removedIds = REMOVED_GENERATOR_INPUTS[schema.tool_key] ?? new Set<string>();
  const inputs = schema.inputs
    .filter((input) => !removedIds.has(input.id))
    .map((input) => correctInputContract(schema.tool_key, input));
  const inputById = new Map(inputs.map((input) => [input.id, input]));
  const normalizedInputs = schema.normalized_inputs
    .filter((input) => !removedIds.has(input.from_input))
    .map((input) => {
      const sourceInput = inputById.get(input.from_input);
      return sourceInput
        ? {
            ...input,
            quantity_kind: sourceInput.quantity_kind,
            base_unit: sourceInput.base_unit ?? input.base_unit,
          }
        : input;
    });
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
