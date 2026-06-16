import { TOOL_REFERENCE_CREATOR } from "@/config/tool-reference-creator";
import { SITE_URL } from "@/lib/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";

export function buildCncBenchmarkDatasetJsonLd(input: {
  readonly name: string;
  readonly description: string;
  readonly locale: string;
}): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}/${input.locale}/data`,
    downloadUrl: `${SITE_URL}/data/cnc-benchmark-2024.csv`,
    creator: {
      "@type": "Person",
      name: TOOL_REFERENCE_CREATOR.name,
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: TOOL_REFERENCE_CREATOR.affiliation.name,
      },
    },
    datePublished: "2026-06-16",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "CNC machining",
      "cutting speed",
      "feed rate",
      "tool life",
      "industrial cost benchmark",
    ],
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${SITE_URL}/data/cnc-benchmark-2024.csv`,
    },
  }) as JsonLdRecord;
}
