import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import type {
  SmartFormDefinition,
  SmartFormMode,
  SmartFormValidationResult,
} from "@/lib/smart-form/dynamic-form-types";
import {
  getPremiumSmartFormDefinition,
  getPremiumSmartFormSlugs,
  hasPremiumSmartFormDefinition,
} from "@/lib/smart-form/premium-smart-form-definitions";
import { getRequiredInputs, getVisibleInputs } from "@/lib/smart-form/requirements";
import { validateSmartForm } from "@/lib/smart-form/validation";
import { listPremiumContractSlugs } from "@/lib/tools/premium-decision-engine";

export type RuntimeCompatibilityResult = {
  readonly ok: boolean;
  readonly missing: readonly string[];
  readonly hiddenRequired: readonly string[];
  readonly invalid: SmartFormValidationResult["invalid"];
  readonly rejectedKeys: readonly string[];
  readonly messageKey?: string;
};

export type CanonicalRuntimeInputsResult =
  | {
      readonly ok: true;
      readonly canonical: Record<string, number | string | boolean>;
      readonly rejectedKeys: readonly string[];
    }
  | {
      readonly ok: false;
      readonly canonical: Record<string, never>;
      readonly rejectedKeys: readonly string[];
      readonly compatibility: RuntimeCompatibilityResult;
    };

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

function isInvalidNumeric(value: unknown): boolean {
  if (typeof value === "number") {
    return !Number.isFinite(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return true;
    }
    const numeric = Number(trimmed);
    return !Number.isFinite(numeric);
  }
  return false;
}

export function getFormulaContractInputKeys(toolSlug: string): readonly string[] {
  const contractSlug = resolveFullLoopContractSlug(toolSlug);
  const contract = getFormulaContractBySlug(contractSlug);
  if (!contract) {
    return [];
  }
  return [...new Set([...contract.requiredInputs, ...contract.criticalInputs])].sort((left, right) =>
    left.localeCompare(right),
  );
}

export function getSmartFormInputKeys(toolSlug: string): readonly string[] {
  const definition = getPremiumSmartFormDefinition(toolSlug);
  return definition?.inputs.map((input) => input.key) ?? [];
}

function getHiddenContractRequiredKeys(
  definition: SmartFormDefinition,
  values: Record<string, unknown>,
  mode: SmartFormMode,
  scenarioId: string,
): string[] {
  if (mode === "advanced") {
    return [];
  }

  const contractRequired = new Set(getFormulaContractInputKeys(definition.toolSlug));
  const visibleKeys = new Set(
    getVisibleInputs(definition, values, mode, scenarioId).map((input) => input.key),
  );

  return [...contractRequired].filter((key) => !visibleKeys.has(key));
}

export function validateSmartFormRuntimeCompatibility(
  toolSlug: string,
  definition: SmartFormDefinition,
  values: Record<string, unknown>,
  mode: SmartFormMode,
  scenarioId: string,
): RuntimeCompatibilityResult {
  const contractKeys = getFormulaContractInputKeys(toolSlug);
  const formKeys = new Set(getSmartFormInputKeys(toolSlug));
  const missingContractFields = contractKeys.filter((key) => !formKeys.has(key));

  if (missingContractFields.length > 0) {
    return {
      ok: false,
      missing: [],
      hiddenRequired: [],
      invalid: [],
      rejectedKeys: missingContractFields,
      messageKey: "compatibility.missingContractField",
    };
  }

  const hiddenRequired = getHiddenContractRequiredKeys(definition, values, mode, scenarioId);
  if (hiddenRequired.length > 0) {
    return {
      ok: false,
      missing: [],
      hiddenRequired,
      invalid: [],
      rejectedKeys: hiddenRequired,
      messageKey: "compatibility.hiddenRequiredSimple",
    };
  }

  const validation = validateSmartForm(definition, values, mode, scenarioId);
  const required = getRequiredInputs(definition, values, mode, scenarioId);
  const missing = validation.missing.filter((key) => required.some((input) => input.key === key));

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      hiddenRequired: [],
      invalid: validation.invalid,
      rejectedKeys: missing,
      messageKey: "compatibility.missingRequired",
    };
  }

  if (validation.invalid.length > 0) {
    return {
      ok: false,
      missing: [],
      hiddenRequired: [],
      invalid: validation.invalid,
      rejectedKeys: validation.invalid.map((item) => item.key),
      messageKey: "compatibility.invalidInput",
    };
  }

  return {
    ok: true,
    missing: [],
    hiddenRequired: [],
    invalid: [],
    rejectedKeys: [],
  };
}

