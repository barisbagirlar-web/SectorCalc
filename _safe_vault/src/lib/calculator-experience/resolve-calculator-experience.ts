import type {
  CalculatorExperienceContract,
  CalculatorExperienceField,
  CalculatorExperienceMode,
  CalculatorFieldMode,
} from "@/lib/calculator-experience/calculator-experience-types";

const OEE_TOOL_SLUGS = new Set(["cnc-oee-loss", "oee-calculator"]);

const OEE_QUICK_FIELD_MODES: Readonly<Record<string, CalculatorFieldMode>> = {
  availability: "both",
  performance: "both",
  quality: "both",
  machineRate: "expert",
  plannedHours: "expert",
  downtimeHours: "expert",
  materialCost: "expert",
  scrapRate: "expert",
  quotedPrice: "expert",
  idealCycleTime: "expert",
  totalProduction: "expert",
  goodParts: "expert",
  runHours: "expert",
};

function resolveFieldMode(field: CalculatorExperienceField): CalculatorFieldMode {
  if (field.advanced || field.mode === "expert") {
    return "expert";
  }
  return "both";
}

function resolveOeeFieldModes(fields: readonly CalculatorExperienceField[]): Record<string, CalculatorFieldMode> {
  const modes: Record<string, CalculatorFieldMode> = { ...OEE_QUICK_FIELD_MODES };
  for (const field of fields) {
    if (!(field.key in modes)) {
      modes[field.key] = "expert";
    }
    if (field.key === "availability" || field.key === "performance" || field.key === "quality") {
      modes[field.key] = "both";
    } else if (!(field.key in OEE_QUICK_FIELD_MODES)) {
      modes[field.key] = "expert";
    }
  }
  return modes;
}

function resolveLayout(archetype?: string): CalculatorExperienceContract["layout"] {
  if (archetype === "cost-margin" || archetype === "finance-hr") {
    return "financial-premium";
  }
  if (archetype === "production-operations" || archetype === "energy-loss") {
    return "technical-premium";
  }
  return "compact-premium";
}

export function resolveCalculatorExperience(input: {
  readonly toolSlug: string;
  readonly fields: readonly CalculatorExperienceField[];
  readonly category?: string;
  readonly archetype?: string;
}): CalculatorExperienceContract {
  const fieldModes =
    OEE_TOOL_SLUGS.has(input.toolSlug)
      ? resolveOeeFieldModes(input.fields)
      : Object.fromEntries(input.fields.map((field) => [field.key, resolveFieldMode(field)]));

  const hasExpertMode = Object.values(fieldModes).some((mode) => mode === "expert");

  return {
    toolSlug: input.toolSlug,
    hasExpertMode,
    defaultMode: "quick",
    resultSummaryVisibleOnlyAfterCalculation: true,
    guidanceRequired: true,
    layout: resolveLayout(input.archetype),
    fieldModes,
  };
}

export function filterVisibleCalculatorFields<T extends { key: string; required?: boolean }>(
  fields: readonly T[],
  experience: CalculatorExperienceContract,
  mode: CalculatorExperienceMode,
): readonly T[] {
  if (!experience.hasExpertMode) {
    return fields;
  }

  if (mode === "expert") {
    return fields;
  }

  return fields.filter((field) => {
    const fieldMode = experience.fieldModes[field.key] ?? "both";
    return fieldMode === "both";
  });
}

export function buildPremiumSchemaExperienceFields(
  inputs: ReadonlyArray<{ id: string; required: boolean }>,
): CalculatorExperienceField[] {
  return inputs.map((input) => ({
    key: input.id,
    required: input.required,
    advanced: !input.required,
  }));
}
