/** Predictive preconnect for fonts used by next/font. */
export function SeoHeadLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}

export function LlmsTxtLink() {
  return (
    <>
      <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs Knowledge Base" />
      <link rel="alternate" type="text/plain" href="/sectorcalc-index.txt" title="SectorCalc Index" />
      <link rel="alternate" type="text/plain" href="/faq-knowledge.txt" title="SectorCalc FAQ" />
    </>
  );
}
