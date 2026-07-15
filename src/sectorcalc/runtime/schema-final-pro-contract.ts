import type {
  ConversionEntry,
  ConversionRegistry,
  SuperV4Input,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";

const CAPITAL_REMOVED_NORMALIZED_IDS = new Set([
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
]);

type SemanticUiBinding = NonNullable<SuperV4Input["ui_binding"]> & {
  semantic_tag?: string;
};

interface InputSemanticOverride {
  name: string;
  quantityKind: string;
  baseUnit: string;
  helpText: string;
}

const CURRENCY_DISPLAY_ALIASES: Readonly<Record<string, string>> = {
  currency_unit: "Currency",
  currency_unit_per_h: "Currency/h",
  currency_unit_per_unit: "Currency/unit",
  currency_unit_per_batch: "Currency/batch",
  currency_unit_per_invoice: "Currency/invoice",
  currency_unit_per_month: "Currency/month",
  currency_unit_per_year: "Currency/year",
  currency_unit_per_kWh: "Currency/kWh",
  currency_unit_per_kg: "Currency/kg",
  currency_unit_per_min: "Currency/min",
};

const PRO_ECONOMIC_BASES: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  "break-even-survival-cash-calculator": {
    monthly_fixed_cash_cost: "currency_unit_per_month",
    monthly_debt_service: "currency_unit_per_month",
    current_monthly_revenue: "currency_unit_per_month",
    unrestricted_cash_balance: "currency_unit",
    minimum_cash_buffer: "currency_unit",
  },
  "machine-hourly-rate-proof-report": {
    machine_rate: "currency_unit_per_h",
    material_cost: "currency_unit_per_unit",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_h",
    defect_or_loss_cost: "currency_unit_per_unit",
  },
  "loss-making-job-detector": {
    machine_rate: "currency_unit_per_unit",
    material_cost: "currency_unit_per_batch",
    labor_rate: "currency_unit_per_unit",
    overhead_rate: "currency_unit_per_unit",
    defect_or_loss_cost: "currency_unit_per_unit",
  },
  "receivables-cost-payment-term-addendum": {
    machine_rate: "currency_unit_per_invoice",
    overhead_rate: "currency_unit_per_invoice",
    defect_or_loss_cost: "currency_unit_per_invoice",
  },
  "setup-time-reduction-roi-smed": {
    machine_rate: "currency_unit_per_h",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit",
  },
  "product-sku-margin-ranker": {
    machine_rate: "currency_unit_per_unit",
    material_cost: "currency_unit_per_unit",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_year",
    defect_or_loss_cost: "currency_unit_per_year",
  },
  "true-employee-cost-statement": {
    labor_rate: "currency_unit_per_year",
    overhead_rate: "currency_unit_per_year",
  },
  "job-quote-builder-pro-pack": {
    machine_rate: "currency_unit_per_h",
    material_cost: "currency_unit_per_unit",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_h",
    defect_or_loss_cost: "currency_unit_per_unit",
  },
  "machine-investment-feasibility-buy-lease-keep": {
    initial_investment: "currency_unit",
    annual_net_cash_flow: "currency_unit_per_year",
    residual_value: "currency_unit",
    annual_volume: "currency_unit",
    labor_rate: "currency_unit_per_year",
    overhead_rate: "currency_unit",
    defect_or_loss_cost: "currency_unit_per_year",
  },
  "capital-equipment-investment-appraisal-npv-irr": {
    initial_investment: "currency_unit",
    annual_net_cash_flow: "currency_unit_per_year",
    residual_value: "currency_unit",
    defect_or_loss_cost: "currency_unit",
  },
  "customer-sku-profitability-forensics": {
    unit_price: "currency_unit_per_unit",
    unit_variable_cost: "currency_unit_per_unit",
  },
  "downtime-scrap-loss-statement": {
    hourly_rate: "currency_unit_per_h",
    unit_cost: "currency_unit_per_unit",
    rework_rate: "currency_unit_per_h",
    material_cost: "currency_unit",
  },
  "oee-loss-monetization-improvement-business-case": {
    hourly_contribution: "currency_unit_per_h",
    improvement_cost: "currency_unit",
  },
  "scrap-rework-cost-tracker": {
    unit_material_cost: "currency_unit_per_unit",
    unit_labor_cost: "currency_unit_per_unit",
    rework_labor_rate: "currency_unit_per_h",
  },
  "outsource-vs-in-house-analyzer": {
    in_house_material_cost: "currency_unit_per_unit",
    in_house_labor_cost: "currency_unit_per_unit",
    in_house_overhead: "currency_unit_per_unit",
    in_house_setup_cost: "currency_unit",
    outsource_unit_price: "currency_unit_per_unit",
    outsource_logistics_cost: "currency_unit_per_unit",
  },
  "plant-wide-shop-rate-cost-structure-audit": {
    total_annual_cost: "currency_unit_per_year",
    machine_group_cost: "currency_unit_per_year",
    overhead_pool: "currency_unit_per_year",
    current_shop_rate: "currency_unit_per_h",
  },
  "fx-commodity-pass-through-pricer": {
    base_price: "currency_unit_per_unit",
  },
  "energy-efficiency-grant-incentive-feasibility-pack": {
    avg_kwh_rate: "currency_unit_per_kWh",
    implementation_cost: "currency_unit",
    maintenance_cost_saving: "currency_unit_per_year",
  },
  "motor-compressor-replacement-roi": {
    avg_kwh_rate: "currency_unit_per_kWh",
    replacement_cost: "currency_unit",
    installation_cost: "currency_unit",
    maintenance_saving_per_year: "currency_unit_per_year",
  },
  "weld-procedure-cost-consumable-estimation-suite": {
    wire_cost_per_kg: "currency_unit_per_kg",
    gas_cost_per_min: "currency_unit_per_min",
    labor_rate: "currency_unit_per_h",
    overhead_rate: "currency_unit_per_h",
  },
};

