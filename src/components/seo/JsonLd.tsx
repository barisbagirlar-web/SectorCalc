import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";

export type JsonLdProps = {
  readonly data: JsonLdRecord | readonly JsonLdRecord[];
};

function escapeJsonLdScript(json: string): string {
  return json.replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data.map((item) => sanitizeJsonLd(item)) : sanitizeJsonLd(data);
  const json = escapeJsonLdScript(JSON.stringify(payload));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export { buildHomepageJsonLd } from "@/lib/seo/schema-mesh";
