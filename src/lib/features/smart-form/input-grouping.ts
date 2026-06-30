/**
 * Smart Form input grouping — heuristic section assignment by canonical key.
 */

import type { SmartFormGroupId, SmartFormInput } from "@/lib/features/smart-form/types";
import { SMART_FORM_GROUP_LABELS } from "@/lib/features/smart-form/types";

const GROUP_KEYWORDS: Readonly<Record<SmartFormGroupId, readonly string[]>> = {
  general: [],
  "material-geometry": [
    "material",
    "area",
    "size",
    "sqm",
    "sqft",
    "length",
    "width",
    "depth",
    "volume",
    "weight",
    "geometry",
    "thickness",
  ],
  "time-labor": [
    "hour",
    "time",
    "labor",
    "crew",
    "delay",
    "setup",
    "cycle",
    "visit",
    "frequency",
    "duration",
    "shift",
  ],
  "cost-margin": [
    "cost",
    "price",
    "budget",
    "margin",
    "rate",
    "fee",
    "rent",
    "overhead",
    "supply",
    "fuel",
  ],
  "quantity-output": [
    "quantity",
    "output",
    "yield",
    "count",
    "units",
    "production",
    "batch",
    "order",
    "volume",
  ],
  "risk-conditions": [
    "risk",
    "waste",
    "scrap",
    "tolerance",
    "weather",
    "pressure",
    "percent",
    "variance",
    "loss",
  ],
  advanced: [],
};

export function inferInputGroup(key: string, toolSlug?: string): SmartFormGroupId {
  const normalized = `${toolSlug ?? ""} ${key}`.toLowerCase();

  for (const [group, keywords] of Object.entries(GROUP_KEYWORDS) as [
    SmartFormGroupId,
    readonly string[],
  ][]) {
    if (group === "advanced") {
      continue;
    }
    if (keywords.some((word) => normalized.includes(word))) {
      return group;
    }
  }

  return "advanced";
}

export function groupInputsForSimpleView(
  inputs: readonly SmartFormInput[],
): { simple: SmartFormInput[]; expert: SmartFormInput[] } {
  const required = inputs.filter((input) => input.required);
  const optional = inputs.filter((input) => !input.required);

  const simpleKeys = new Set<string>();
  const simple: SmartFormInput[] = [];

  for (const input of required) {
    if (simple.length >= 6) {
      break;
    }
    simple.push(input);
    simpleKeys.add(input.key);
  }

  for (const input of optional) {
    if (simple.length >= 6) {
      break;
    }
    if (!simpleKeys.has(input.key)) {
      simple.push(input);
      simpleKeys.add(input.key);
    }
  }

  const expert = inputs.filter((input) => !simpleKeys.has(input.key));
  return { simple, expert };
}

export function buildSectionsFromInputs(
  inputs: readonly SmartFormInput[],
): import("@/lib/features/smart-form/types").SmartFormSectionConfig[] {
  if (inputs.length <= 5) {
    const generalInputs = inputs.map(input => ({
      ...input,
      group: "general" as SmartFormGroupId,
    }));
    return [
      {
        id: "general",
        title: SMART_FORM_GROUP_LABELS.general,
        description: sectionDescription("general"),
        inputs: generalInputs,
      },
    ];
  }

  const byGroup = new Map<SmartFormGroupId, SmartFormInput[]>();

  for (const input of inputs) {
    const list = byGroup.get(input.group) ?? [];
    list.push(input);
    byGroup.set(input.group, list);
  }

  const order: SmartFormGroupId[] = [
    "material-geometry",
    "time-labor",
    "cost-margin",
    "quantity-output",
    "risk-conditions",
    "advanced",
  ];

  return order
    .filter((group) => (byGroup.get(group)?.length ?? 0) > 0)
    .map((group) => ({
      id: group,
      title: SMART_FORM_GROUP_LABELS[group],
      description: sectionDescription(group),
      inputs: byGroup.get(group) ?? [],
    }));
}

function sectionDescription(group: SmartFormGroupId): string {
  switch (group) {
    case "general":
      return "Configure the parameters below to run the calculation.";
    case "material-geometry":
      return "Physical scope, dimensions and material drivers.";
    case "time-labor":
      return "Labor hours, crew load and schedule exposure.";
    case "cost-margin":
      return "Cost stack, pricing targets and margin guards.";
    case "quantity-output":
      return "Throughput, batch size and output assumptions.";
    case "risk-conditions":
      return "Risk bands, variance and operating conditions.";
    case "advanced":
      return "Professional depth overrides and secondary drivers.";
    default:
      return "Additional parameters.";
  }
}

export function groupInputsForExpertView(inputs: readonly SmartFormInput[]): SmartFormInput[] {
  return inputs.filter((input) => input.group === "advanced" || !input.required);
}
