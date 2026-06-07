import { Link } from "@/i18n/routing";

/** Predictive preconnect + dns-prefetch for API origin (RAG / bot discovery). */
export function SeoHeadLinks() {
  return (
    <>
      <link rel="preconnect" href="https://api.sectorcalc.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://api.sectorcalc.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}

export function LlmsTxtLink() {
  return <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs Knowledge Base" />;
}
