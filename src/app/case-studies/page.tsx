import type { Metadata } from "next";
import { listCaseStudies } from "@/lib/case-studies/case-study-registry";
import { getCaseStudyToolHref, type CaseStudyEntry } from "@/lib/case-studies/case-study-types";
import { createPageMetadata } from "@/lib/metadata";
import { CaseStudiesClientContent } from "@/components/case-studies/CaseStudiesClientContent";

const LOCALE = "en";

const METADATA_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Engineering Field Analyses Directory — Cost Leakage & Quote Margin Reviews | SectorCalc",
    description: "Engineering cost leakage and quote margin erosion analyses prepared with real field data in 14 sectors. Deterministic formulas and document directory for CNC, construction, energy, logistics, HVAC and more.",
  },
};

const TRANSLATIONS: Record<string, { home: string; resources: string; dizin: string }> = {
  en: { home: "Home", resources: "Resources", dizin: "Field Analyses Directory" },
};

const LOCALIZED_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  en: [
    { q: "What is an engineering field analysis?", a: "A field analysis is a structured study that evaluates a company's actual operational data using deterministic engineering formulas to quantify hidden cost leaks and quote margin erosion. Each analysis includes a problem definition, example parameters, a calculation methodology, and a verified outcome." },
    { q: "How is a cost leakage analysis conducted?", a: "In addition to direct costs (materials, bare labor), hidden overheads such as setup times, downtime allowances, scrap rates, logistics, and warranty reserves are added using a deterministic formula. The result reveals the margin deviation between the paper proposal and the actual cost base." },
    { q: "What standards are these field analyses based on?", a: "The analyses refer to ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276 as well as Lean and Six Sigma methodologies. Each calculation is deterministically designed according to recognized engineering standards." },
    { q: "For which sectors are field analyses available?", a: "The directory covers 12 sectors: CNC/machining, construction/bid management, industrial cleaning, logistics, energy management, welding/metal fabrication, HVAC, plumbing/electrical, sheet metal, restaurant/food, e-commerce, and sustainability/carbon (CBAM)." },
    { q: "How can quote margin erosion be prevented?", a: "The first step is to quantify hidden overheads: setup, downtime, scrap, delays, and warranty reserves must be included in the starting quote price. SectorCalc's corresponding Premium tools automatically calculate the minimum safe quote floor to protect your margin for each industry." },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const metadata = METADATA_BY_LOCALE[LOCALE] || METADATA_BY_LOCALE.en;
  return createPageMetadata({
    title: metadata.title,
    description: metadata.description,
    path: "/case-studies",
    locale: LOCALE as "en",
  });
}

export default async function CaseStudiesIndexPage() {
  const allStudies = listCaseStudies();

  const toolHrefs: Record<string, string> = {};
  for (const entry of allStudies) {
    toolHrefs[entry.slug] = getCaseStudyToolHref(entry);
  }

  const tr = TRANSLATIONS[LOCALE] || TRANSLATIONS.en;
  const faqs = LOCALIZED_FAQS[LOCALE] || LOCALIZED_FAQS.en;
  const baseUrl = "https://sectorcalc.com";
  const desc = METADATA_BY_LOCALE[LOCALE]?.description || METADATA_BY_LOCALE.en.description;

  const compositeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": tr.home, "item": `${baseUrl}/${LOCALE}` },
        { "@type": "ListItem", "position": 2, "name": tr.resources, "item": `${baseUrl}/${LOCALE}/methodology` },
        { "@type": "ListItem", "position": 3, "name": tr.dizin, "item": `${baseUrl}/${LOCALE}/case-studies` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": tr.dizin,
      "inLanguage": LOCALE,
      "url": `${baseUrl}/${LOCALE}/case-studies`,
      "description": desc,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": allStudies.length,
        "itemListElement": allStudies.map((s, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": `${baseUrl}/${LOCALE}/case-studies/${s.slug}`,
          "name": s.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compositeSchema) }}
      />
      <CaseStudiesClientContent
        locale={LOCALE}
        studies={allStudies}
        toolHrefs={toolHrefs}
      />
    </>
  );
}
