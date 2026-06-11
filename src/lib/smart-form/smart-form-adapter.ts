/**
 * Smart Form adapter — maps existing tool metadata to engineering-grade form sections.
 * Does not mutate canonical keys or calculation payloads.
 */

import type { ToolInput } from "@/data/tool-schema";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  buildSmartFormFieldSpecsFromContract,
  type SmartFormContractFieldSpec,
} from "@/lib/formula-governance/runtime-validation/smart-form-contract-adapter";
import {
  isFreeFullLoopRuntimeSlug,
  isPremiumFullLoopRuntimeSlug,
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import type { PremiumInputSchema } from "@/lib/premium-schema/premium-calculator-schema";
import {
  buildSectionsFromInputs,
  groupInputsForSimpleView,
  inferInputGroup,
} from "@/lib/smart-form/input-grouping";
import type {
  SmartFormAdapterResult,
  SmartFormCalculationStep,
  SmartFormInput,
  SmartFormInputType,
  SmartFormSectionConfig,
} from "@/lib/smart-form/types";
import type { FreeTrafficInput } from "@/lib/tools/free-traffic-catalog";
import {
  readFreeToolUiString,
  resolveSmartFormDecisionGoal,
} from "@/lib/i18n/free-tool-form-i18n";
import type { RevenueToolInput } from "@/lib/tools/revenue-tools";

export type SmartFormExistingInputConfig =
  | { readonly kind: "revenue"; readonly inputs: readonly RevenueToolInput[] }
  | { readonly kind: "traffic"; readonly inputs: readonly FreeTrafficInput[] }
  | { readonly kind: "schema"; readonly inputs: readonly PremiumInputSchema[] }
  | { readonly kind: "tool-definition"; readonly inputs: readonly ToolInput[] };

export function preserveCanonicalInputName(input: { readonly key: string }): string {
  return input.key;
}

export function inferInputUnit(inputName: string, explicit?: string): string | undefined {
  if (explicit) {
    return explicit;
  }
  const normalized = inputName.toLowerCase();
  if (normalized.includes("percent") || normalized.includes("margin") || normalized.endsWith("rate")) {
    return "%";
  }
  if (normalized.includes("hour")) {
    return "hr";
  }
  if (normalized.includes("day")) {
    return "days";
  }
  if (normalized.includes("sqm") || normalized.includes("area")) {
    return "m²";
  }
  return undefined;
}

export function inferInputHelp(
  inputName: string,
  toolSlug: string,
): Pick<SmartFormInput, "helpWhy" | "helpTypical" | "helpExample"> {
  const label = inputName.replace(/([A-Z])/g, " $1").trim();
  return {
    helpWhy: `Required for ${toolSlug} contract path and loss exposure.`,
    helpTypical: `Enter a realistic ${label.toLowerCase()} from recent jobs.`,
    helpExample: `Example: use your last verified ${label.toLowerCase()} before rounding.`,
  };
}

function mapContractField(field: SmartFormContractFieldSpec, toolSlug: string): SmartFormInput {
  const help = inferInputHelp(field.key, toolSlug);
  return {
    key: field.key,
    canonicalKey: field.canonicalKey,
    label: field.label,
    type: field.type,
    unit: field.unit,
    required: field.required,
    min: field.min,
    max: field.max,
    step: field.step,
    placeholder: field.placeholder,
    helperText: field.helperText ?? field.validationHint,
    group: field.group === "advanced" ? "advanced" : inferInputGroup(field.key, toolSlug),
    ...help,
  };
}

function mapRevenueInput(input: RevenueToolInput, toolSlug: string): SmartFormInput {
  const help = inferInputHelp(input.key, toolSlug);
  return {
    key: input.key,
    canonicalKey: input.key,
    label: input.label,
    type: input.type,
    unit: inferInputUnit(input.key, input.unit),
    required: input.required,
    helperText: input.helperText,
    group: inferInputGroup(input.key, toolSlug),
    options: input.options,
    defaultValue: input.defaultValue,
    ...help,
  };
}

function mapTrafficInput(input: FreeTrafficInput, toolSlug: string): SmartFormInput {
  const help = inferInputHelp(input.key, toolSlug);
  const type: SmartFormInputType = input.type === "select" ? "select" : "number";

  return {
    key: input.key,
    canonicalKey: input.key,
    label: input.label,
    type,
    unit: inferInputUnit(input.key, input.unit),
    required: true,
    min: input.min,
    max: input.max,
    helperText: input.helper,
    group: inferInputGroup(input.key, toolSlug),
    options: input.options,
    defaultValue: input.defaultValue,
    ...help,
  };
}

function mapSchemaInput(input: PremiumInputSchema, toolSlug: string): SmartFormInput {
  const help = inferInputHelp(input.id, toolSlug);
  const type: SmartFormInputType =
    input.type === "select"
      ? "select"
      : input.type === "boolean"
        ? "text"
        : "number";

  const defaultValue =
    typeof input.smartDefault === "boolean"
      ? undefined
      : input.smartDefault;

  return {
    key: input.id,
    canonicalKey: input.id,
    label: input.label,
    type,
    unit: inferInputUnit(input.id, input.unit),
    required: input.required,
    min: input.validation?.min,
    max: input.validation?.max,
    helperText: input.helper,
    group: inferInputGroup(input.id, toolSlug),
    defaultValue,
    helpWhy: input.expertMeaning ?? help.helpWhy,
    helpTypical: help.helpTypical,
    helpExample: help.helpExample,
  };
}

function mapToolDefinitionInput(input: ToolInput, toolSlug: string): SmartFormInput {
  const help = inferInputHelp(input.id, toolSlug);
  const type: SmartFormInputType = input.currency
    ? "currency"
    : input.type === "select"
      ? "select"
      : "number";

  return {
    key: input.id,
    canonicalKey: input.id,
    label: input.label,
    type,
    unit: inferInputUnit(input.id, input.unit),
    required: input.required ?? true,
    min: input.min,
    max: input.max,
    step: input.step,
    helperText: input.helperText,
    group: inferInputGroup(input.id, toolSlug),
    defaultValue: input.defaultValue,
    ...help,
  };
}

function buildCalculationStepsFromContract(
  slug: string,
  locale?: string,
): SmartFormCalculationStep[] {
  const contractSlug = isPremiumFullLoopRuntimeSlug(slug)
    ? resolveFullLoopContractSlug(slug)
    : slug;
  const contract = getFormulaContractBySlug(contractSlug);
  if (!contract) {
    return [];
  }

  const decisionGoal = locale
    ? resolveSmartFormDecisionGoal(slug, locale, contract.userDecision)
    : contract.userDecision;
  const decisionGoalLabel =
    (locale ? readFreeToolUiString(locale, "calculationStepDecisionGoal") : undefined) ??
    "Decision goal";
  const formulaSummaryLabel =
    (locale ? readFreeToolUiString(locale, "calculationStepFormulaSummary") : undefined) ??
    "Formula summary";

  return [
    {
      id: "contract-purpose",
      label: decisionGoalLabel,
      description: decisionGoal,
    },
    {
      id: "contract-formula",
      label: formulaSummaryLabel,
      formulaText: contract.formulaSummary,
    },
    ...contract.validationRules.slice(0, 4).map((rule) => ({
      id: rule.id,
      label: rule.id,
      description: rule.description,
    })),
  ];
}

function splitSections(
  inputs: readonly SmartFormInput[],
): { simpleSections: SmartFormSectionConfig[]; expertSections: SmartFormSectionConfig[] } {
  const { simple, expert } = groupInputsForSimpleView(inputs);
  return {
    simpleSections: buildSectionsFromInputs(simple),
    expertSections: buildSectionsFromInputs(expert),
  };
}

function successResult(
  slug: string,
  source: "contract" | "revenue" | "traffic" | "schema" | "tool-definition",
  inputs: readonly SmartFormInput[],
  decisionGoal?: string,
  locale?: string,
): SmartFormAdapterResult {
  if (inputs.length === 0) {
    return { ok: false, slug, reason: "No inputs resolved for adapter." };
  }

  const { simpleSections, expertSections } = splitSections(inputs);
  return {
    ok: true,
    slug,
    source,
    simpleSections,
    expertSections,
    allInputs: inputs,
    decisionGoal,
    calculationSteps: buildCalculationStepsFromContract(slug, locale),
  };
}

export function buildSmartFormForTool(
  toolSlug: string,
  existingInputConfig?: SmartFormExistingInputConfig,
  locale?: string,
): SmartFormAdapterResult {
  try {
    const contractSlug = isPremiumFullLoopRuntimeSlug(toolSlug)
      ? resolveFullLoopContractSlug(toolSlug)
      : toolSlug;

    const contractPlan = buildSmartFormFieldSpecsFromContract(contractSlug, locale);
    if (contractPlan && (isFreeFullLoopRuntimeSlug(toolSlug) || isPremiumFullLoopRuntimeSlug(toolSlug))) {
      const inputs = contractPlan.fields.map((field) => mapContractField(field, toolSlug));
      return successResult(toolSlug, "contract", inputs, contractPlan.decisionGoal, locale);
    }

    if (!existingInputConfig) {
      return { ok: false, slug: toolSlug, reason: "No input config supplied." };
    }

    switch (existingInputConfig.kind) {
      case "revenue": {
        const inputs = existingInputConfig.inputs.map((input) => mapRevenueInput(input, toolSlug));
        return successResult(toolSlug, "revenue", inputs, undefined, locale);
      }
      case "traffic": {
        const inputs = existingInputConfig.inputs.map((input) => mapTrafficInput(input, toolSlug));
        return successResult(toolSlug, "traffic", inputs, undefined, locale);
      }
      case "schema": {
        const inputs = existingInputConfig.inputs.map((input) => mapSchemaInput(input, toolSlug));
        return successResult(toolSlug, "schema", inputs, undefined, locale);
      }
      case "tool-definition": {
        const inputs = existingInputConfig.inputs.map((input) =>
          mapToolDefinitionInput(input, toolSlug),
        );
        return successResult(toolSlug, "tool-definition", inputs, undefined, locale);
      }
      default:
        return { ok: false, slug: toolSlug, reason: "Unsupported input config kind." };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, slug: toolSlug, reason: message };
  }
}
