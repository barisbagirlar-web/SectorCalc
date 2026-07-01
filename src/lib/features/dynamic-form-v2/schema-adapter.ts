/**
 * Adapter that converts GeneratedToolSchema (existing tool format) into
 * the ToolData format expected by DynamicFormEngine.
 *
 * This allows ALL existing free & premium tools to render through the
 * new dynamic form engine without modifying their original schema.
 */

import type { ToolData, ToolInputField, ToolOutput, InputGroup, ValidationRule, SmartWarning } from "./types";
import { validateInputFieldReference } from "@/schemas/tool-input-schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyToolSchema = Record<string, any>;

const EN_CONFIDENCE_LABELS = ["EXACT", "HIGH", "MEDIUM", "LOW"];

// Confidence label normalization → English
const CONF_MAP: Record<string, string> = {
  EXACT: "EXACT",
  CERTAIN: "EXACT",
  HIGH: "HIGH",
  STRONG: "HIGH",
  MEDIUM: "MEDIUM",
  DEFAULT: "MEDIUM",
  COMPUTED: "MEDIUM",
  APPROXIMATE: "LOW",
  ASSUMPTION: "LOW",
  LOW: "LOW",
  KESİN: "EXACT",
  GÜÇLÜ: "HIGH",
  ORTA: "MEDIUM",
  "EKSİK VERİ": "LOW",
};

function inferConfidence(input: { confidence?: string; confidence_label?: string; uncertainty?: unknown }): string {
  const raw = (input.confidence || input.confidence_label || "").toUpperCase();
  if (CONF_MAP[raw]) return CONF_MAP[raw];
  // Infer from uncertainty presence
  if (input.uncertainty != null) return "HIGH";
  return "EXACT";
}

function inferUnitDisplay(unit: string): string {
  if (!unit || unit === "dimensionless") return "ratio";
  return unit;
}

function toTitleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

/** Resolve English label from i18n map, falling back to default label */
function resolveEnglishLabel(inp: AnyToolSchema): string {
  if (inp.label_i18n?.en) return inp.label_i18n.en;
  if (inp.name_i18n?.en) return inp.name_i18n.en;
  return inp.label || inp.name || toTitleCase(inp.id);
}

/** Resolve English note from i18n map */
function resolveEnglishNote(inp: AnyToolSchema): string {
  if (inp.businessContext_i18n?.en) return inp.businessContext_i18n.en;
  if (inp.note_i18n?.en) return inp.note_i18n.en;
  return inp.businessContext || inp.note || inp.helperText || inp.placeholder || inp.hint || "";
}

