import { normalizeGeneratedSelectOptions } from "@/lib/generated-tools/select-options";
import { normalizeGeneratedI18nText } from "@/lib/generated-tools/resolve-i18n-text";
import { inferUnitFromOutputKey } from "@/lib/generated-tools/resolve-output-unit";
import type {
  GeneratedToolAboutContent,
  GeneratedToolAboutDescription,
  GeneratedToolAboutExample,
  GeneratedToolAboutFaq,
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

function normalizeBreakdownMap(
  raw: unknown,
  formulaNames: Readonly<Record<string, string>> = {},
): Readonly<Record<string, string>> {
  const breakdown: Record<string, string> = {};

  // Handle array-format breakdown: ["formulaKey1", "formulaKey2", ...]
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string" && item.trim()) {
        const label = formulaNames[item] || item;
        breakdown[item] = label;
      }
    }
    return breakdown;
  }

  const record = asRecord(raw);
  if (!record) {
    return {};
  }

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && value.trim()) {
      breakdown[key] = value.trim();
      continue;
    }
    const item = asRecord(value);
    const fromItem = asString(item?.label);
    breakdown[key] = fromItem || formulaNames[key] || key;
  }
  return breakdown;
}

function buildFormulaNameMap(record: RawRecord): Readonly<Record<string, string>> {
  const formulasRaw = record.formulas;
  const names: Record<string, string> = {};

  if (Array.isArray(formulasRaw)) {
    for (const entry of formulasRaw) {
      const formula = asRecord(entry);
      const id = asString(formula?.id);
      const name = asString(formula?.name);
      if (id && name) {
        names[id] = name;
      }
    }
  }

  return names;
}

function buildFormulaUnitMap(record: RawRecord): Readonly<Record<string, string>> {
  const formulasRaw = record.formulas;
  const units: Record<string, string> = {};

  if (Array.isArray(formulasRaw)) {
    for (const entry of formulasRaw) {
      const formula = asRecord(entry);
      const id = asString(formula?.id);
      const unit = asString(formula?.unit);
      if (id && unit) {
        units[id] = unit;
      }
    }
  }

  return units;
}

function normalizeBreakdownUnits(
  breakdownKeys: readonly string[],
  formulaUnits: Readonly<Record<string, string>>,
): Readonly<Record<string, string>> | undefined {
  const units: Record<string, string> = {};
  for (const key of breakdownKeys) {
    const unit = formulaUnits[key];
    if (unit) {
      units[key] = unit;
    }
  }
  return Object.keys(units).length > 0 ? units : undefined;
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

function firstSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  const match = trimmed.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] ?? trimmed).trim();
}

function normalizeStringArray(raw: unknown): readonly string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);
}

function normalizeAboutDescription(raw: unknown): GeneratedToolAboutDescription | null {
  if (typeof raw === "string") {
    const long = raw.trim();
    if (!long) {
      return null;
    }
    return {
      short: firstSentence(long),
      long,
    };
  }

  const record = asRecord(raw);
  if (!record) {
    return null;
  }

  const long = asString(record.long ?? record.text ?? record.body);
  const short = asString(record.short) || firstSentence(long);
  if (!long && !short) {
    return null;
  }

  return {
    short: short || firstSentence(long),
    long: long || short,
    short_i18n: record.short_i18n
      ? normalizeGeneratedI18nText(record.short_i18n, short)
      : undefined,
    long_i18n: record.long_i18n
      ? normalizeGeneratedI18nText(record.long_i18n, long || short)
      : undefined,
  };
}

function normalizeAboutExample(raw: unknown): GeneratedToolAboutExample | null {
  const record = asRecord(raw);
  if (!record) {
    return null;
  }

  const title = asString(record.title);
  const scenario = asString(record.scenario);
  const steps = normalizeStringArray(record.steps);
  const result = asString(record.result);
  if (!title || !scenario || steps.length === 0 || !result) {
    return null;
  }

  return {
    title,
    scenario,
    steps,
    result,
    title_i18n: record.title_i18n
      ? normalizeGeneratedI18nText(record.title_i18n, title)
      : undefined,
    scenario_i18n: record.scenario_i18n
      ? normalizeGeneratedI18nText(record.scenario_i18n, scenario)
      : undefined,
    result_i18n: record.result_i18n
      ? normalizeGeneratedI18nText(record.result_i18n, result)
      : undefined,
  };
}

