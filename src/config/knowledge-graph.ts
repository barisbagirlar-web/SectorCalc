import { SITE_SOCIAL } from "@/config/site";

/**
 * Knowledge Graph entity identifiers - update Wikidata URLs after manual registration.
 * @see https://www.wikidata.org/wiki/Special:NewItem
 */
export const KNOWLEDGE_GRAPH = {
  /** Wikidata item for SectorCalc knowledge panel linkage */
  organizationWikidataUrl: "https://www.wikidata.org/wiki/Q140252668" as string | null,
  /** Set after founder Wikidata item is published */
  founderWikidataUrl: null as string | null,
} as const;

export const FOUNDER_PROFILE = {
  name: "Baris Bagirlar",
  email: "barisbagirlar@gmail.com",
  jobTitle: {
    en: "Founder & CEO, SectorCalc",
    tr: "Kurucu ve CEO, SectorCalc",
    de: "Grunder & CEO, SectorCalc",
    fr: "Fondateur et PDG, SectorCalc",
    es: "Fundador y CEO, SectorCalc",
    ar: "المؤسس والرئيس التنفيذي، SectorCalc",
  },
  sameAs: [
    "https://www.linkedin.com/in/barisbagirlar",
    "https://github.com/barisbagirlar-web",
  ],
} as const;

function withOptionalWikidata(
  urls: readonly string[],
  wikidataUrl: string | null,
): string[] {
  const base = [...urls];
  if (wikidataUrl) {
    base.push(wikidataUrl);
  }
  return base;
}

export function buildOrganizationSameAs(): string[] {
  return withOptionalWikidata(
    [
      SITE_SOCIAL.linkedin,
      SITE_SOCIAL.github,
      SITE_SOCIAL.twitter,
      "https://github.com/barisbagirlar-web/SectorCalc",
    ],
    KNOWLEDGE_GRAPH.organizationWikidataUrl,
  );
}

export function buildFounderSameAs(): string[] {
  return withOptionalWikidata([...FOUNDER_PROFILE.sameAs], KNOWLEDGE_GRAPH.founderWikidataUrl);
}