function currencyDisplayAlias(baseUnit: string): string {
  return CURRENCY_DISPLAY_ALIASES[baseUnit] ?? baseUnit;
}

function applyInputSemantic(
  input: SuperV4Input,
  override: InputSemanticOverride,
): SuperV4Input {
  return applyEconomicBasis(
    {
      ...input,
      name: override.name,
      user_help_text: override.helpText,
    },
    override.baseUnit,
    override.quantityKind,
  );
}

function applyEconomicBasis(
  input: SuperV4Input,
  baseUnit: string,
  quantityKind = baseUnit === "currency_unit" ? "currency" : "currency_rate",
): SuperV4Input {
  const displayAlias = currencyDisplayAlias(baseUnit);
  return {
    ...input,
    quantity_kind: quantityKind,
    base_unit: baseUnit,
    // Internal base-unit identifiers never leak into the UI. The display alias
    // is converted to the selected ISO code by replaceCurrencyLabel; no FX
    // conversion is implied or performed.
    allowed_display_units: [displayAlias],
    unit_selectable: false,
    physical_hard_bounds: input.physical_hard_bounds
      ? { ...input.physical_hard_bounds, unit: baseUnit }
      : input.physical_hard_bounds,
    engineering_range: input.engineering_range
      ? { ...input.engineering_range, unit: baseUnit }
      : input.engineering_range,
    engineering_reference_range: input.engineering_reference_range
      ? { ...input.engineering_reference_range, unit: baseUnit }
      : input.engineering_reference_range,
    ui_binding: input.ui_binding
      ? ({
          ...input.ui_binding,
          unit_dropdown_required: false,
          semantic_tag: "monetary",
        } as SemanticUiBinding)
      : input.ui_binding,
  };
}

function addIdentityUnit(
  units: ConversionEntry[],
  unit: string,
): ConversionEntry[] {
  if (units.some((entry) => entry.unit === unit)) return units;
  return [...units, { unit, factor: 1, label: unit }];
}

function addCurrencyDisplayAliases(
  registry: ConversionRegistry,
  inputs: SuperV4Input[],
): ConversionRegistry {
  const next: ConversionRegistry = { ...registry };
  for (const input of inputs) {
    if (!input.base_unit || !CURRENCY_DISPLAY_ALIASES[input.base_unit]) continue;
    const quantityKind = input.quantity_kind;
    const baseUnit = input.base_unit;
    const alias = currencyDisplayAlias(baseUnit);
    const current = next[quantityKind];
    const units = addIdentityUnit(
      addIdentityUnit(current?.units ? [...current.units] : [], baseUnit),
      alias,
    );
    next[quantityKind] = {
      base_unit: current?.base_unit ?? baseUnit,
      unit_family: current?.unit_family ?? "CURRENCY",
      units,
    };
  }
  return next;
}

