import type {
  FormulaSpecPublic,
  SuperV4Input,
  SuperV4Schema,
  UiContract,
} from "@/sectorcalc/pro-form/contract-types";

/**
 * Explicit formula boundaries for every LIVE PRO tool. Generated schemas once
 * carried a generic superset of inputs; paid execution now exposes only inputs
 * consumed by the approved deterministic module.
 */
export const LIVE_PRO_NORMALIZED_INPUT_CONTRACTS: Readonly<
  Record<string, readonly string[]>
> = {
  "break-even-survival-cash-calculator": [
    "n_monthly_fixed_cash_cost",
    "n_monthly_debt_service",
    "n_contribution_margin_ratio",
    "n_current_monthly_revenue",
    "n_unrestricted_cash_balance",
    "n_minimum_cash_buffer",
    "n_target_survival_months",
    "n_downside_revenue_factor",
    "n_source_confidence_ratio",
    "n_uncertainty_multiplier",
  ],
  "machine-hourly-rate-proof-report": [
    "n_machine_rate",
    "n_cycle_time",
    "n_setup_time",
    "n_batch_quantity",
    "n_material_cost",
    "n_target_margin",
    "n_annual_volume",
    "n_labor_rate",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_source_confidence_ratio",
    "n_uncertainty_multiplier",
  ],
  "loss-making-job-detector": [
    "n_machine_rate",
    "n_material_cost",
    "n_labor_rate",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_target_margin",
    "n_batch_quantity",
    "n_annual_volume",
    "n_source_confidence_ratio",
  ],
  "receivables-cost-payment-term-addendum": [
    "n_machine_rate",
    "n_cycle_time",
    "n_batch_quantity",
    "n_material_cost",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_source_confidence_ratio",
  ],
  "setup-time-reduction-roi-smed": [
    "n_machine_rate",
    "n_setup_time",
    "n_batch_quantity",
    "n_annual_volume",
    "n_labor_rate",
    "n_overhead_rate",
    "n_source_confidence_ratio",
  ],
  "product-sku-margin-ranker": [
    "n_machine_rate",
    "n_cycle_time",
    "n_material_cost",
    "n_target_margin",
    "n_annual_volume",
    "n_labor_rate",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_source_confidence_ratio",
  ],
  "true-employee-cost-statement": [
    "n_labor_rate",
    "n_overhead_rate",
    "n_source_confidence_ratio",
  ],
  "job-quote-builder-pro-pack": [
    "n_machine_rate",
    "n_cycle_time",
    "n_setup_time",
    "n_batch_quantity",
    "n_material_cost",
    "n_target_margin",
    "n_annual_volume",
    "n_labor_rate",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_source_confidence_ratio",
    "n_uncertainty_multiplier",
  ],
  "machine-investment-feasibility-buy-lease-keep": [
    "n_initial_investment",
    "n_annual_net_cash_flow",
    "n_discount_rate",
    "n_analysis_years",
    "n_residual_value",
    "n_stress_downside_factor",
    "n_annual_volume",
    "n_labor_rate",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_source_confidence_ratio",
    "n_uncertainty_multiplier",
  ],
  "capital-equipment-investment-appraisal-npv-irr": [
    "n_initial_investment",
    "n_annual_net_cash_flow",
    "n_discount_rate",
    "n_analysis_years",
    "n_residual_value",
    "n_stress_downside_factor",
    "n_annual_volume",
    "n_labor_rate",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_source_confidence_ratio",
    "n_uncertainty_multiplier",
  ],
  "customer-sku-profitability-forensics": [
    "n_unit_price",
    "n_unit_variable_cost",
    "n_annual_volume",
    "n_logistics_cost_pct",
    "n_service_cost_pct",
    "n_return_rate_pct",
    "n_target_margin",
    "n_source_confidence_ratio",
  ],
  "downtime-scrap-loss-statement": [
    "n_productive_hours",
    "n_actual_hours",
    "n_hourly_rate",
    "n_scrap_quantity",
    "n_unit_cost",
    "n_rework_hours",
    "n_rework_rate",
    "n_material_cost",
    "n_defect_rate_pct",
    "n_source_confidence_ratio",
  ],
  "oee-loss-monetization-improvement-business-case": [
    "n_planned_production_time",
    "n_operating_time",
    "n_net_operating_time",
    "n_valuable_operating_time",
    "n_ideal_cycle_time",
    "n_total_parts",
    "n_good_parts",
    "n_hourly_contribution",
    "n_improvement_cost",
    "n_source_confidence_ratio",
  ],
  "scrap-rework-cost-tracker": [
    "n_total_produced",
    "n_scrap_quantity",
    "n_rework_quantity",
    "n_unit_material_cost",
    "n_unit_labor_cost",
    "n_rework_labor_rate",
    "n_rework_time_per_unit",
    "n_defect_rate_target_pct",
    "n_monthly_volume",
    "n_source_confidence_ratio",
  ],
  "outsource-vs-in-house-analyzer": [
    "n_in_house_material_cost",
    "n_in_house_labor_cost",
    "n_in_house_overhead",
    "n_in_house_setup_cost",
    "n_outsource_unit_price",
    "n_outsource_logistics_cost",
    "n_annual_volume",
    "n_quality_risk_premium_pct",
    "n_capacity_utilization_pct",
    "n_source_confidence_ratio",
  ],
  "plant-wide-shop-rate-cost-structure-audit": [
    "n_total_annual_cost",
    "n_total_productive_hours",
    "n_machine_group_cost",
    "n_machine_group_hours",
    "n_overhead_pool",
    "n_overhead_allocation_base",
    "n_current_shop_rate",
    "n_target_margin_pct",
    "n_utilization_pct",
    "n_source_confidence_ratio",
  ],
  "fx-commodity-pass-through-pricer": [
    "n_base_price",
    "n_fx_rate_spot",
    "n_fx_rate_budget",
    "n_commodity_index_current",
    "n_commodity_index_budget",
    "n_material_cost_pct",
    "n_fx_hedge_pct",
    "n_commodity_hedge_pct",
    "n_annual_volume",
    "n_source_confidence_ratio",
  ],
  "energy-efficiency-grant-incentive-feasibility-pack": [
    "n_current_kwh_per_year",
    "n_target_kwh_per_year",
    "n_avg_kwh_rate",
    "n_implementation_cost",
    "n_grant_coverage_pct",
    "n_maintenance_cost_saving",
    "n_emission_factor_kgco2_per_kwh",
    "n_equipment_life_years",
    "n_discount_rate",
    "n_source_confidence_ratio",
  ],
  "motor-compressor-replacement-roi": [
    "n_motor_power_kw",
    "n_annual_operating_hours",
    "n_current_efficiency_pct",
    "n_new_efficiency_pct",
    "n_avg_kwh_rate",
    "n_replacement_cost",
    "n_installation_cost",
    "n_maintenance_saving_per_year",
    "n_equipment_life_years",
    "n_discount_rate",
    "n_source_confidence_ratio",
  ],
  "weld-procedure-cost-consumable-estimation-suite": [
    "n_weld_length_m",
    "n_weld_throat_mm",
    "n_weld_density_g_per_cm3",
    "n_wire_cost_per_kg",
    "n_gas_cost_per_min",
    "n_arc_time_min",
    "n_weld_time_min",
    "n_labor_rate",
    "n_overhead_rate",
    "n_deposition_efficiency_pct",
    "n_source_confidence_ratio",
  ],
};

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

