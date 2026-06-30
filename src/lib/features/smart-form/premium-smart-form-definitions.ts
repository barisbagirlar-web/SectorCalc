import { buildSmartFormFieldSpecsFromContract } from "@/lib/features/formula-governance/runtime-validation/smart-form-contract-adapter";
import { listPremiumContractSlugs } from "@/lib/features/tools/premium-decision-engine";
import type {
  SmartFormDefinition,
  SmartFormMode,
  SmartInputKind,
  SmartInputRequirement,
} from "@/lib/features/smart-form/dynamic-form-types";
import { slugToSmartFormToolKey } from "@/lib/features/smart-form/dynamic-form-types";
import {
  PREMIUM_SMART_FORM_SCENARIO_CONFIG,
  type PremiumScenarioConfig,
} from "@/lib/features/smart-form/premium-smart-form-scenario-config";

function mapFieldKind(type: "number" | "currency" | "percent"): SmartInputKind {
  if (type === "currency") {
    return "currency";
  }
  if (type === "percent") {
    return "percentage";
  }
  return "number";
}

function inputDef(
  slug: string,
  key: string,
  kind: SmartInputKind,
  config: Omit<SmartInputRequirement, "key" | "labelKey" | "helpKey" | "kind">,
): SmartInputRequirement {
  const toolKey = slugToSmartFormToolKey(slug);
  return {
    key,
    labelKey: `tools.${toolKey}.inputs.${key}.label`,
    helpKey: `tools.${toolKey}.inputs.${key}.help`,
    kind,
    ...config,
  };
}

function resolveModeForField(
  slug: string,
  key: string,
  group: "required" | "optional" | "advanced",
  config: PremiumScenarioConfig,
): SmartFormMode {
  if (config.modeByKey?.[key]) {
    return config.modeByKey[key];
  }
  if (group === "advanced") {
    return "advanced";
  }
  return "simple";
}

function ensureSimpleAndAdvancedModes(
  inputs: SmartInputRequirement[],
): SmartInputRequirement[] {
  const hasSimple = inputs.some((input) => input.mode !== "advanced");
  const hasAdvanced = inputs.some((input) => input.mode === "advanced");
  if (hasSimple && hasAdvanced) {
    return inputs;
  }

  if (inputs.length === 0) {
    return inputs;
  }

  const optional = inputs.filter((input) => !input.required);
  const target = optional[optional.length - 1] ?? inputs[inputs.length - 1];
  return inputs.map((input) =>
    input.key === target.key ? { ...input, mode: "advanced" as const } : input,
  );
}

function buildDefinition(slug: string): SmartFormDefinition | null {
  const config = PREMIUM_SMART_FORM_SCENARIO_CONFIG[slug];
  if (!config) {
    return null;
  }

  const plan = buildSmartFormFieldSpecsFromContract(slug);
  if (!plan || plan.fields.length === 0) {
    return null;
  }

  const allKeys = plan.fields.map((field) => field.key);
  const toolKey = slugToSmartFormToolKey(slug);

  const inputsRaw = plan.fields.map((field) =>
    inputDef(slug, field.key, mapFieldKind(field.type), {
      required: field.required,
      unit: field.unit,
      min: field.min,
      max: field.max,
      mode: resolveModeForField(slug, field.key, field.group, config),
    }),
  );

  const inputs = ensureSimpleAndAdvancedModes(inputsRaw);

  const scenarios = config.scenarios.map((scenario) => ({
    id: scenario.id,
    labelKey: `tools.${toolKey}.scenarios.${scenario.id}.label`,
    descriptionKey: `tools.${toolKey}.scenarios.${scenario.id}.description`,
    inputKeys: scenario.inputKeys ?? allKeys,
  }));

  return {
    toolSlug: slug,
    defaultScenarioId: config.defaultScenarioId,
    scenarios,
    inputs,
  };
}

const EXPECTED_SLUGS = listPremiumContractSlugs();

const DEFINITIONS = Object.fromEntries(
  EXPECTED_SLUGS.map((slug) => [slug, buildDefinition(slug)]),
) as Record<string, SmartFormDefinition | null>;

export const PREMIUM_SMART_FORM_SLUGS = EXPECTED_SLUGS;

export type PremiumSmartFormSlug = (typeof PREMIUM_SMART_FORM_SLUGS)[number];

export function getPremiumSmartFormDefinition(slug: string): SmartFormDefinition | null {
  return DEFINITIONS[slug] ?? null;
}

export function hasPremiumSmartFormDefinition(slug: string): slug is PremiumSmartFormSlug {
  return slug in DEFINITIONS && DEFINITIONS[slug] !== null;
}

export function getPremiumSmartFormSlugs(): readonly PremiumSmartFormSlug[] {
  return PREMIUM_SMART_FORM_SLUGS.filter((slug) => DEFINITIONS[slug] !== null);
}

export function assertPremiumSmartFormCoverage(expectedSlugs: readonly string[]): void {
  const missing = expectedSlugs.filter((slug) => !hasPremiumSmartFormDefinition(slug));
  if (missing.length > 0) {
    throw new Error(`Missing premium smart form definitions: ${missing.join(", ")}`);
  }

  const extra = getPremiumSmartFormSlugs().filter((slug) => !expectedSlugs.includes(slug));
  if (extra.length > 0) {
    throw new Error(`Unexpected premium smart form definitions: ${extra.join(", ")}`);
  }
}

/** @deprecated Use getPremiumSmartFormDefinition */
export function getSmartFormDefinition(slug: string): SmartFormDefinition | null {
  return getPremiumSmartFormDefinition(slug);
}

export function getDefaultScenarioId(slug: string): string {
  return getPremiumSmartFormDefinition(slug)?.defaultScenarioId ?? "";
}
