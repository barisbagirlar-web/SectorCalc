import { normalizeGeneratedSelectOptions } from "@/lib/generated-tools/select-options";
import type {
  GeneratedToolInput,
  GeneratedToolSchema,
  GeneratedToolStandardOption,
} from "@/lib/generated-tools/types";

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

      const outputRaw = record.output ?? record.outputs ?? record.outputIds;
      const outputIds: string[] = [];
      if (typeof outputRaw === "string") {
        for (const part of outputRaw.split(",")) {
          const trimmed = part.trim();
          if (trimmed) outputIds.push(trimmed);
        }
      } else if (Array.isArray(outputRaw)) {
        for (const part of outputRaw) {
          const trimmed = typeof part === "string" ? part.trim() : "";
          if (trimmed) outputIds.push(trimmed);
        }
      }

      if (expression) {
        const lhsVars: string[] = [];
        // capture assignment LHS only (avoid == / >= / <=)
        const lhsRegex = /\b([\p{L}][\p{L}\p{N}_]*)\s*=(?![=<>])/gu;
        for (const match of expression.matchAll(lhsRegex)) {
          const v = match[1]?.trim();
          if (!v) continue;
          if (!lhsVars.includes(v)) lhsVars.push(v);
        }

        // If schema declares multiple outputs, replace internal assignment vars
        // (e.g. R_A/R_B, M_max, δ_max, σ_max) to declared output ids by order.
        if (outputIds.length > 0) {
          let mappedExpr = expression;
          for (let i = 0; i < Math.min(outputIds.length, lhsVars.length); i += 1) {
            const from = lhsVars[i];
            const to = outputIds[i];
            const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            mappedExpr = mappedExpr.replace(new RegExp(`\\b${escapedFrom}\\b`, "g"), to);
          }

          for (const outId of outputIds) {
            formulas[outId] = mappedExpr;
          }
          continue;
        }

        if (id) {
          formulas[id] = expression;
        }
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

function normalizeStandardOptions(raw: unknown): readonly GeneratedToolStandardOption[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) {
    return undefined;
  }

  const options: GeneratedToolStandardOption[] = [];
  for (const entry of raw) {
    const record = asRecord(entry);
    if (!record) {
      continue;
    }
    const id = asString(record.id);
    const label = asString(record.label);
    if (!id || !label) {
      continue;
    }
    const description = asString(record.description);
    options.push(description ? { id, label, description } : { id, label });
  }

  return options.length > 0 ? options : undefined;
}

function normalizeLastUpdated(raw: unknown): string | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }
  const match = raw.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1];
}

function normalizeGeneratedToolInputFromRaw(entry: unknown): GeneratedToolInput | null {
  const record = asRecord(entry);
  if (!record || typeof record.id !== "string") {
    return null;
  }

  const typeRaw = asString(record.type, "number");
  const type: GeneratedToolInput["type"] =
    typeRaw === "select" || typeRaw === "boolean" ? typeRaw : "number";

  const selectOptions = type === "select" ? normalizeGeneratedSelectOptions(record.options) : undefined;

  return {
    id: record.id.trim(),
    label: asString(record.label),
    type,
    unit: asString(record.unit),
    default: record.default as GeneratedToolInput["default"],
    min: typeof record.min === "number" ? record.min : null,
    max: typeof record.max === "number" ? record.max : null,
    options: selectOptions?.values ?? null,
    optionLabels: selectOptions?.labels,
    businessContext: asString(record.businessContext),
    group: asString(record.group) || undefined,
  };
}

function normalizeGeneratedToolInput(input: GeneratedToolInput): GeneratedToolInput {
  const label = input.label.trim();
  const businessContext = input.businessContext.trim();

  if (input.type !== "select" || !Array.isArray(input.options)) {
    return { ...input, label, businessContext };
  }

  const hasObjectOptions = input.options.some(
    (entry) => entry !== null && typeof entry === "object",
  );
  if (!hasObjectOptions) {
    return { ...input, label, businessContext };
  }

  const selectOptions = normalizeGeneratedSelectOptions(input.options);
  return {
    ...input,
    label,
    businessContext,
    options: selectOptions?.values ?? input.options ?? null,
    optionLabels: selectOptions?.labels ?? input.optionLabels,
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
    .map((entry) => normalizeGeneratedToolInputFromRaw(entry))
    .filter((input): input is GeneratedToolInput => input !== null)
    .map((entry) => normalizeGeneratedToolInput(entry));

  if (inputs.length === 0) {
    return null;
  }

  const outputsRecord = asRecord(record.outputs) ?? {};
  const validationRecord = asRecord(record.validation) ?? {};

  const toolName =
    asString(record.toolName) ||
    asString(record.title) ||
    asString(record.name) ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const dataConfidenceRaw = outputsRecord.dataConfidenceAdjusted;
  const dataConfidenceAdjusted =
    typeof dataConfidenceRaw === "string"
      ? dataConfidenceRaw
      : asString(asRecord(dataConfidenceRaw)?.id, "dataConfidenceAdjusted");

  return {
    toolName,
    lastUpdated: normalizeLastUpdated(record.lastUpdated),
    standardOptions: normalizeStandardOptions(record.standardOptions),
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
