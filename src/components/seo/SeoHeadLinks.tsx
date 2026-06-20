/**
 * High-value origin hints for SEO + AI crawler optimization.
 *
 * - dns-prefetch: Early DNS resolution for cross-origin resources
 * - preconnect: Full TCP/TLS handshake for critical origins
 * - alternate links: AI-relevant text resources for LLM/AI crawlers
 * - resource hints: Predictive loading for high-traffic entry points
 */
export function SeoHeadLinks() {
  return (
    <>
      {/* DNS Prefetch — critical third-party origins */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://apis.google.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

      {/* Preconnect — critical third-party origins */}
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://apis.google.com" crossOrigin="anonymous" />

      {/* Prefetch core entrypoint pages for faster navigation */}
      <link rel="prefetch" href="/free-tools" as="document" />
      <link rel="prefetch" href="/pro-tools" as="document" />
      <link rel="prefetch" href="/industries" as="document" />

      {/* Canonical and alternate links for AI text knowledge bases */}
      <link rel="alternate" type="text/plain" href="/ai.txt" title="SectorCalc AI Access Policy" />
      <link rel="alternate" type="text/plain" href="/sectorcalc-index.txt" title="SectorCalc Platform Index" />
      <link rel="alternate" type="text/plain" href="/services-products.txt" title="SectorCalc Services & Products" />
      <link rel="alternate" type="text/plain" href="/faq-knowledge.txt" title="SectorCalc FAQ Knowledge Base" />
    </>
  );
}

export function LlmsTxtLink() {
  return (
    <>
      <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs Knowledge Base — SectorCalc Full Tool Index" />
      <link rel="alternate" type="text/plain" href="/sectorcalc-index.txt" title="SectorCalc Index — Platform Overview" />
      <link rel="alternate" type="text/plain" href="/faq-knowledge.txt" title="SectorCalc FAQ — Frequently Asked Questions" />
    </>
  );
}
