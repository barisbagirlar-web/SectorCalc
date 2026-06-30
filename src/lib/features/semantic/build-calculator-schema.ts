import { buildCalculatorJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import type { CalculatorSchemaInput } from "@/lib/features/semantic/schema-types";

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
