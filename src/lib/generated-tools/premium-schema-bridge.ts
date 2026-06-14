import { GENERATED_CALCULATOR_SLUGS } from "@/lib/generated-tools/calculator-registry";
import {
  generatedToolDiagramExists,
  generatedToolDiagramPublicPath,
  getGeneratedToolSchema,
} from "@/lib/generated-tools/schema-loader";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";
import { getPremiumSchemaBySlug } from "@/lib/premium-schema/schemas/index";

export type GeneratedPremiumBridgePayload = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly diagramSrc: string | null;
};

export function canBridgePremiumSchemaToGenerated(slug: string): boolean {
  if (!getPremiumSchemaBySlug(slug)) {
    return false;
  }
  if (!GENERATED_CALCULATOR_SLUGS.includes(slug)) {
    return false;
  }
  return getGeneratedToolSchema(slug) !== null;
}

export function resolveGeneratedPremiumBridge(
  slug: string,
): GeneratedPremiumBridgePayload | null {
  if (!canBridgePremiumSchemaToGenerated(slug)) {
    return null;
  }

  const schema = getGeneratedToolSchema(slug);
  if (!schema) {
    return null;
  }

  const diagramSrc = generatedToolDiagramExists(slug)
    ? generatedToolDiagramPublicPath(slug)
    : null;

  return {
    slug,
    schema,
    diagramSrc,
  };
}

export function listGeneratedPremiumBridgeSlugs(): readonly string[] {
  return GENERATED_CALCULATOR_SLUGS.filter((slug) => canBridgePremiumSchemaToGenerated(slug));
}
