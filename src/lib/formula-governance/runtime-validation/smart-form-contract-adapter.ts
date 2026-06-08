/**
 * Contract-driven smart form field specs — ADIM 2 runtime validation bridge.
 */

import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { getControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  humanizeFieldKey,
  inferFieldDimension,
} from "@/lib/formula-governance/smart-form-architecture/form-field-helpers";
import {
  isPremiumFullLoopRuntimeSlug,
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import { resolveFieldUnitMetadata } from "@/lib/units/canonical-unit-normalizer";
import type { UnitSystem } from "@/lib/units/unit-definitions";

export type SmartFormContractFieldType = "number" | "currency" | "percent";

export type SmartFormContractFieldGroup = "required" | "optional" | "advanced";

export type SmartFormContractFieldSpec = {
  readonly key: string;
  readonly canonicalKey: string;
  readonly label: string;
  readonly type: SmartFormContractFieldType;
  readonly unit?: string;
  readonly canonicalUnit?: string;
  readonly displayUnit?: string;
  readonly unitSystem?: UnitSystem;
  readonly required: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly placeholder?: string;
  readonly helperText?: string;
  readonly group: SmartFormContractFieldGroup;
  readonly defaultValue?: number | string;
  readonly validationHint?: string;
};

export type SmartFormContractFieldPlan = {
  readonly slug: string;
  readonly contractSlug: string;
  readonly decisionGoal: string;
  readonly fields: readonly SmartFormContractFieldSpec[];
  readonly assumptions: readonly string[];
  readonly validationRules: readonly { readonly id: string; readonly description: string }[];
};

export type SmartFormRawValues = Record<string, number | string>;

function resolveSmartFormContractSlug(slug: string): string {
  if (isPremiumFullLoopRuntimeSlug(slug)) {
    return resolveFullLoopContractSlug(slug);
  }
  return slug;
}

function resolveFieldType(
  key: string,
  dimension: string,
): SmartFormContractFieldType {
  if (dimension === "percent") {
    return "percent";
  }
  if (dimension === "currency") {
    return "currency";
  }
  const normalized = key.toLowerCase();
  if (
    normalized.includes("cost") ||
    normalized.includes("price") ||
    normalized.includes("budget") ||
    normalized.includes("rent") ||
    normalized.includes("fee")
  ) {
    return "currency";
  }
  if (normalized.includes("percent") || normalized.includes("margin") || normalized.includes("rate")) {
    return "percent";
  }
  return "number";
}

function inferFieldBounds(
  key: string,
  dimension: string,
  contract: FormulaContract,
): Pick<SmartFormContractFieldSpec, "min" | "max" | "step"> {
  const normalized = key.toLowerCase();

  if (dimension === "percent" || normalized.includes("percent")) {
    return { min: 0, max: 100, step: 0.1 };
  }

  if (normalized.includes("comparisonyears") || normalized === "comparisonyears") {
    return { min: 1, max: 40, step: 1 };
  }

  if (normalized.includes("quantity") || normalized.includes("visits")) {
    return { min: 1, step: 1 };
  }

  if (normalized.includes("hours") || normalized.includes("time")) {
    return { min: 0, step: 0.1 };
  }

  for (const rule of contract.validationRules) {
    if (rule.id === "years-range" && normalized.includes("year")) {
      return { min: 1, max: 40, step: 1 };
    }
    if (rule.id === "percent-bounds" && (dimension === "percent" || normalized.includes("percent"))) {
      return { min: 0, max: 100, step: 0.1 };
    }
  }

  if (dimension === "currency" || resolveFieldType(key, dimension) === "currency") {
    return { min: 0, step: 0.01 };
  }

  return { min: 0, step: 0.01 };
}

function findValidationHint(key: string, contract: FormulaContract): string | undefined {
  const normalized = key.toLowerCase();
  for (const rule of contract.validationRules) {
    const ruleText = rule.description.toLowerCase();
    if (ruleText.includes(normalized) || ruleText.includes(key)) {
      return rule.description;
    }
  }
  return undefined;
}

function findHelperText(
  key: string,
  patch: ReturnType<typeof getControlledInputDesignPatch>,
): string | undefined {
  if (!patch) {
    return undefined;
  }
  if (patch.advancedInputs.includes(key)) {
    return patch.professionalDepthNotes[0];
  }
  if (patch.optionalInputs.includes(key)) {
    return patch.userBurdenNotes[0];
  }
  return undefined;
}

function buildFieldSpec(
  key: string,
  group: SmartFormContractFieldGroup,
  required: boolean,
  contract: FormulaContract,
  patch: ReturnType<typeof getControlledInputDesignPatch>,
  locale?: string,
): SmartFormContractFieldSpec {
  const dimensionMeta = inferFieldDimension(key);
  const type = resolveFieldType(key, dimensionMeta.dimension);
  const bounds = inferFieldBounds(key, dimensionMeta.dimension, contract);
  const baseUnit =
    dimensionMeta.unit !== "value" && dimensionMeta.unit !== "USD"
      ? dimensionMeta.unit
      : type === "currency"
        ? "USD"
        : type === "percent"
          ? "%"
          : undefined;

  const unitMetadata = locale
    ? resolveFieldUnitMetadata(key, baseUnit, dimensionMeta.dimension, locale)
    : null;

  const unit = unitMetadata?.displayUnit ?? baseUnit;

  return {
    key,
    canonicalKey: key,
    label: humanizeFieldKey(key),
    type,
    unit,
    canonicalUnit: unitMetadata?.canonicalUnit,
    displayUnit: unitMetadata?.displayUnit,
    unitSystem: unitMetadata?.unitSystem,
    required,
    ...bounds,
    placeholder: `Enter ${humanizeFieldKey(key).toLowerCase()}`,
    helperText: findHelperText(key, patch),
    group,
    validationHint: findValidationHint(key, contract),
  };
}

function collectContractInputKeys(contract: FormulaContract): readonly string[] {
  const keys = new Set<string>([...contract.requiredInputs, ...contract.criticalInputs]);
  return [...keys].sort((left, right) => left.localeCompare(right));
}

export function buildSmartFormFieldSpecsFromContract(
  slug: string,
  locale?: string,
): SmartFormContractFieldPlan | null {
  const contractSlug = resolveSmartFormContractSlug(slug);
  const contract = getFormulaContractBySlug(contractSlug);
  if (!contract) {
    return null;
  }

  const patch = getControlledInputDesignPatch(contractSlug) ?? getControlledInputDesignPatch(slug);
  const fields: SmartFormContractFieldSpec[] = [];
  const seen = new Set<string>();

  const addField = (
    key: string,
    group: SmartFormContractFieldGroup,
    required: boolean,
  ) => {
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    fields.push(buildFieldSpec(key, group, required, contract, patch, locale));
  };

  if (patch) {
    for (const key of patch.requiredInputs) {
      addField(key, "required", true);
    }
    for (const key of patch.optionalInputs) {
      addField(key, "optional", false);
    }
    for (const key of patch.advancedInputs) {
      addField(key, "advanced", false);
    }
    for (const key of collectContractInputKeys(contract)) {
      if (!seen.has(key)) {
        addField(key, "required", true);
      }
    }
  } else {
    for (const key of collectContractInputKeys(contract)) {
      addField(key, "required", true);
    }
  }

  return {
    slug,
    contractSlug,
    decisionGoal: contract.userDecision,
    fields,
    assumptions: contract.assumptions.slice(0, 4),
    validationRules: contract.validationRules.map((rule) => ({
      id: rule.id,
      description: rule.description,
    })),
  };
}

export function buildSmartFormInitialValues(slug: string): SmartFormRawValues {
  const plan = buildSmartFormFieldSpecsFromContract(slug);
  if (!plan) {
    return {};
  }

  const values: SmartFormRawValues = {};
  for (const field of plan.fields) {
    if (field.defaultValue !== undefined) {
      values[field.key] = field.defaultValue;
      continue;
    }
    values[field.key] = field.type === "number" || field.type === "currency" || field.type === "percent" ? "" : "";
  }
  return values;
}

export function validateSmartFormFieldValues(
  slug: string,
  values: SmartFormRawValues,
): Record<string, string> {
  const plan = buildSmartFormFieldSpecsFromContract(slug);
  if (!plan) {
    return { _form: "Smart form contract not found." };
  }

  const errors: Record<string, string> = {};

  for (const field of plan.fields) {
    const raw = values[field.key];
    if (field.required) {
      if (raw === undefined || raw === "") {
        errors[field.key] = `${field.label} is required.`;
        continue;
      }
    } else if (raw === undefined || raw === "") {
      continue;
    }

    const numeric = typeof raw === "number" ? raw : Number(String(raw).trim());
    if (!Number.isFinite(numeric)) {
      errors[field.key] = `${field.label} must be a valid number.`;
      continue;
    }
    if (field.min !== undefined && numeric < field.min) {
      errors[field.key] = `${field.label} must be at least ${field.min}.`;
    }
    if (field.max !== undefined && numeric > field.max) {
      errors[field.key] = `${field.label} must be at most ${field.max}.`;
    }
  }

  return errors;
}

export function getSmartFormEditableFieldKeys(slug: string): readonly string[] {
  const plan = buildSmartFormFieldSpecsFromContract(slug);
  return plan?.fields.map((field) => field.key) ?? [];
}

export function getSmartToolFormFieldCount(slug: string): number {
  return buildSmartFormFieldSpecsFromContract(slug)?.fields.length ?? 0;
}
