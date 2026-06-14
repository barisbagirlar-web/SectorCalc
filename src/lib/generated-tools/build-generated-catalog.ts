import type { Tool } from "@/data/tools";
import { GENERATED_CALCULATOR_SLUGS } from "@/lib/generated-tools/calculator-registry";
import { getGeneratedToolHref } from "@/lib/generated-tools/paths";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import { getGeneratedToolSchema } from "@/lib/generated-tools/schema-loader";

export function buildGeneratedToolCatalog(locale: string): Tool[] {
  const tools: Tool[] = [];

  for (const slug of GENERATED_CALCULATOR_SLUGS) {
    const schema = getGeneratedToolSchema(slug);
    if (!schema) {
      continue;
    }

    const title = resolveGeneratedToolTitle(slug, schema, locale);
    const description = resolveGeneratedToolDescription(slug, schema, locale);

    tools.push({
      slug,
      name: title,
      shortDescription: description,
      description,
      tier: schema.premiumRequired ? "premium" : "free",
      industrySlug: "general",
      href: getGeneratedToolHref(slug),
    });
  }

  return tools;
}
