import { buildCalculatorJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import type { CalculatorSchemaInput } from "@/lib/semantic/schema-types";

export function buildCalculatorSchema(input: CalculatorSchemaInput): JsonLdRecord {
  return buildCalculatorJsonLd(
    {
      slug: input.slug,
      title: input.title,
      description: input.description,
      seoDescription: input.description,
    },
    input.locale,
  );
}