export function buildCanonicalRuntimeInputs(
  toolSlug: string,
  definition: SmartFormDefinition,
  values: Record<string, unknown>,
  mode: SmartFormMode,
  scenarioId: string,
): CanonicalRuntimeInputsResult {
  const compatibility = validateSmartFormRuntimeCompatibility(
    toolSlug,
    definition,
    values,
    mode,
    scenarioId,
  );

  if (!compatibility.ok) {
    return {
      ok: false,
      canonical: {},
      rejectedKeys: compatibility.rejectedKeys,
      compatibility,
    };
  }

  const validation = validateSmartForm(definition, values, mode, scenarioId);
  const allowedKeys = new Set(getFormulaContractInputKeys(toolSlug));
  const canonical: Record<string, number | string | boolean> = {};
  const rejectedKeys: string[] = [];

  for (const [key, rawValue] of Object.entries(validation.normalizedValues)) {
    if (!allowedKeys.has(key)) {
      rejectedKeys.push(key);
      continue;
    }
    if (isEmptyValue(rawValue) || isInvalidNumeric(rawValue)) {
      rejectedKeys.push(key);
      continue;
    }
    if (typeof rawValue === "boolean" || typeof rawValue === "string") {
      canonical[key] = rawValue;
      continue;
    }
    if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      canonical[key] = rawValue;
      continue;
    }
    const numeric = Number(String(rawValue).trim());
    if (Number.isFinite(numeric)) {
      canonical[key] = numeric;
      continue;
    }
    rejectedKeys.push(key);
  }

  for (const key of getFormulaContractInputKeys(toolSlug)) {
    const input = definition.inputs.find((candidate) => candidate.key === key);
    const isRequired =
      input?.required ||
      getRequiredInputs(definition, values, mode, scenarioId).some((candidate) => candidate.key === key);
    if (isRequired && !(key in canonical)) {
      return {
        ok: false,
        canonical: {},
        rejectedKeys: [key, ...rejectedKeys],
        compatibility: {
          ok: false,
          missing: [key],
          hiddenRequired: [],
          invalid: [],
          rejectedKeys: [key],
          messageKey: "compatibility.missingRequired",
        },
      };
    }
  }

  return {
    ok: true,
    canonical,
    rejectedKeys,
  };
}

export function assertAllPremiumSmartFormsRuntimeCompatible(): void {
  const errors: string[] = [];

  for (const slug of getPremiumSmartFormSlugs()) {
    if (!hasPremiumSmartFormDefinition(slug)) {
      errors.push(`${slug}: missing smart form definition`);
      continue;
    }

    const definition = getPremiumSmartFormDefinition(slug);
    if (!definition) {
      errors.push(`${slug}: null definition`);
      continue;
    }

    const contractKeys = getFormulaContractInputKeys(slug);
    const formKeys = new Set(getSmartFormInputKeys(slug));
    for (const key of contractKeys) {
      if (!formKeys.has(key)) {
        errors.push(`${slug}: contract key "${key}" missing from smart form`);
      }
    }

    if (definition.scenarios.length < 2) {
      errors.push(`${slug}: fewer than 2 scenarios`);
    }

    const hasRequired = definition.inputs.some((input) => input.required);
    if (!hasRequired) {
      errors.push(`${slug}: no required inputs`);
    }

    const hasSimple = definition.inputs.some((input) => input.mode !== "advanced");
    const hasAdvanced = definition.inputs.some((input) => input.mode === "advanced");
    if (!hasSimple || !hasAdvanced) {
      errors.push(`${slug}: missing simple or advanced field modes`);
    }
  }

  assertPremiumSmartFormCoverage(listPremiumContractSlugs());

  if (errors.length > 0) {
    throw new Error(`Premium smart form runtime compatibility failed:\n${errors.join("\n")}`);
  }
}

function assertPremiumSmartFormCoverage(expectedSlugs: readonly string[]): void {
  const missing = expectedSlugs.filter((slug) => !hasPremiumSmartFormDefinition(slug));
  if (missing.length > 0) {
    throw new Error(`Missing premium smart form coverage: ${missing.join(", ")}`);
  }
}
