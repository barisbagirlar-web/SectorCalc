import type {
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

function applyInputSemantic(
  input: SuperV4Input,
  override: InputSemanticOverride,
): SuperV4Input {
  return {
    ...input,
    name: override.name,
    quantity_kind: override.quantityKind,
    base_unit: override.baseUnit,
    allowed_display_units: [override.baseUnit],
    unit_selectable: false,
    user_help_text: override.helpText,
    physical_hard_bounds: input.physical_hard_bounds
      ? { ...input.physical_hard_bounds, unit: override.baseUnit }
      : input.physical_hard_bounds,
    engineering_range: input.engineering_range
      ? { ...input.engineering_range, unit: override.baseUnit }
      : input.engineering_range,
    engineering_reference_range: input.engineering_reference_range
      ? { ...input.engineering_reference_range, unit: override.baseUnit }
      : input.engineering_reference_range,
    ui_binding: input.ui_binding
      ? ({
          ...input.ui_binding,
          unit_dropdown_required: false,
          semantic_tag: override.quantityKind.toLowerCase().includes("currency")
            ? "monetary"
            : (input.ui_binding as SemanticUiBinding).semantic_tag,
        } as SemanticUiBinding)
      : input.ui_binding,
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

/**
 * Final semantic closure runs after generated-schema corrections and before
 * presentation enrichment. It removes fields that do not participate in the
 * approved server formula and fixes economic bases that cannot be inferred from
 * legacy normalized identifiers.
 */
export function applyFinalProSchemaContract(
  schema: SuperV4Schema,
): SuperV4Schema {
  if (schema.tool_key === "loss-making-job-detector") {
    return applyLossDetectorClosure(schema);
  }
  if (schema.tool_key === "capital-equipment-investment-appraisal-npv-irr") {
    return applyCapitalAppraisalClosure(schema);
  }
  return schema;
}
