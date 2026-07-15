import type { SuperV4Input, SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

function fixedUnit(
  input: SuperV4Input,
  name: string,
  quantityKind: string,
  unit: string,
): SuperV4Input {
  return {
    ...input,
    name,
    quantity_kind: quantityKind,
    base_unit: unit,
    allowed_display_units: [unit],
    unit_selectable: false,
    physical_hard_bounds: input.physical_hard_bounds
      ? { ...input.physical_hard_bounds, unit }
      : input.physical_hard_bounds,
    engineering_range: input.engineering_range
      ? { ...input.engineering_range, unit }
      : input.engineering_range,
    engineering_reference_range: input.engineering_reference_range
      ? { ...input.engineering_reference_range, unit }
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
  const inputs = schema.inputs.map((input) => {
    if (input.id === "labor_rate") {
      return fixedUnit(
        input,
        "Annual Base Compensation",
        "currency",
        "currency_unit",
      );
    }
    if (input.id === "overhead_rate") {
      return fixedUnit(
        input,
        "Other Annual Employer Costs",
        "currency",
        "currency_unit",
      );
    }
    return input;
  });

  const outputs = schema.outputs
    .filter((output) => TRUE_EMPLOYEE_OUTPUT_IDS.has(output.id))
    .map((output) =>
      output.id === "out_workspace_facility_cost"
        ? {
            ...output,
            name: "Other Annual Employer Costs",
            public_explanation:
              "User-entered aggregate employer costs outside base compensation; no fabricated tax or benefit split is applied.",
          }
        : output,
    );

  return {
    ...schema,
    inputs,
    normalized_inputs: syncNormalizedInputs(schema, inputs),
    outputs,
  };
}

function applyMachineInvestmentContract(schema: SuperV4Schema): SuperV4Schema {
  const inputs = schema.inputs.map((input) => {
    switch (input.id) {
      case "initial_investment":
        return fixedUnit(input, "Buy: Purchase and Installation Cost", "currency", "currency_unit");
      case "annual_net_cash_flow":
        return fixedUnit(input, "Annual Operating Benefit — Buy or Lease", "currency", "currency_unit");
      case "residual_value":
        return fixedUnit(input, "Buy: Residual Value", "currency", "currency_unit");
      case "labor_rate":
        return fixedUnit(input, "Lease: Annual Payment", "currency", "currency_unit");
      case "overhead_rate":
        return fixedUnit(input, "Lease: Initial Fees", "currency", "currency_unit");
      case "defect_or_loss_cost":
        return fixedUnit(input, "Keep: Annual Net Benefit", "currency", "currency_unit");
      case "annual_volume":
        return fixedUnit(input, "Keep: Refurbishment Cost", "currency", "currency_unit");
      default:
        return input;
    }
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
  if (schema.tool_key === "true-employee-cost-statement") {
    return applyTrueEmployeeContract(schema);
  }
  if (schema.tool_key === "machine-investment-feasibility-buy-lease-keep") {
    return applyMachineInvestmentContract(schema);
  }
  return schema;
}
