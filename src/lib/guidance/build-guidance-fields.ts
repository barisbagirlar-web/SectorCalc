import type { ReferenceGraphicField } from "@/lib/guidance/reference-graphic-types";
import type { SmartFormExistingInputConfig } from "@/lib/smart-form/smart-form-adapter";
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import type { FreeTrafficTool } from "@/lib/tools/free-traffic-catalog";
import type { RevenueToolInput } from "@/lib/tools/revenue-tools";

function fromRevenueInputs(inputs: readonly RevenueToolInput[]): ReferenceGraphicField[] {
  return inputs.map((input) => ({
    key: input.key,
    label: input.label,
    type: input.type,
    unitGroup: input.unit?.includes("USD") || input.unit?.includes("EUR")
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
  if (config.kind === "schema") {
    return config.inputs.map((input) => ({
      key: input.id,
      label: input.label,
      type: input.type,
      unitGroup: input.unit,
    }));
  }
  return config.inputs.map((input) => ({
    key: input.id,
    label: input.label,
    type: input.type,
    unitGroup: input.unit,
  }));
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
