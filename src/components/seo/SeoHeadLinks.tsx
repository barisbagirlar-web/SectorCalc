/** Reserved for future high-value origin hints — fonts are self-hosted via next/font. */
export function SeoHeadLinks() {
  return null;
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
