import { JsonLd } from "@/components/seo/JsonLd";
import type { JsonLdRecord } from "@/lib/semantic/schema-types";

type SemanticJsonLdProps = {
  readonly data: JsonLdRecord | readonly JsonLdRecord[];
};

export function SemanticJsonLd({ data }: SemanticJsonLdProps) {
  return <JsonLd data={data} />;
}
