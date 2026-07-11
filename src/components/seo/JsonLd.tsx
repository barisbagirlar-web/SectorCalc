import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";

export type JsonLdProps = {
  readonly data: JsonLdRecord | readonly JsonLdRecord[];
};

function escapeJsonLdScript(json: string): string {
  return json.replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data.map((item) => sanitizeJsonLd(item)) : sanitizeJsonLd(data);
  const json = escapeJsonLdScript(JSON.stringify(payload));
  const markup = `<script type="application/ld+json">${json}</script>`;

  // NB: dangerouslySetInnerHTML on a <div> avoids a Next.js 15.5.x bug
  // where <script> with dangerouslySetInnerHTML in server components
  // triggers notFound() for the entire page route.
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}

