import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import { getIndustryDisplayName } from "@/lib/tools/industry-registry";
import type { RevenueTool } from "@/lib/tools/revenue-tools";

export type PremiumSeoLandingContext = {
  readonly sector: string;
  readonly inputs: string;
  readonly outputs: string;
  readonly pain: string;
  readonly inputCount: number;
};

const MAX_INPUT_LABELS = 5;

function joinLabels(labels: readonly string[]): string {
  const slice = labels.slice(0, MAX_INPUT_LABELS);
  if (slice.length === 0) {
    return "your job costs and quantities";
  }
  if (slice.length === 1) {
    return slice[0];
  }
  if (slice.length === 2) {
    return `${slice[0]} and ${slice[1]}`;
  }
  return `${slice.slice(0, -1).join(", ")}, and ${slice[slice.length - 1]}`;
}

export function buildRevenueSeoLandingContext(tool: RevenueTool): PremiumSeoLandingContext {
  const requiredInputs = tool.paidInputs.filter((input) => input.required).map((input) => input.label);
  const inputLabels =
    requiredInputs.length > 0
      ? requiredInputs
      : tool.paidInputs.map((input) => input.label);

  return {
    sector: getIndustryDisplayName(tool.sector),
    inputs: joinLabels(inputLabels),
    outputs: tool.paidResultPromise,
    pain: tool.painStatement,
    inputCount: tool.paidInputs.length,
  };
}

export function buildSchemaSeoLandingContext(
  schemaId: string,
  locale: string,
): PremiumSeoLandingContext {
  const schema = getPremiumCalculatorSchema(schemaId);
  if (!schema) {
    return {
      sector: "your sector",
      inputs: "your job costs and quantities",
      outputs: "a structured verdict with risk drivers",
      pain: "Hidden costs erode margin before the quote is accepted.",
      inputCount: 0,
    };
  }

  const localized = getLocalizedPremiumSchema(schemaId, locale);
  const inputLabels = schema.inputs
    .filter((input) => input.required)
    .map((input) => input.label);
  const fallbackLabels =
    inputLabels.length > 0 ? inputLabels : schema.inputs.map((input) => input.label);
  const outputLabels = schema.outputs.slice(0, 3).map((output) => output.label);

  return {
    sector: getIndustryDisplayName(schema.sectorSlug as Parameters<typeof getIndustryDisplayName>[0]),
    inputs: joinLabels(fallbackLabels),
    outputs: joinLabels(outputLabels),
    pain: localized?.painStatement ?? schema.painStatement,
    inputCount: schema.inputs.length,
  };
}

export type PremiumSeoTemplateTokens = PremiumSeoLandingContext & {
  readonly tool: string;
};

export function fillPremiumSeoTemplate(
  template: string,
  tokens: PremiumSeoTemplateTokens,
): string {
  return template
    .replace(/\{tool\}/g, tokens.tool)
    .replace(/\{sector\}/g, tokens.sector)
    .replace(/\{inputs\}/g, tokens.inputs)
    .replace(/\{outputs\}/g, tokens.outputs)
    .replace(/\{pain\}/g, tokens.pain)
    .replace(/\{inputCount\}/g, String(tokens.inputCount));
}
