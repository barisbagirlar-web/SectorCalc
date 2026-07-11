type JsonLd = Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;

export function SemanticJsonLd({ data }: { data: JsonLd }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  const markup = `<script type="application/ld+json">${json}</script>`;

  // NB: wrapping in a <div> avoids the Next.js 15.5.x bug where
  // <script> with dangerouslySetInnerHTML in server components
  // triggers notFound() for the entire page.
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
