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

/** Build a canonical Wikidata entity URL from a QID. */
export function wikidataUrl(qid: string): string {
  return `https://www.wikidata.org/wiki/${qid}`;
}

/**
 * Topical entities SectorCalc demonstrably covers, linked to their canonical
 * Wikidata items for Knowledge Graph / entity disambiguation.
 *
 * Every QID below was verified against the live Wikidata API (wbsearchentities,
 * en, verified 2026-07-18). Do NOT add unverified QIDs - a wrong QID mislinks
 * the entity and degrades the knowledge panel.
 */
export const TOPIC_WIKIDATA_ENTITIES = [
  { name: "Overall equipment effectiveness", qid: "Q1029015" },
  { name: "Manufacturing", qid: "Q187939" },
  { name: "Computer numerical control", qid: "Q190247" },
  { name: "Cost accounting", qid: "Q1077518" },
  { name: "Construction", qid: "Q385378" },
  { name: "Logistics", qid: "Q177777" },
  { name: "Supply chain management", qid: "Q492886" },
  { name: "Energy management", qid: "Q1779504" },
  { name: "Energy conservation", qid: "Q380170" },
  { name: "Sustainability", qid: "Q219416" },
  { name: "Agriculture", qid: "Q11451" },
  { name: "Six Sigma", qid: "Q236908" },
  { name: "Quality control", qid: "Q827792" },
  { name: "Heating, ventilation, and air conditioning", qid: "Q1798773" },
  { name: "Welding", qid: "Q131172" },
  { name: "Carbon Border Adjustment Mechanism", qid: "Q108803475" },
  { name: "Break-even", qid: "Q626990" },
] as const;

/**
 * Industry taxonomy node (entity-graph DefinedTerm @id fragment) -> verified
 * Wikidata QID. Only industries with a confidently matched entity are mapped;
 * unmapped industries intentionally carry no sameAs (no guessing).
 */
export const INDUSTRY_WIKIDATA_QID: Readonly<Record<string, string>> = {
  "industry-cnc-manufacturing": "Q190247",
  "industry-construction": "Q385378",
  "industry-logistics": "Q177777",
  "industry-energy": "Q1779504",
  "industry-agriculture": "Q11451",
  "industry-finance": "Q1077518",
  "industry-quality": "Q236908",
  "industry-hvac": "Q1798773",
};