function markMonetaryOutputs(schema: SuperV4Schema): SuperV4Schema["outputs"] {
  const explicitUnits: Readonly<Record<string, string>> = {
    out_money_at_risk: "currency",
    out_break_even_monthly_revenue: "currency/month",
    out_current_revenue_gap: "currency/month",
    out_stressed_monthly_revenue: "currency/month",
    out_monthly_cash_burn: "currency/month",
    out_survival_cash_target: "currency",
    out_funding_gap: "currency",
    out_uncertainty_cash_buffer: "currency",
    out_base_annual_compensation: "currency/year",
    out_workspace_facility_cost: "currency/year",
    out_fully_loaded_annual_cost: "currency/year",
    out_monthly_employer_cost: "currency/month",
    out_total_cost_floor: "currency",
    out_cost_per_meter: "currency/m",
  };
  return schema.outputs.map((output) => {
    const unit = explicitUnits[output.id];
    return unit ? { ...output, unit } : output;
  });
}

function applyDeclaredEconomicBases(schema: SuperV4Schema): SuperV4Schema {
  const bases = PRO_ECONOMIC_BASES[schema.tool_key];
  if (!bases) return schema;
  const inputs = schema.inputs.map((input) => {
    const baseUnit = bases[input.id];
    return baseUnit ? applyEconomicBasis(input, baseUnit) : input;
  });
  return {
    ...schema,
    inputs,
    outputs: markMonetaryOutputs(schema),
    normalized_inputs: syncNormalizedInputs(schema, inputs),
    unit_conversion_contract: {
      ...schema.unit_conversion_contract,
      conversion_registry: addCurrencyDisplayAliases(
        schema.unit_conversion_contract.conversion_registry,
        inputs,
      ),
    },
  };
}

function syncNormalizedInputs(
  schema: SuperV4Schema,
  inputs: SuperV4Input[],
): SuperV4Schema["normalized_inputs"] {
  const byId = new Map(inputs.map((input) => [input.id, input]));
  return schema.normalized_inputs
    .filter((normalized) => byId.has(normalized.from_input))
    .map((normalized) => {
      const source = byId.get(normalized.from_input);
      return source
        ? {
            ...normalized,
            quantity_kind: source.quantity_kind,
            base_unit: source.base_unit ?? normalized.base_unit,
          }
        : normalized;
    });
}

function closeSchemaToInputs(
  schema: SuperV4Schema,
  inputs: SuperV4Input[],
): SuperV4Schema {
  const inputIds = new Set(inputs.map((input) => input.id));
  const normalizedIds = new Set(
    inputs
      .map((input) => input.normalized_id)
      .filter((id): id is string => typeof id === "string" && id.length > 0),
  );

  const formulas = schema.formulas.map((formula) => ({
    ...formula,
    uses: formula.uses.filter(
      (id) => !id.startsWith("n_") || normalizedIds.has(id),
    ),
    input_bindings: formula.input_bindings?.filter((id) => normalizedIds.has(id)),
    normalized_input_bindings: formula.normalized_input_bindings?.filter((id) =>
      normalizedIds.has(id),
    ),
  }));
  const formulaIds = new Set(formulas.map((formula) => formula.id));

  const closedInputs = inputs.map((input) => ({
    ...input,
    formula_bindings: input.formula_bindings.filter(
      (binding) =>
        binding.startsWith("server_formula.") || formulaIds.has(binding),
    ),
  }));

  return {
    ...schema,
    inputs: closedInputs,
    normalized_inputs: syncNormalizedInputs(schema, closedInputs),
    formulas,
    ui_contract: {
      ...schema.ui_contract,
      input_groups: schema.ui_contract.input_groups
        .map((group) => ({
          ...group,
          fields: group.fields.filter((field) => inputIds.has(field)),
        }))
        .filter((group) => group.fields.length > 0),
    },
  };
}

