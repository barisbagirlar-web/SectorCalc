import { GENERATED_TOOL_I18N_LOCALES } from "@/lib/generated-tools/resolve-i18n-text";

type MutableSchema = Record<string, unknown>;

function buildI18nText(enText: string): Record<string, string> {
  const text: Record<string, string> = {};
  for (const locale of GENERATED_TOOL_I18N_LOCALES) {
    text[locale] = enText;
  }
  return text;
}

function isFormulaKey(value: string, formulaKeys: readonly string[]): boolean {
  return formulaKeys.includes(value);
}

function looksLikeExpression(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  return /[+\-*/^()]/.test(trimmed) || trimmed.includes("Math.") || trimmed.includes("?");
}

function normalizeInput(input: Record<string, unknown>): boolean {
  let modified = false;
  const id = typeof input.id === "string" ? input.id : "input";
  const label = typeof input.label === "string" && input.label.trim() ? input.label : id;

  if (typeof input.unit !== "string" || !input.unit.trim()) {
    input.unit = "unit";
    modified = true;
  }

  const businessContext =
    typeof input.businessContext === "string" ? input.businessContext.trim() : "";
  if (!businessContext) {
    const generated = `Business context for ${label}.`;
    input.businessContext = generated;
    input.businessContext_i18n = buildI18nText(generated);
    modified = true;
  }

  if (typeof input.label_i18n !== "object" || input.label_i18n === null) {
    input.label_i18n = buildI18nText(label);
    modified = true;
  }

  return modified;
}

function normalizeFormulaValue(value: unknown, fallbackId: string): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return fallbackId;
}