export function adaptToolSchema(
  schema: AnyToolSchema,
  slug?: string,
): ToolData {
  const toolId = schema.tool_id || schema.toolId || schema.id || slug || "TOOL_UNKNOWN";
  const toolName = schema.tool_name || schema.toolName || schema.name || toTitleCase(toolId);
  const category = schema.category || schema.industry || schema.sector || "General";

  // ---- INPUTS ----
  const rawInputs: AnyToolSchema[] = schema.inputs || [];
  const inputs: ToolInputField[] = rawInputs.map((inp: AnyToolSchema) => {
    const conf = inferConfidence(inp);
    const unit = inp.unit || "unit";
    const isEnum = inp.type === "select" || (inp.options && inp.options.length > 0);

    return {
      id: inp.id,
      name: resolveEnglishLabel(inp),
      symbol: inp.symbol || inp.id.slice(0, 2).toUpperCase(),
      unit: isEnum ? "enum" : inferUnitDisplay(unit),
      allowed_values: isEnum
        ? (inp.options || []).map((o: AnyToolSchema) => (typeof o === "string" ? o : o.value || o.id))
        : undefined,
      default: inp.default ?? (isEnum && inp.options?.[0] ? (typeof inp.options[0] === "string" ? inp.options[0] : inp.options[0].value || inp.options[0].id) : undefined),
      absolute_min: inp.min ?? inp.absolute_min ?? (unit === "ratio" ? 0 : undefined),
      absolute_max: inp.max ?? inp.absolute_max ?? (unit === "ratio" ? 1 : undefined),
      resolution: inp.step ?? inp.resolution ?? (inp.type === "number" ? 0.01 : undefined),
      confidence_label: conf,
      note: resolveEnglishNote(inp),
      reference: inp.reference || inp.ref || undefined,
      unit_family: inp.unit_family || undefined,
      benchmarks: inp.benchmarks || undefined,
    };
  });

  // ---- REFERENCE VALIDATION (development only) ----
  if (process.env.NODE_ENV !== "production") {
    for (const inp of rawInputs) {
      const refWarnings = validateInputFieldReference({
        id: inp.id,
        reference: inp.reference || inp.ref,
        unit: inp.unit || "unit",
      });
      for (const w of refWarnings) {
        console.warn("[schema-adapter] " + w);
      }
    }
  }

  // ---- OUTPUTS ----
  const rawOutputs = schema.outputs || {};
  const primaryKey = rawOutputs.primary || Object.keys(schema.formulas || {}).slice(-1)[0] || "result";
  const outputMap: Record<string, AnyToolSchema> = {};

  // Collect from formulas
  const formulas = schema.formulas || {};
  Object.keys(formulas).forEach((id) => {
    const outId = typeof id === "string" ? id : `f${id}`;
    outputMap[outId] = { id: outId };
  });

  // If outputs has explicit definitions
  if (rawOutputs.breakdown) {
    Object.keys(rawOutputs.breakdown).forEach((key) => {
      outputMap[key] = { id: key, name: rawOutputs.breakdown[key] };
    });
  }
  if (rawOutputs.unit) {
    outputMap[primaryKey] = { ...outputMap[primaryKey], unit: rawOutputs.unit };
  }

  const outputs: ToolOutput[] = Object.entries(outputMap).map(([id, def]) => ({
    id,
    name: def.name || toTitleCase(id),
    unit: def.unit || "unit",
    precision: def.precision ?? null,
    confidence_label: def.confidence_label || "HIGH",
    enum_labels: def.enum_labels || undefined,
  }));

  // ---- FORMULAS ----
  const fArr = Object.entries(formulas).map(([id, expr]) => ({
    id,
    output: id,
    expression: typeof expr === "string" ? expr : String(expr),
    uncertainty_expression: undefined as string | undefined,
  }));

  // ---- VALIDATION RULES ----
  const rawValidation = schema.validation || schema.engine_rules?.validation || {};
  const rawRules = rawValidation.rules || [];

  /** Check if a validation condition string is a real executable expression (not plain text) */
  function isValidConditionExpr(cond: string): boolean {
    return (
      cond.includes(">") || cond.includes("<") || cond.includes("=") ||
      cond.includes("!") || cond.includes("&&") || cond.includes("||")
    ) && /[a-zA-Z]/.test(cond);
  }

  const validationRules: ValidationRule[] = rawRules
    .filter((r: AnyToolSchema) => {
      const cond = typeof r === "string" ? r : (r.condition || "");
      return isValidConditionExpr(cond);
    })
    .map((r: AnyToolSchema, idx: number) => ({
      id: r.id || `V${idx + 1}`,
      condition: typeof r === "string" ? r : (r.condition || ""),
      message: typeof r === "string"
        ? `Validation rule ${idx + 1} failed.`
        : (r.message || `Rule ${idx + 1} failed.`),
    }));

  // Auto-generate basic validation rules from input constraints
  rawInputs.forEach((inp: AnyToolSchema, i: number) => {
    if (inp.min != null) {
      validationRules.push({
        id: `V_auto_min_${inp.id}`,
        condition: `${inp.id} >= ${inp.min}`,
        message: `${inp.label || inp.id} must be ≥ ${inp.min}.`,
      });
    }
    if (inp.max != null) {
      validationRules.push({
        id: `V_auto_max_${inp.id}`,
        condition: `${inp.id} <= ${inp.max}`,
        message: `${inp.label || inp.id} must be ≤ ${inp.max}.`,
      });
    }
  });

  // ---- SMART WARNINGS ----
  const rawWarnings = schema.engine_rules?.smart_warnings || schema.smart_warnings || [];
  const smartWarnings: SmartWarning[] = rawWarnings.map((w: AnyToolSchema, i: number) => ({
    id: w.id || `W${i + 1}`,
    trigger: w.trigger || w.condition || "false",
    severity: w.severity || "WARNING",
    message: w.message || "",
  }));

  // ---- BUILD UI CONTRACT ----
  const inputGroups = extractGroups(rawInputs, schema.input_groups || schema.ui_contract?.input_groups);

  const resultCards = outputs
    .filter((o) => o.id !== primaryKey && o.id !== "breakdown" && !o.id.startsWith("X"))
    .slice(0, 7)
    .map((o) => o.id);

  if (!resultCards.includes(primaryKey)) {
    resultCards.unshift(primaryKey);
  }

  // Decision output: look for a boolean or enum output that sounds like a decision
  const decisionOutput = outputs.find(
    (o) => /decision|verdict|ok|pass|fail|status/.test(o.id),
  )?.id || "";

  return {
    tool_id: toolId,
    tool_name: toolName,
    category,
    risk_level: schema.risk_level || schema.riskLevel || "MEDIUM",
    formula_version: schema.formula_version || schema.version || "1.0.0",
    traceability_id: schema.traceability_id || `TOOL-${toolId.toUpperCase()}-001`,
    standards: schema.standards || schema.standardOptions?.map((s: AnyToolSchema) => s.label || s.id) || [],
    inputs,
    formulas: fArr,
    outputs,
    engine_rules: {
      validation: { rules: validationRules },
      smart_warnings: smartWarnings,
    },
    ui_contract: {
      input_groups: inputGroups,
      result_cards: resultCards,
      primary: primaryKey,
      currency_input: "currency",
      decision_output: decisionOutput,
      decision_note: `{${decisionOutput}} computed.`,
      insights: [
        {
          title: "Verdict",
          conf: "HIGH",
          verdict: true,
          lines: [`{${primaryKey}} computed from ${rawInputs.length} inputs.`],
        },
      ],
      primary_uncertainty: undefined,
    },
  };
}

/** Extract input groups from schema, with fallback to auto-grouping */
function extractGroups(
  inputs: AnyToolSchema[],
  groupDefs?: AnyToolSchema[],
): InputGroup[] {
  if (groupDefs && groupDefs.length > 0) {
    return groupDefs.map((g: AnyToolSchema) => ({
      id: g.id || g.title?.toLowerCase().replace(/\s+/g, "_") || "group",
      title: g.title || g.name || g.id || "Input Group",
      fields: g.fields || g.inputIds || g.input_ids || [],
    }));
  }

  // Auto-group by existing `group` property on inputs
  const groups: Record<string, string[]> = {};
  inputs.forEach((inp: AnyToolSchema) => {
    const g = inp.group || "general";
    if (!groups[g]) groups[g] = [];
    groups[g].push(inp.id);
  });

  return Object.entries(groups).map(([gid, fields]) => ({
    id: gid,
    title: toTitleCase(gid),
    fields,
  }));
}