interface UnitOverride {
  quantityKind: string;
  baseUnit: string;
  displayUnit: string;
  name?: string;
  helpText?: string;
  hardMin?: number | null;
  hardMax?: number | null;
  engineeringMin?: number | null;
  engineeringMax?: number | null;
}

function withUnit(input: SuperV4Input, args: UnitOverride): SuperV4Input {
  return {
    ...input,
    name: args.name ?? input.name,
    quantity_kind: args.quantityKind,
    base_unit: args.baseUnit,
    allowed_display_units: [args.displayUnit],
    unit_selectable: false,
    user_help_text: args.helpText ?? input.user_help_text,
    ui_binding: input.ui_binding
      ? { ...input.ui_binding, unit_dropdown_required: false }
      : input.ui_binding,
    physical_hard_bounds: input.physical_hard_bounds
      ? {
          ...input.physical_hard_bounds,
          min: args.hardMin ?? input.physical_hard_bounds.min,
          max: args.hardMax ?? input.physical_hard_bounds.max,
          unit: args.displayUnit,
        }
      : input.physical_hard_bounds,
    engineering_range: input.engineering_range
      ? {
          ...input.engineering_range,
          min: args.engineeringMin ?? input.engineering_range.min,
          max: args.engineeringMax ?? input.engineering_range.max,
          unit: args.displayUnit,
        }
      : input.engineering_range,
    engineering_reference_range: input.engineering_reference_range
      ? {
          ...input.engineering_reference_range,
          min: args.engineeringMin ?? input.engineering_reference_range.min,
          max: args.engineeringMax ?? input.engineering_reference_range.max,
          unit: args.displayUnit,
        }
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
        hardMin: 0,
        hardMax: 1e12,
      });
    }
    if (input.id === "labor_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Labor Cost per Unit",
        hardMin: 0,
        hardMax: 1e12,
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Overhead Cost per Unit",
        hardMin: 0,
        hardMax: 1e12,
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
        hardMin: 0,
        hardMax: 1e15,
      });
    }
    if (input.id === "cycle_time") {
      return withUnit(input, {
        quantityKind: "time",
        baseUnit: "day",
        displayUnit: "day",
        name: "Payment Term (days)",
        hardMin: 0,
        hardMax: 3650,
      });
    }
    if (input.id === "batch_quantity") {
      return withUnit(input, {
        quantityKind: "dimensionless",
        baseUnit: "count",
        displayUnit: "count",
        name: "Annual Invoice Count",
        hardMin: 1,
        hardMax: 1e9,
      });
    }
    if (input.id === "material_cost") {
      return withUnit(input, {
        quantityKind: "dimensionless",
        baseUnit: "percent",
        displayUnit: "percent",
        name: "Annual Financing Rate (%)",
        hardMin: 0,
        hardMax: 100,
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Administration Cost per Invoice",
        hardMin: 0,
        hardMax: 1e12,
      });
    }
    if (input.id === "defect_or_loss_cost") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Expected Credit Loss per Invoice",
        hardMin: 0,
        hardMax: 1e15,
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
        hardMin: 0,
        hardMax: 1e9,
      });
    }
    if (input.id === "setup_time") {
      return withUnit(input, {
        quantityKind: "time",
        baseUnit: "s",
        displayUnit: "s",
        name: "Current Setup Time",
        hardMin: 0,
        hardMax: 31536000,
      });
    }
    if (input.id === "batch_quantity") {
      return withUnit(input, {
        quantityKind: "time",
        baseUnit: "s",
        displayUnit: "s",
        name: "Target Setup Time",
        hardMin: 0,
        hardMax: 31536000,
      });
    }
    if (input.id === "annual_volume") {
      return withUnit(input, {
        quantityKind: "rate",
        baseUnit: "changeover_per_year",
        displayUnit: "changeover_per_year",
        name: "Annual Changeovers",
        hardMin: 1,
        hardMax: 1e9,
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "SMED Implementation Cost",
        hardMin: 0,
        hardMax: 1e15,
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
        hardMin: 0,
        hardMax: 1e12,
      });
    }
    if (input.id === "overhead_rate") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Annual Overhead Pool",
        hardMin: 0,
        hardMax: 1e18,
      });
    }
    if (input.id === "defect_or_loss_cost") {
      return withUnit(input, {
        quantityKind: "currency",
        baseUnit: "currency_unit",
        displayUnit: "currency_unit",
        name: "Annual Quality and Loss Cost",
        hardMin: 0,
        hardMax: 1e18,
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
      hardMin: 0,
      hardMax: 1e12,
    });
  }

  if (ANNUAL_VOLUME_IDS.has(input.id)) {
    return withUnit(input, {
      quantityKind: "rate",
      baseUnit: "unit_per_year",
      displayUnit: "unit_per_year",
      hardMin: 0,
      hardMax: 1e12,
    });
  }

  if (MONTHLY_VOLUME_IDS.has(input.id)) {
    return withUnit(input, {
      quantityKind: "rate",
      baseUnit: "unit_per_month",
      displayUnit: "unit_per_month",
      hardMin: 0,
      hardMax: 1e12,
    });
  }

  if (input.id.endsWith("_pct")) {
    return withUnit(input, {
      quantityKind: "dimensionless",
      baseUnit: "percent",
      displayUnit: "percent",
      hardMin: 0,
      hardMax: 100,
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
      hardMin: -100,
      hardMax: 99.999999,
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
      helpText:
        "Enter weld metal density in g/cm³; the server converts it to kg/m³ before calculation.",
      hardMin: 0.5,
      hardMax: 25,
      engineeringMin: 2,
      engineeringMax: 20,
    });
  }

  return input;
}

