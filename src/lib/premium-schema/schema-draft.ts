/**
 * Premium schema draft — admin authoring only. Never auto-published.
 */

import { SCHEMA_ENGINE_CONSTANTS } from "@/lib/premium-schema/schema-linter";
import type { FormulaFamilyId } from "@/lib/premium-schema/formula-families";
import { FORMULA_REGISTRY, listRegisteredFormulaIds } from "@/lib/premium-schema/formula-registry";
import { getFormulaRegistryMeta } from "@/lib/premium-schema/formula-registry";
import type {
  ExportFormat,
  PremiumCalculatorSchema,
  PremiumInputType,
  PremiumOutputFormat,
  ReportSectionId,
  ThresholdDirection,
} from "@/lib/premium-schema/premium-calculator-schema";
import { FORMULA_FAMILIES, PREMIUM_FORBIDDEN_PATTERNS } from "@/lib/premium-schema/formula-families";

export interface DraftInput {
  id: string;
  label: string;
  type: PremiumInputType;
  unit: string;
  required: boolean;
  smartDefault: string;
  min: string;
  max: string;
  step: string;
  helper: string;
  expertMeaning: string;
}

export interface DraftFormulaStep {
  formulaId: string;
  inputMap: Record<string, string>;
  outputId: string;
}

export interface DraftOutput {
  id: string;
  label: string;
  unit: string;
  format: PremiumOutputFormat;
  isBigNumber: boolean;
  description: string;
}

export interface DraftThreshold {
  fieldId: string;
  warning: string;
  critical: string;
  direction: ThresholdDirection;
  warningMessage: string;
  criticalMessage: string;
}

export interface DraftReportConfig {
  title: string;
  sections: ReportSectionId[];
  exportFormats: ExportFormat[];
  assumptionNotes: string[];
  legalNote: string;
  hiddenLossMultiplier: string;
  volatilityPercent: string;
  targetMarginPercent: string;
}

export interface PremiumSchemaDraft {
  slug: string;
  name: string;
  sectorSlug: string;
  category: FormulaFamilyId | "";
  painStatement: string;
  promise: string;
  legacyPaidSlug: string;
  inputs: DraftInput[];
  formulaPipeline: DraftFormulaStep[];
  outputs: DraftOutput[];
  thresholds: DraftThreshold[];
  report: DraftReportConfig;
}

export interface SchemaDraftValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const ALL_REPORT_SECTIONS: readonly ReportSectionId[] = [
  "executive_summary",
  "loss_breakdown",
  "thresholds",
  "sensitivity",
  "action_plan",
  "assumptions",
];

const ENGINE_CONSTANTS = new Set<string>(SCHEMA_ENGINE_CONSTANTS);

