import type {
  SuperV4Input,
  SuperV4Schema,
} from "@/sectorcalc/pro-form/contract-types";

interface FixedUnitOptions {
  hardMin?: number | null;
  hardMax?: number | null;
  engineeringMin?: number | null;
  engineeringMax?: number | null;
  helpText?: string;
}

type UiBindingWithSemanticTag = NonNullable<SuperV4Input["ui_binding"]> & {
  semantic_tag?: string;
};

function fixedUnit(
  input: SuperV4Input,
  name: string,
  quantityKind: string,
  unit: string,
  options: FixedUnitOptions = {},
): SuperV4Input {
  const monetary = quantityKind.toLowerCase().includes("currency");
  return {
    ...input,
    name,
    quantity_kind: quantityKind,
    base_unit: unit,
    allowed_display_units: [unit],
    unit_selectable: false,
    user_help_text: options.helpText ?? input.user_help_text,
    ui_binding: input.ui_binding
      ? ({
          ...input.ui_binding,
          unit_dropdown_required: false,
          ...(monetary ? { semantic_tag: "monetary" } : {}),
        } as UiBindingWithSemanticTag)
      : input.ui_binding,
    physical_hard_bounds: input.physical_hard_bounds
      ? {
          ...input.physical_hard_bounds,
          min: options.hardMin ?? input.physical_hard_bounds.min,
          max: options.hardMax ?? input.physical_hard_bounds.max,
          unit,
        }
      : input.physical_hard_bounds,
    engineering_range: input.engineering_range
      ? {
          ...input.engineering_range,
          min: options.engineeringMin ?? input.engineering_range.min,
          max: options.engineeringMax ?? input.engineering_range.max,
          unit,
        }
      : input.engineering_range,
    engineering_reference_range: input.engineering_reference_range
      ? {
          ...input.engineering_reference_range,
          min:
            options.engineeringMin ?? input.engineering_reference_range.min,
          max:
            options.engineeringMax ?? input.engineering_reference_range.max,
          unit,
        }
      : input.engineering_reference_range,
  };
}

