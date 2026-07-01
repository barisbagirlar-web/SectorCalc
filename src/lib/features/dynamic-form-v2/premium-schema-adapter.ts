/**
 * Adapter that converts PremiumCalculatorSchema into the ToolData format
 * expected by DynamicFormEngine, so premium tools render through the same
 * HMI form engine as free tools.
 *
 * Formulas are generated as simple pass-through expressions — the actual
 * premium calculation happens via runPremiumSchemaEngine in the parent
 * PremiumSchemaToolForm component.
 */

import type { ToolData, ToolInputField, ToolOutput, InputGroup, ValidationRule, SmartWarning } from "./types";
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const CONFIDENCE_BY_TYPE: Record<string, string> = {
  number: "HIGH",
  slider: "HIGH",
  select: "EXACT",
  boolean: "EXACT",
};

function normalizeConfidence(input: { type?: string; id: string }): string {
  return CONFIDENCE_BY_TYPE[input.type || "number"] || "HIGH";
}

function toTitleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/[_-]/g, " ");
}

export function adaptPremiumSchema(schema: PremiumCalculatorSchema, slug?: string): ToolData {
  const toolId = schema.id || slug || "PREMIUM_TOOL";
  const toolName = schema.name || toTitleCase(toolId);

  // ── Inputs ──
  const inputs: ToolInputField[] = schema.inputs.map((inp) => {
    const isEnum = inp.type === "select" || (inp.enumValues && inp.enumValues.length > 0);
    const isBool = inp.type === "boolean";

    return {
      id: inp.id,
      name: inp.label || inp.id,
      symbol: inp.id.slice(0, 2).toUpperCase(),
      unit: isBool ? "boolean" : isEnum ? "enum" : inp.unit || "unit",
      allowed_values: isEnum && inp.enumValues
        ? [...inp.enumValues]
        : isEnum && inp.options
        ? inp.options.map((o) => o.value)
        : undefined,
      default: inp.smartDefault != null
        ? inp.smartDefault
        : isEnum && inp.options?.[0]
        ? inp.options[0].value
        : undefined,
      absolute_min: inp.validation?.min,
      absolute_max: inp.validation?.max,
      resolution: inp.validation?.step,
      confidence_label: normalizeConfidence(inp),
      note: inp.helper || "",
      reference: inp.expertMeaning || undefined,
    };
  });

  // ── Outputs ──
  const outputs: ToolOutput[] = schema.outputs.map((out) => ({
    id: out.id,
    name: out.label || out.id,
    unit: out.unit || "unit",
    precision: out.format === "currency" ? 2 : out.format === "percentage" ? 1 : null,
    confidence_label: "HIGH",
  }));

  // Primary output
  const primaryOutputId = outputs.length > 0 ? outputs[0].id : "result";

  // ── Formulas (derive expression from formulaPipeline inputMap) ──
  // Each pipeline step maps schema inputs to formula params. We generate
  // a safeEval-compatible expression that references the first mapped input
  // as a stand-in value. Real calculation happens via runPremiumSchemaEngine
  // in PremiumSchemaToolForm.
  const pipeline = schema.formulaPipeline || [];
  const formulas = outputs.map((out) => {
    // Find pipeline step for this output
    const step = pipeline.find((s) => s.outputId === out.id);
    const mappedFields = step ? Object.values(step.inputMap) : [];
    const expr = mappedFields.length > 0
      ? mappedFields[0]  // reference first mapped input
      : "1";  // fallback
    return {
      id: out.id,
      output: out.id,
      expression: expr,
    };
  });

  // ── Input groups (auto-group by type) ──
  const inputGroups: InputGroup[] = [
    {
      id: "general",
      title: "Input Parameters",
      fields: inputs.map((i) => i.id),
    },
  ];

  // ── Validation rules ──
  const validationRules: ValidationRule[] = [];
  schema.inputs.forEach((inp, i) => {
    if (inp.validation?.min != null) {
      validationRules.push({
        id: `V_min_${inp.id}`,
        condition: `${inp.id} >= ${inp.validation.min}`,
        message: `${inp.label} must be ≥ ${inp.validation.min}.`,
      });
    }
    if (inp.validation?.max != null) {
      validationRules.push({
        id: `V_max_${inp.id}`,
        condition: `${inp.id} <= ${inp.validation.max}`,
        message: `${inp.label} must be ≤ ${inp.validation.max}.`,
      });
    }
  });

  // ── Smart warnings from thresholds ──
  const smartWarnings: SmartWarning[] = schema.thresholds.map((t, i) => ({
    id: `TW_${t.fieldId}`,
    trigger: t.direction === "higher_is_bad"
      ? `${t.fieldId} > ${t.warning}`
      : `${t.fieldId} < ${t.warning}`,
    severity: t.critical != null ? "CRITICAL" : "WARNING",
    message: t.warningMessage || `Threshold alert for ${t.fieldId}.`,
  }));

  // ── Build UI Contract ──
  // Premium tools show result cards from their outputs (limited to 5)
  const resultCards = outputs.slice(0, 5).map((o) => o.id);
  if (!resultCards.includes(primaryOutputId) && outputs.length > 0) {
    resultCards.unshift(primaryOutputId);
  }

  // Decision output: look for a boolean-like or verdict output
  const decisionOutput = outputs.find(
    (o) => /decision|verdict|risk|score|status/.test(o.id),
  )?.id || "";

  return {
    tool_id: toolId,
    tool_name: toolName,
    category: schema.sectorSlug || "General",
    risk_level: "MEDIUM",
    formula_version: "1.0.0",
    traceability_id: `PREMIUM-${toolId.toUpperCase()}`,
    standards: [],
    inputs,
    formulas,
    outputs,
    engine_rules: {
      validation: { rules: validationRules },
      smart_warnings: smartWarnings,
    },
    ui_contract: {
      input_groups: inputGroups,
      result_cards: resultCards,
      primary: primaryOutputId,
      currency_input: "currency",
      decision_output: decisionOutput,
      decision_note: decisionOutput
        ? `{${decisionOutput}} computed from ${inputs.length} inputs.`
        : "",
      insights: [
        {
          title: "Premium Analysis",
          conf: "HIGH",
          verdict: true,
          lines: [
            `{${primaryOutputId}} computed via premium schema engine.`,
            "Full decision report available below.",
          ],
        },
      ],
    },
  };
}
