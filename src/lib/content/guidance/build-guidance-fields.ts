import type { ReferenceGraphicField } from "@/lib/content/guidance/reference-graphic-types";
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
import type { FreeTrafficTool } from "@/lib/features/tools/free-traffic-catalog";
import type { RevenueToolInput } from "@/lib/features/tools/revenue-tools";

type SmartFormExistingInputConfig =
  | { readonly kind: "traffic"; readonly inputs: FreeTrafficTool["inputs"] }
  | { readonly kind: "revenue"; readonly inputs: readonly RevenueToolInput[] }
  | { readonly kind: "premium"; readonly schema: PremiumCalculatorSchema };

function fromRevenueInputs(inputs: readonly RevenueToolInput[]): ReferenceGraphicField[] {
  return inputs.map((input) => ({
    key: input.key,
    label: input.label,
    type: input.type,
    unitGroup: input.unit?.includes("USD") || input.unit?.includes("EUR") || input.unit?.includes("TRY")
      ? "currency"
      : input.unit,
  }));
}

export function buildGuidanceFieldsFromInputConfig(
  config: SmartFormExistingInputConfig | undefined,
): ReferenceGraphicField[] {
  if (!config) {
    return [];
  }
  if (config.kind === "traffic") {
    return config.inputs.map((input) => ({
      key: input.key,
      label: input.label,
      type: input.type,
      unitGroup: input.unit,
    }));
  }
  if (config.kind === "revenue") {
    return fromRevenueInputs(config.inputs);
  }
  if (config.kind === "premium") {
    return config.schema.inputs.map((input) => ({
      key: input.id,
      label: input.label,
      type: input.type,
      unitGroup: input.unit,
    }));
  }
  return [];
}

export function buildGuidanceFieldsFromTrafficTool(tool: FreeTrafficTool): ReferenceGraphicField[] {
  return tool.inputs.map((input) => ({
    key: input.key,
    label: input.label,
    type: input.type,
    unitGroup: input.unit,
  }));
}

export function buildGuidanceFieldsFromSchema(schema: PremiumCalculatorSchema): ReferenceGraphicField[] {
  return schema.inputs.map((input) => ({
    key: input.id,
    label: input.label,
    type: input.type,
    unitGroup: input.unit,
  }));
}

export function buildGuidanceFieldsFromKeys(
  fields: ReadonlyArray<{ key: string; label?: string; unit?: string; type?: string }>,
): ReferenceGraphicField[] {
  return fields.map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    unitGroup: field.unit,
  }));
}
