type JsonLd = Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;

export function SemanticJsonLd({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