function syncNormalizedInputs(schema: SuperV4Schema, inputs: SuperV4Input[]) {
  const byId = new Map(inputs.map((input) => [input.id, input]));
  return schema.normalized_inputs.map((normalized) => {
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

function retainOutputContract(
  schema: SuperV4Schema,
  outputIds: ReadonlySet<string>,
): Pick<SuperV4Schema, "inputs" | "outputs" | "formulas"> {
  const outputs = schema.outputs.filter((output) => outputIds.has(output.id));
  const formulas = schema.formulas.filter((formula) =>
    outputIds.has(formula.output),
  );
  const formulaIds = new Set(formulas.map((formula) => formula.id));
  const inputs = schema.inputs.map((input) => ({
    ...input,
    formula_bindings: input.formula_bindings.filter(
      (binding) =>
        binding.startsWith("server_formula.") || formulaIds.has(binding),
    ),
    output_bindings: input.output_bindings.filter((binding) =>
      outputIds.has(binding),
    ),
  }));

  return { inputs, outputs, formulas };
}

function finalizeDomainContract(schema: SuperV4Schema): SuperV4Schema {
  const inputs = schema.inputs.map((input) => {
    const isMonetary = input.quantity_kind.toLowerCase().includes("currency");
    if (!isMonetary || !input.ui_binding) return input;
    return {
      ...input,
      ui_binding: {
        ...input.ui_binding,
        semantic_tag: "monetary",
      } as UiBindingWithSemanticTag,
    };
  });
  const inputIds = new Set(inputs.map((input) => input.id));
  const inputGroups = schema.ui_contract.input_groups
    .map((group) => ({
      ...group,
      fields: group.fields.filter((field) => inputIds.has(field)),
    }))
    .filter((group) => group.fields.length > 0);

  return {
    ...schema,
    inputs,
    normalized_inputs: syncNormalizedInputs(schema, inputs),
    ui_contract: {
      ...schema.ui_contract,
      input_groups: inputGroups,
    },
  };
}

const TRUE_EMPLOYEE_OUTPUT_IDS = new Set([
  "out_base_annual_compensation",
  "out_workspace_facility_cost",
  "out_fully_loaded_annual_cost",
  "out_monthly_employer_cost",
  "out_base_to_loaded_multiplier",
  "out_evidence_completeness",
  "out_expanded_uncertainty",
  "out_decision_state",
]);

function applyTrueEmployeeContract(schema: SuperV4Schema): SuperV4Schema {
  const remappedInputs = schema.inputs.map((input) => {
    if (input.id === "labor_rate") {
      return fixedUnit(
        input,
        "Annual Base Compensation",
        "currency",
        "currency",
        {
          hardMin: 0,
          hardMax: 1e12,
          engineeringMin: 0,
          engineeringMax: 1e9,
          helpText:
            "Enter annual gross base compensation from payroll records in the selected currency.",
        },
      );
    }
    if (input.id === "overhead_rate") {
      return fixedUnit(
        input,
        "Other Annual Employer Costs",
        "currency",
        "currency",
        {
          hardMin: 0,
          hardMax: 1e12,
          engineeringMin: 0,
          engineeringMax: 1e9,
          helpText:
            "Enter the annual aggregate of employer taxes, benefits, insurance, leave, equipment, workspace and other verified employer costs.",
        },
      );
    }
    return input;
  });

  const remappedSchema: SuperV4Schema = {
    ...schema,
    inputs: remappedInputs,
    normalized_inputs: syncNormalizedInputs(schema, remappedInputs),
  };
  const retained = retainOutputContract(
    remappedSchema,
    TRUE_EMPLOYEE_OUTPUT_IDS,
  );

  return {
    ...remappedSchema,
    ...retained,
    outputs: retained.outputs.map((output) =>
      output.id === "out_workspace_facility_cost"
        ? {
            ...output,
            name: "Other Annual Employer Costs",
            public_explanation:
              "User-entered aggregate employer costs outside base compensation; no fabricated statutory or benefit split is applied.",
          }
        : output,
    ),
    scope:
      "Calculate fully loaded employer cost from annual base compensation and verified aggregate employer costs.",
    primary_operation: "verified_aggregate_employee_cost",
  };
}

function applyMachineInvestmentContract(schema: SuperV4Schema): SuperV4Schema {
  const inputs = schema.inputs.map((input) => {
    switch (input.id) {
      case "initial_investment":
        return fixedUnit(
          input,
          "Buy: Purchase and Installation Cost",
          "currency",
          "currency",
          { hardMin: 0, hardMax: 1e18 },
        );
      case "annual_net_cash_flow":
        return fixedUnit(
          input,
          "Annual Operating Benefit — Buy or Lease",
          "currency",
          "currency",
          { hardMin: 0, hardMax: 1e18 },
        );
      case "residual_value":
        return fixedUnit(
          input,
          "Buy: Residual Value",
          "currency",
          "currency",
          { hardMin: 0, hardMax: 1e18 },
        );
      case "labor_rate":
        return fixedUnit(
          input,
          "Lease: Annual Payment",
          "currency",
          "currency",
          { hardMin: 0, hardMax: 1e18 },
        );
      case "overhead_rate":
        return fixedUnit(
          input,
          "Lease: Initial Fees",
          "currency",
          "currency",
          { hardMin: 0, hardMax: 1e18 },
        );
      case "defect_or_loss_cost":
        return fixedUnit(
          input,
          "Keep: Annual Net Benefit",
          "currency",
          "currency",
          { hardMin: 0, hardMax: 1e18 },
        );
      case "annual_volume":
        return fixedUnit(
          input,
          "Keep: Refurbishment Cost",
          "currency",
          "currency",
          { hardMin: 0, hardMax: 1e18 },
        );
      default:
        return input;
    }
  });

  return {
    ...schema,
    inputs,
    normalized_inputs: syncNormalizedInputs(schema, inputs),
    scope:
      "Compare buy, lease and keep alternatives using explicit scenario cash flows and downside analysis.",
    primary_operation: "buy_lease_keep_discounted_cash_flow",
  };
}

function applyWeldContract(schema: SuperV4Schema): SuperV4Schema {
  const inputs = schema.inputs.map((input) => {
    if (input.id !== "weld_density") return input;
    return {
      ...input,
      physical_hard_bounds: input.physical_hard_bounds
        ? {
            ...input.physical_hard_bounds,
            min: 500,
            max: 25000,
            unit: "kg_per_m3",
          }
        : input.physical_hard_bounds,
      engineering_range: input.engineering_range
        ? {
            ...input.engineering_range,
            min: 2000,
            max: 20000,
            unit: "kg_per_m3",
          }
        : input.engineering_range,
      engineering_reference_range: input.engineering_reference_range
        ? {
            ...input.engineering_reference_range,
            min: 2000,
            max: 20000,
            unit: "kg_per_m3",
          }
        : input.engineering_reference_range,
    };
  });

  return {
    ...schema,
    inputs,
    normalized_inputs: syncNormalizedInputs(schema, inputs),
  };
}

/**
 * Corrects domain semantics that cannot be represented by the generated generic
 * rate/volume labels. This layer is resolved before form rendering and server
 * execution, preventing UI/formula semantic divergence.
 */
export function applySchemaDomainContractOverrides(
  schema: SuperV4Schema,
): SuperV4Schema {
  let domainSchema = schema;
  if (schema.tool_key === "true-employee-cost-statement") {
    domainSchema = applyTrueEmployeeContract(schema);
  } else if (
    schema.tool_key === "machine-investment-feasibility-buy-lease-keep"
  ) {
    domainSchema = applyMachineInvestmentContract(schema);
  } else if (
    schema.tool_key === "weld-procedure-cost-consumable-estimation-suite"
  ) {
    domainSchema = applyWeldContract(schema);
  }
  return finalizeDomainContract(domainSchema);
}