function applyLossDetectorClosure(schema: SuperV4Schema): SuperV4Schema {
  const overrides: Partial<Record<string, InputSemanticOverride>> = {
    machine_rate: {
      name: "Quoted Selling Price per Unit",
      quantityKind: "currency_rate",
      baseUnit: "currency_unit_per_unit",
      helpText:
        "Enter the customer quote or contract selling price for one finished unit. This is revenue, not a machine cost rate.",
    },
    material_cost: {
      name: "Material Cost per Batch",
      quantityKind: "currency_rate",
      baseUnit: "currency_unit_per_batch",
      helpText:
        "Enter the total material cost for the complete batch. The server divides this amount by batch quantity before combining it with per-unit costs.",
    },
    labor_rate: {
      name: "Labor Cost per Unit",
      quantityKind: "currency_rate",
      baseUnit: "currency_unit_per_unit",
      helpText: "Enter direct labor cost allocated to one finished unit.",
    },
    overhead_rate: {
      name: "Overhead Cost per Unit",
      quantityKind: "currency_rate",
      baseUnit: "currency_unit_per_unit",
      helpText: "Enter allocated overhead cost for one finished unit.",
    },
    defect_or_loss_cost: {
      name: "Defect / Loss Cost per Unit",
      quantityKind: "currency_rate",
      baseUnit: "currency_unit_per_unit",
      helpText: "Enter expected scrap, rework, warranty or loss cost for one unit.",
    },
    target_margin: {
      name: "Target Gross Margin Ratio",
      quantityKind: "dimensionless",
      baseUnit: "ratio",
      helpText: "Enter gross margin as a ratio; 0.25 means 25% of selling price.",
    },
  };

  const inputs = schema.inputs.map((input) => {
    const override = overrides[input.id];
    return override ? applyInputSemantic(input, override) : input;
  });

  return closeSchemaToInputs(schema, inputs);
}

function applyCapitalAppraisalClosure(schema: SuperV4Schema): SuperV4Schema {
  const retained = schema.inputs.filter(
    (input) =>
      !input.normalized_id ||
      !CAPITAL_REMOVED_NORMALIZED_IDS.has(input.normalized_id),
  );

  const inputs = retained.map((input) => {
    if (input.id === "annual_net_cash_flow") {
      return applyInputSemantic(input, {
        name: "Annual Net Cash Flow",
        quantityKind: "currency_rate",
        baseUnit: "currency_unit_per_year",
        helpText:
          "Enter annual incremental net cash flow after operating costs and taxes included in the appraisal model.",
      });
    }
    if (input.id === "defect_or_loss_cost") {
      return applyInputSemantic(input, {
        name: "Additional Downside Loss Exposure",
        quantityKind: "currency",
        baseUnit: "currency_unit",
        helpText:
          "Enter any additional downside loss exposure not already included in the stressed annual cash flow. Do not duplicate costs already embedded in net cash flow.",
      });
    }
    return input;
  });

  return closeSchemaToInputs(schema, inputs);
}

function applyCustomerSkuClosure(schema: SuperV4Schema): SuperV4Schema {
  const inputs = schema.inputs.map((input) => {
    if (input.id !== "target_margin") return input;
    return {
      ...input,
      name: "Target Net Margin (%)",
      physical_hard_bounds: input.physical_hard_bounds
        ? { ...input.physical_hard_bounds, min: 0, max: 99.999999, unit: "percent" }
        : input.physical_hard_bounds,
      engineering_range: input.engineering_range
        ? { ...input.engineering_range, min: 0, max: 99.999999, unit: "percent" }
        : input.engineering_range,
      engineering_reference_range: input.engineering_reference_range
        ? {
            ...input.engineering_reference_range,
            min: 0,
            max: 99.999999,
            unit: "percent",
          }
        : input.engineering_reference_range,
    };
  });
  return closeSchemaToInputs(schema, inputs);
}

/**
 * Final semantic closure runs after generated-schema corrections and before
 * presentation enrichment. It removes fields that do not participate in the
 * approved server formula and fixes economic bases that cannot be inferred from
 * legacy normalized identifiers.
 */
export function applyFinalProSchemaContract(
  schema: SuperV4Schema,
): SuperV4Schema {
  let closed = schema;
  if (schema.tool_key === "loss-making-job-detector") {
    closed = applyLossDetectorClosure(schema);
  } else if (
    schema.tool_key === "capital-equipment-investment-appraisal-npv-irr"
  ) {
    closed = applyCapitalAppraisalClosure(schema);
  } else if (schema.tool_key === "customer-sku-profitability-forensics") {
    closed = applyCustomerSkuClosure(schema);
  }
  return applyDeclaredEconomicBases(closed);
}