function filterUiContract(
  uiContract: UiContract,
  retainedInputIds: ReadonlySet<string>,
): UiContract {
  return {
    ...uiContract,
    input_groups: uiContract.input_groups.map((group) => ({
      ...group,
      fields: group.fields.filter((field) => retainedInputIds.has(field)),
    })),
  };
}

function cleanInputBindings(
  input: SuperV4Input,
  retainedFormulaIds: ReadonlySet<string>,
  retainedOutputIds: ReadonlySet<string>,
): SuperV4Input {
  return {
    ...input,
    formula_bindings: input.formula_bindings.filter(
      (binding) =>
        binding.startsWith("server_formula.") || retainedFormulaIds.has(binding),
    ),
    output_bindings: input.output_bindings.filter((binding) =>
      retainedOutputIds.has(binding),
    ),
  };
}

function cleanFormulas(
  formulas: FormulaSpecPublic[],
  retainedNormalizedIds: ReadonlySet<string>,
  retainedOutputIds: ReadonlySet<string>,
): FormulaSpecPublic[] {
  return formulas
    .filter((formula) => retainedOutputIds.has(formula.output))
    .map((formula) => ({
      ...formula,
      uses: formula.uses.filter(
        (id) => retainedNormalizedIds.has(id) || retainedOutputIds.has(id),
      ),
      input_bindings: formula.input_bindings?.filter((id) =>
        retainedNormalizedIds.has(id),
      ),
      normalized_input_bindings: formula.normalized_input_bindings?.filter((id) =>
        retainedNormalizedIds.has(id),
      ),
      output_bindings: formula.output_bindings?.filter((id) =>
        retainedOutputIds.has(id),
      ),
    }));
}