function parseNumber(value: string, fallback = 0): number {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseSmartDefault(
  type: PremiumInputType,
  value: string
): number | string | boolean | undefined {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  if (type === "boolean") {
    return trimmed === "true" || trimmed === "1" || trimmed.toLowerCase() === "yes";
  }
  if (type === "select") {
    return trimmed;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : trimmed;
}

export function createEmptyPremiumSchemaDraft(): PremiumSchemaDraft {
  return {
    slug: "",
    name: "",
    sectorSlug: "",
    category: "",
    painStatement: "",
    promise: "",
    legacyPaidSlug: "",
    inputs: [],
    formulaPipeline: [],
    outputs: [],
    thresholds: [],
    report: {
      title: "",
      sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
      exportFormats: ["pdf"],
      assumptionNotes: [],
      legalNote:
        "This report is a technical decision-support simulation based on user-provided inputs and sector assumptions. It is not financial, legal, medical or engineering advice. Verify all outputs before business decisions.",
      hiddenLossMultiplier: "1.1",
      volatilityPercent: "15",
      targetMarginPercent: "12",
    },
  };
}

export function createDraftInput(partial?: Partial<DraftInput>): DraftInput {
  return {
    id: partial?.id ?? "",
    label: partial?.label ?? "",
    type: partial?.type ?? "number",
    unit: partial?.unit ?? "",
    required: partial?.required ?? true,
    smartDefault: partial?.smartDefault ?? "",
    min: partial?.min ?? "",
    max: partial?.max ?? "",
    step: partial?.step ?? "",
    helper: partial?.helper ?? "",
    expertMeaning: partial?.expertMeaning ?? "",
  };
}

export function createDraftFormulaStep(partial?: Partial<DraftFormulaStep>): DraftFormulaStep {
  return {
    formulaId: partial?.formulaId ?? "",
    inputMap: partial?.inputMap ?? {},
    outputId: partial?.outputId ?? "",
  };
}

export function createDraftOutput(partial?: Partial<DraftOutput>): DraftOutput {
  return {
    id: partial?.id ?? "",
    label: partial?.label ?? "",
    unit: partial?.unit ?? "",
    format: partial?.format ?? "currency",
    isBigNumber: partial?.isBigNumber ?? false,
    description: partial?.description ?? "",
  };
}

function collectAvailableSources(
  draft: PremiumSchemaDraft,
  stepIndex: number
): Set<string> {
  const sources = new Set<string>(draft.inputs.map((input) => input.id).filter(Boolean));
  for (let index = 0; index < stepIndex; index += 1) {
    const outputId = draft.formulaPipeline[index]?.outputId.trim();
    if (outputId) {
      sources.add(outputId);
    }
  }
  for (const constant of ENGINE_CONSTANTS) {
    sources.add(constant);
  }
  return sources;
}

function hasForbiddenKeys(value: unknown): boolean {
  if (value === null || typeof value !== "object") {
    if (typeof value === "string") {
      return PREMIUM_FORBIDDEN_PATTERNS.some((pattern) =>
        value.toLowerCase().includes(pattern.toLowerCase())
      );
    }
    return false;
  }

  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (PREMIUM_FORBIDDEN_PATTERNS.some((pattern) => lowerKey.includes(pattern.toLowerCase()))) {
      return true;
    }
    if (hasForbiddenKeys(nested)) {
      return true;
    }
  }
  return false;
}

export function validatePremiumSchemaDraft(draft: PremiumSchemaDraft): SchemaDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!draft.slug.trim()) {
    errors.push("Slug is required.");
  }
  if (!draft.name.trim()) {
    errors.push("Name is required.");
  }
  if (!draft.sectorSlug.trim()) {
    errors.push("Sector slug is required.");
  }
  if (!draft.category || !FORMULA_FAMILIES.includes(draft.category)) {
    errors.push("Category (formula family) is required.");
  }
  if (draft.inputs.length === 0) {
    errors.push("At least one input is required.");
  }
  if (draft.formulaPipeline.length === 0) {
    errors.push("At least one formula pipeline step is required.");
  }
  if (draft.outputs.length === 0) {
    errors.push("At least one output is required.");
  }
  if (!draft.outputs.some((output) => output.isBigNumber)) {
    errors.push("Missing big number output — mark one output as primary exposure.");
  }
  if (!draft.report.legalNote.trim()) {
    errors.push("Legal note is required.");
  }
  if (draft.report.sections.length === 0) {
    errors.push("At least one report section is required.");
  }
  if (draft.report.title.trim() === "") {
    warnings.push("Report title is empty.");
  }
  if (draft.report.assumptionNotes.length === 0) {
    warnings.push("No assumptions added.");
  }
  if (!draft.report.sections.includes("sensitivity")) {
    warnings.push("No sensitivity section selected.");
  }
  if (draft.inputs.length > 8) {
    warnings.push("More than 8 inputs may hurt field usability.");
  }

  const inputIds = new Set<string>();
  for (const input of draft.inputs) {
    if (!input.id.trim()) {
      errors.push("Input id is required for every input row.");
      continue;
    }
    if (inputIds.has(input.id)) {
      errors.push(`Duplicate input id "${input.id}".`);
    }
    inputIds.add(input.id);
  }

  const outputIds = new Set<string>();
  for (const output of draft.outputs) {
    if (!output.id.trim()) {
      errors.push("Output id is required for every output row.");
      continue;
    }
    if (outputIds.has(output.id)) {
      errors.push(`Duplicate output id "${output.id}".`);
    }
    outputIds.add(output.id);
  }

  const registered = new Set(listRegisteredFormulaIds());
  draft.formulaPipeline.forEach((step, index) => {
    if (!step.formulaId.trim()) {
      errors.push(`Formula step ${index + 1}: formulaId is required.`);
      return;
    }
    if (!registered.has(step.formulaId)) {
      errors.push(`Unknown formulaId "${step.formulaId}".`);
    } else if (!FORMULA_REGISTRY[step.formulaId]) {
      errors.push(`FormulaId "${step.formulaId}" is not registered.`);
    }

    if (!step.outputId.trim()) {
      errors.push(`Formula step ${index + 1}: outputId is required.`);
    } else if (!outputIds.has(step.outputId)) {
      errors.push(`Formula step ${index + 1}: outputId "${step.outputId}" not found in outputs.`);
    }

    const sources = collectAvailableSources(draft, index);
    const meta = getFormulaRegistryMeta(step.formulaId);
    if (meta) {
      for (const requiredInput of meta.requiredInputs) {
        const source = step.inputMap[requiredInput]?.trim();
        if (!source) {
          errors.push(
            `Formula step ${index + 1}: inputMap missing "${requiredInput}" for ${step.formulaId}.`
          );
        } else if (!sources.has(source)) {
          errors.push(
            `Formula step ${index + 1}: inputMap source "${source}" not found (input or prior output).`
          );
        }
      }
    }

    for (const source of Object.values(step.inputMap)) {
      if (source.trim() && !sources.has(source.trim())) {
        errors.push(`Formula step ${index + 1}: inputMap source "${source}" not found.`);
      }
    }
  });

  const fieldIds = new Set<string>([...inputIds, ...outputIds]);
  for (const threshold of draft.thresholds) {
    if (!threshold.fieldId.trim()) {
      errors.push("Threshold fieldId is required.");
      continue;
    }
    if (!fieldIds.has(threshold.fieldId)) {
      errors.push(`Threshold fieldId "${threshold.fieldId}" not found in inputs or outputs.`);
    }
  }

  if (hasForbiddenKeys(draft)) {
    errors.push("Draft contains forbidden expression or executable keys.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function draftToPremiumSchema(draft: PremiumSchemaDraft): PremiumCalculatorSchema | null {
  const validation = validatePremiumSchemaDraft(draft);
  if (!validation.valid || !draft.category) {
    return null;
  }

  return {
    id: draft.slug.trim(),
    name: draft.name.trim(),
    sectorSlug: draft.sectorSlug.trim(),
    category: draft.category,
    painStatement: draft.painStatement.trim() || draft.promise.trim(),
    legacyPaidSlug: draft.legacyPaidSlug.trim() || undefined,
    inputs: draft.inputs.map((input) => ({
      id: input.id.trim(),
      label: input.label.trim(),
      type: input.type,
      unit: input.unit.trim(),
      required: input.required,
      smartDefault: parseSmartDefault(input.type, input.smartDefault),
      validation: {
        min: parseOptionalNumber(input.min),
        max: parseOptionalNumber(input.max),
        step: parseOptionalNumber(input.step),
      },
      helper: input.helper.trim(),
      expertMeaning: input.expertMeaning.trim(),
    })),
    formulaPipeline: draft.formulaPipeline.map((step) => ({
      formulaId: step.formulaId.trim(),
      inputMap: Object.fromEntries(
        Object.entries(step.inputMap).map(([key, value]) => [key, value.trim()])
      ),
      outputId: step.outputId.trim(),
    })),
    outputs: draft.outputs.map((output) => ({
      id: output.id.trim(),
      label: output.label.trim(),
      unit: output.unit.trim(),
      format: output.format,
      isBigNumber: output.isBigNumber,
    })),
    thresholds: draft.thresholds.map((threshold) => ({
      fieldId: threshold.fieldId.trim(),
      warning: parseNumber(threshold.warning),
      critical: parseNumber(threshold.critical),
      direction: threshold.direction,
      warningMessage: threshold.warningMessage.trim(),
      criticalMessage: threshold.criticalMessage.trim(),
    })),
    reportTemplate: {
      title: draft.report.title.trim() || `${draft.name.trim()} Decision Report`,
      sections: draft.report.sections,
      exportFormats: draft.report.exportFormats,
    },
    assumptions: {
      hiddenLossMultiplier: parseNumber(draft.report.hiddenLossMultiplier, 1),
      volatilityPercent: parseNumber(draft.report.volatilityPercent, 15),
      targetMarginPercent: parseNumber(draft.report.targetMarginPercent, 12),
      assumptionNotes: draft.report.assumptionNotes.filter((note) => note.trim().length > 0),
    },
  };
}

export function draftToJson(draft: PremiumSchemaDraft, pretty = true): string {
  const schema = draftToPremiumSchema(draft);
  const payload = {
    draftMeta: {
      promise: draft.promise,
      legacyPaidSlug: draft.legacyPaidSlug,
      outputDescriptions: draft.outputs.map((output) => ({
        id: output.id,
        description: output.description,
      })),
    },
    schema,
  };
  return JSON.stringify(payload, null, pretty ? 2 : 0);
}

export function draftToTypeScriptExport(draft: PremiumSchemaDraft): string {
  const schema = draftToPremiumSchema(draft);
  if (!schema) {
    return "// Draft is invalid — fix validation errors before exporting TypeScript.";
  }

  const constName = schema.id
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/^./, (char) => char.toUpperCase());

  return `import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** Developer review required — not auto-published. */
export const ${constName}_SCHEMA: PremiumCalculatorSchema = ${JSON.stringify(schema, null, 2)};
`;
}

export function listReportSectionOptions(): readonly ReportSectionId[] {
  return ALL_REPORT_SECTIONS;
}

export function draftContainsExpressionKeys(draft: PremiumSchemaDraft): boolean {
  return hasForbiddenKeys(draft);
}
