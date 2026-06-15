import type { GeneratedToolInput, GeneratedToolSchema } from "@/lib/generated-tools/types";

type RawRecord = Readonly<Record<string, unknown>>;

function asRecord(value: unknown): RawRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as RawRecord;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return fallback;
}

function normalizeFormulaMap(raw: unknown): Readonly<Record<string, string>> {
  if (Array.isArray(raw)) {
    const formulas: Record<string, string> = {};
    for (const entry of raw) {
      const record = asRecord(entry);
      if (!record) {
        continue;
      }
      const id = asString(record.id);
      const expression = asString(record.expression ?? record.equation ?? record.formula);
      if (id && expression) {
        formulas[id] = expression;
      }
    }
    return formulas;
  }

  const record = asRecord(raw);
  if (!record) {
    return {};
  }

  const formulas: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && value.trim()) {
      formulas[key] = value.trim();
    }
  }
  return formulas;
}

function normalizePrimaryOutput(raw: unknown): string {
  if (typeof raw === "string") {
    const match = raw.match(/^([A-Za-z0-9_]+)/);
    return match?.[1] ?? raw.trim();
  }
  const record = asRecord(raw);
  if (record) {
    return asString(record.id, "total");
  }
  return "total";
}

function normalizeBreakdownMap(raw: unknown): Readonly<Record<string, string>> {
  const record = asRecord(raw);
  if (!record) {
    return {};
  }

  const breakdown: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string") {
      breakdown[key] = value;
      continue;
    }
    const item = asRecord(value);
    breakdown[key] = asString(item?.label, key);
  }
  return breakdown;
}

function normalizeStringList(raw: unknown): readonly string[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const values: string[] = [];
  for (const entry of raw) {
    if (typeof entry === "string" && entry.trim()) {
      values.push(entry.trim());
      continue;
    }
    const record = asRecord(entry);
    if (!record) {
      continue;
    }
    const label = asString(record.label);
    const action = asString(record.action);
    const description = asString(record.description);
    const text = action || label || description;
    if (text) {
      values.push(text);
    }
  }
  return values;
}

function normalizeGeneratedToolInput(input: GeneratedToolInput): GeneratedToolInput {
  const label = input.label.trim();
  const businessContext = input.businessContext.trim();
  return {
    ...input,
    label,
    businessContext,
  };
}

/** Normalize scan output (v1 object or v2 array schema) into GeneratedToolSchema. */
export function normalizeRawGeneratedSchema(
  raw: unknown,
  slug: string,
): GeneratedToolSchema | null {
  const record = asRecord(raw);
  if (!record) {
    return null;
  }

  const inputsRaw = Array.isArray(record.inputs) ? record.inputs : [];
  const inputs = inputsRaw
    .filter((entry): entry is GeneratedToolInput => {
      const input = asRecord(entry);
      return Boolean(input && typeof input.id === "string");
    })
    .map((entry) => normalizeGeneratedToolInput(entry as GeneratedToolInput));

  if (inputs.length === 0) {
    return null;
  }

  const outputsRecord = asRecord(record.outputs) ?? {};
  const validationRecord = asRecord(record.validation) ?? {};

  const toolName =
    asString(record.toolName) ||
    asString(record.name) ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const dataConfidenceRaw = outputsRecord.dataConfidenceAdjusted;
  const dataConfidenceAdjusted =
    typeof dataConfidenceRaw === "string"
      ? dataConfidenceRaw
      : asString(asRecord(dataConfidenceRaw)?.id, "dataConfidenceAdjusted");

  return {
    toolName,
    inputs,
    validation: {
      rules: Array.isArray(validationRecord.rules)
        ? validationRecord.rules.filter((rule): rule is string => typeof rule === "string")
        : [],
      thresholds:
        asRecord(validationRecord.thresholds) ??
        ({} as Readonly<Record<string, unknown>>),
    },
    formulas: normalizeFormulaMap(record.formulas),
    outputs: {
      primary: normalizePrimaryOutput(outputsRecord.primary),
      breakdown: normalizeBreakdownMap(outputsRecord.breakdown),
      hiddenLossDrivers: normalizeStringList(outputsRecord.hiddenLossDrivers),
      suggestedActions: normalizeStringList(outputsRecord.suggestedActions),
      dataConfidenceAdjusted,
    },
    premiumFeatures: Array.isArray(record.premiumFeatures)
      ? record.premiumFeatures.filter((feature): feature is string => typeof feature === "string")
      : [],
    premiumRequired: record.premiumRequired === true,
  };
}