/**
 * Versioned correction layer for generated V5.3.1 schemas whose unit metadata
 * or generic input superset conflicts with the deterministic formula module.
 */
export function applySchemaCalculationContractOverrides(
  schema: SuperV4Schema,
): SuperV4Schema {
  const requiredNormalizedIds = LIVE_PRO_NORMALIZED_INPUT_CONTRACTS[schema.tool_key];
  if (!requiredNormalizedIds) return schema;

  const retainedNormalizedIds = new Set(requiredNormalizedIds);
  const inputs = schema.inputs
    .filter(
      (input) =>
        input.normalized_id !== null && retainedNormalizedIds.has(input.normalized_id),
    )
    .map((input) => correctInputContract(schema.tool_key, input));
  const retainedInputIds = new Set(inputs.map((input) => input.id));
  const inputById = new Map(inputs.map((input) => [input.id, input]));
  const normalizedInputs = schema.normalized_inputs
    .filter(
      (input) =>
        retainedNormalizedIds.has(input.id) && retainedInputIds.has(input.from_input),
    )
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

  const retainedOutputIds = new Set(schema.outputs.map((output) => output.id));
  const formulas = cleanFormulas(
    schema.formulas,
    retainedNormalizedIds,
    retainedOutputIds,
  );
  const retainedFormulaIds = new Set(formulas.map((formula) => formula.id));
  const cleanedInputs = inputs.map((input) =>
    cleanInputBindings(input, retainedFormulaIds, retainedOutputIds),
  );

  const densityEntry = schema.unit_conversion_contract.conversion_registry.density;
  const densityUnits = densityEntry?.units ?? [];
  const hasGCm3 = densityUnits.some((unit) => unit.unit === "g_per_cm3");

  return {
    ...schema,
    engine_rules: {
      ...(schema.engine_rules ?? {}),
      strict_formula_schema_contract: true,
      calculation_contract_override_version: "2026-07-15.2",
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
                : [
                    ...densityUnits,
                    { unit: "g_per_cm3", factor: 1000, label: "g/cm³" },
                  ],
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
    inputs: cleanedInputs,
    normalized_inputs: normalizedInputs,
    formulas,
    ui_contract: filterUiContract(schema.ui_contract, retainedInputIds),
  };
}