function normalizeAboutFaqs(raw: unknown): readonly GeneratedToolAboutFaq[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) {
    return undefined;
  }

  const faqs: GeneratedToolAboutFaq[] = [];
  for (const entry of raw) {
    const record = asRecord(entry);
    if (!record) {
      continue;
    }
    const question = asString(record.question);
    const answer = asString(record.answer);
    if (!question || !answer) {
      continue;
    }
    faqs.push({
      question,
      answer,
      question_i18n: record.question_i18n
        ? normalizeGeneratedI18nText(record.question_i18n, question)
        : undefined,
      answer_i18n: record.answer_i18n
        ? normalizeGeneratedI18nText(record.answer_i18n, answer)
        : undefined,
    });
  }

  return faqs.length > 0 ? faqs : undefined;
}

function normalizeAboutContent(record: RawRecord): GeneratedToolAboutContent | undefined {
  const description =
    normalizeAboutDescription(record.description) ??
    normalizeAboutDescription(record.aboutDescription);
  const example = normalizeAboutExample(record.example);
  const faqs = normalizeAboutFaqs(record.faqs);

  if (!description && !example && !faqs) {
    return undefined;
  }

  return {
    description: description ?? { short: "", long: "" },
    example: example ?? undefined,
    faqs,
  };
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

  const rawLabel = asString(record.label);
  const rawBusinessContext = asString(record.businessContext);

  return {
    id: record.id.trim(),
    label: rawLabel,
    label_i18n: record.label_i18n
      ? normalizeGeneratedI18nText(record.label_i18n, rawLabel)
      : undefined,
    type,
    unit: asString(record.unit),
    default: record.default as GeneratedToolInput["default"],
    min: typeof record.min === "number" ? record.min : null,
    max: typeof record.max === "number" ? record.max : null,
    options: selectOptions?.values ?? null,
    optionLabels: selectOptions?.labels,
    businessContext: rawBusinessContext,
    businessContext_i18n: record.businessContext_i18n
      ? normalizeGeneratedI18nText(record.businessContext_i18n, rawBusinessContext)
      : undefined,
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
  const formulaNames = buildFormulaNameMap(record);
  const formulaUnits = buildFormulaUnitMap(record);
  const breakdownMap = normalizeBreakdownMap(outputsRecord.breakdown, formulaNames);

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

  const primaryOutput = normalizePrimaryOutput(outputsRecord.primary);
  const explicitUnit = asString(outputsRecord.unit);
  const resolvedUnit =
    explicitUnit ||
    inferUnitFromOutputKey(primaryOutput) ||
    (() => {
      const inputUnit = inputs.find((input) => {
        const unit = input.unit.trim().toLowerCase();
        return unit && unit !== "unit" && unit !== "units";
      })?.unit;
      return inputUnit ?? "";
    })();

  const catalogCategory = asString(record.catalogCategory) || undefined;
  const sectorSlug = asString(record.sectorSlug) || undefined;
  const categorySlug = asString(record.categorySlug) || undefined;
  const sectorId = asString(record.sectorId) || undefined;
  const categoryId = asString(record.categoryId) || undefined;
  const sector = asString(record.sector) || undefined;
  const category = asString(record.category) || undefined;
  const profession = asString(record.profession) || undefined;
  const about = normalizeAboutContent(record);

  return {
    toolName,
    catalogCategory,
    sectorSlug,
    categorySlug,
    sectorId,
    categoryId,
    sector,
    category,
    profession,
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
      primary: primaryOutput,
      unit: resolvedUnit || undefined,
      breakdown: breakdownMap,
      breakdownUnits: normalizeBreakdownUnits(Object.keys(breakdownMap), formulaUnits),
      hiddenLossDrivers: normalizeStringList(outputsRecord.hiddenLossDrivers),
      suggestedActions: normalizeStringList(outputsRecord.suggestedActions),
      dataConfidenceAdjusted,
    },
    premiumFeatures: Array.isArray(record.premiumFeatures)
      ? record.premiumFeatures.filter((feature): feature is string => typeof feature === "string")
      : [],
    premiumRequired: record.premiumRequired === true,
    about,
  };
}