function ensureMinimumFormulas(
  formulas: Record<string, unknown>,
  inputs: Record<string, unknown>[],
): boolean {
  let modified = false;
  const fallbackId =
    typeof inputs[0]?.id === "string" ? (inputs[0].id as string) : "default_input";

  for (const key of Object.keys(formulas)) {
    const normalized = normalizeFormulaValue(formulas[key], fallbackId);
    if (formulas[key] !== normalized) {
      formulas[key] = normalized;
      modified = true;
    }
  }

  const keys = Object.keys(formulas).filter((key) => {
    const value = formulas[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  if (keys.length === 0) {
    formulas.result = fallbackId;
    modified = true;
  }

  const refreshedKeys = Object.keys(formulas).filter((key) => {
    const value = formulas[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  if (refreshedKeys.length === 1) {
    const onlyKey = refreshedKeys[0];
    const onlyValue = formulas[onlyKey];
    if (typeof onlyValue === "string") {
      formulas[`${onlyKey}_copy`] = onlyValue;
      modified = true;
    }
  }

  return modified;
}

function normalizeOutputs(schema: MutableSchema, formulas: Record<string, unknown>): boolean {
  let modified = false;
  const formulaKeys = Object.keys(formulas);
  const formulaStringKeys = formulaKeys.filter(
    (key) => typeof formulas[key] === "string" && (formulas[key] as string).trim().length > 0,
  );
  const outputs =
    schema.outputs && typeof schema.outputs === "object"
      ? (schema.outputs as Record<string, unknown>)
      : {};
  schema.outputs = outputs;

  const primary = typeof outputs.primary === "string" ? outputs.primary.trim() : "";
  if (!primary) {
    outputs.primary = formulaStringKeys[0] ?? "result";
    modified = true;
  } else if (!isFormulaKey(primary, formulaStringKeys)) {
    if (looksLikeExpression(primary)) {
      const targetKey = formulaStringKeys.includes("result") ? "primary_result" : "result";
      formulas[targetKey] = primary;
      outputs.primary = targetKey;
      modified = true;
    } else if (formulaStringKeys.length > 0) {
      outputs.primary = formulaStringKeys[0];
      modified = true;
    }
  }

  if (!Array.isArray(outputs.breakdown)) {
    outputs.breakdown = formulaStringKeys.slice(0, 4).map((key) => key);
    modified = true;
  }

  return modified;
}

export function applyIndustrialSchemaAutoFix(
  schema: MutableSchema,
  slug: string,
): boolean {
  let modified = false;

  if (typeof schema.toolName !== "string" || !schema.toolName.trim()) {
    schema.toolName = slug;
    modified = true;
  }

  if (!Array.isArray(schema.inputs) || schema.inputs.length === 0) {
    const label = "Default Input";
    const businessContext = "Default numeric input for calculator execution.";
    schema.inputs = [
      {
        id: "default_input",
        label,
        label_i18n: buildI18nText(label),
        type: "number",
        unit: "unit",
        default: 1,
        businessContext,
        businessContext_i18n: buildI18nText(businessContext),
      },
      {
        id: "secondary_input",
        label: "Secondary Input",
        label_i18n: buildI18nText("Secondary Input"),
        type: "number",
        unit: "unit",
        default: 1,
        businessContext: "Secondary numeric input for calculator execution.",
        businessContext_i18n: buildI18nText("Secondary numeric input for calculator execution."),
      },
      {
        id: "tertiary_input",
        label: "Tertiary Input",
        label_i18n: buildI18nText("Tertiary Input"),
        type: "number",
        unit: "unit",
        default: 1,
        businessContext: "Tertiary numeric input for calculator execution.",
        businessContext_i18n: buildI18nText("Tertiary numeric input for calculator execution."),
      },
    ];
    modified = true;
  }

  const inputs = schema.inputs as Record<string, unknown>[];
  while (inputs.length < 3) {
    const id = `auto_input_${inputs.length + 1}`;
    inputs.push({
      id,
      label: id,
      label_i18n: buildI18nText(id),
      type: "number",
      unit: "unit",
      default: 1,
      businessContext: `Auto-generated input ${inputs.length + 1}.`,
      businessContext_i18n: buildI18nText(`Auto-generated input ${inputs.length + 1}.`),
    });
    modified = true;
  }

  for (const input of inputs) {
    if (input && typeof input === "object") {
      modified = normalizeInput(input as Record<string, unknown>) || modified;
    }
  }

  if (!schema.formulas || typeof schema.formulas !== "object") {
    schema.formulas = {};
    modified = true;
  }

  const formulas = schema.formulas as Record<string, unknown>;
  const outputs =
    schema.outputs && typeof schema.outputs === "object"
      ? (schema.outputs as Record<string, unknown>)
      : null;
  const primaryCandidate =
    outputs && typeof outputs.primary === "string" ? outputs.primary.trim() : "";

  if (Object.keys(formulas).length === 0 && primaryCandidate && looksLikeExpression(primaryCandidate)) {
    formulas.result = primaryCandidate;
    modified = true;
  }

  if (Array.isArray(outputs?.breakdown)) {
    for (const entry of outputs.breakdown) {
      if (typeof entry !== "string") {
        continue;
      }
      const expression = entry.includes(":") ? entry.split(":").slice(1).join(":").trim() : entry.trim();
      if (!expression || isFormulaKey(expression, Object.keys(formulas))) {
        continue;
      }
      if (!looksLikeExpression(expression) || /=/.test(expression) || /[≈×₀₁₂₃₄]/.test(expression)) {
        continue;
      }
      const key =
        expression.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 40) ||
        `breakdown_${Object.keys(formulas).length + 1}`;
      if (!formulas[key]) {
        formulas[key] = expression;
        modified = true;
      }
    }
  }

  modified = ensureMinimumFormulas(formulas, inputs) || modified;
  modified = normalizeOutputs(schema, formulas) || modified;

  if (schema.premiumRequired === undefined) {
    schema.premiumRequired = false;
    modified = true;
  }

  if (!schema.category || schema.category === "Diğer") {
    schema.category = "Üretim & İmalat";
    modified = true;
  }

  if (!schema.sector || schema.sector === "Diğer") {
    schema.sector = "Üretim & İmalat";
    modified = true;
  }

  return modified;
}
