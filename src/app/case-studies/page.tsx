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
  de: {
    title: "Verzeichnis für ingenieurtechnische Feldanalysen — Kostenleckage & Angebotsmargen-Bewertungen | SectorCalc",
    description: "Mit realen Felddaten erstellte ingenieurwissenschaftliche Kostenleckage- und Angebotsmargenerosionsanalysen in 14 Sektoren. Deterministische Formeln und Dokumentenverzeichnis für CNC, Bauwesen, Energie, Logistik, HLK und mehr.",
  },
  fr: {
    title: "Annuaire des analyses de terrain d'ingénierie — Fuites de coûts & Revues de marges | SectorCalc",
    description: "Analyses d'ingénierie des fuites de coûts et de l'érosion des marges de devis préparées avec des données de terrain réelles dans 14 secteurs. Formules déterministes et annuaire de documents pour la CNC, la construction, l'énergie, la logistique, le CVC et plus.",
  },
  es: {
    title: "Directorio de análisis de campo de ingeniería — Fuga de costos & Revisiones de márgenes | SectorCalc",
    description: "Análisis de ingeniería de fuga de costos y erosión del margen de cotización preparados con datos de campo reales en 14 sectores. Fórmulas deterministas y directorio de documentos para CNC, construcción, energía, logística, HVAC y más.",
  },
  ar: {
    title: "دليل التحليلات الميدانية الهندسية — مراجعات تسرب التكاليف وتآكل الهوامش | SectorCalc",
    description: "تحليلات هندسية لتسرب التكاليف وتآكل هامش عرض السعر تم إعدادها ببيانات ميدانية حقيقية في 14 قطاعاً. صيغ حتمية ودليل مستندات للخراطة الرقمية (CNC)، والتشييد، والطاقة، والخدمات اللوجستية، والتدفئة والتهوية وتكييف الهواء (HVAC) والمزيد.",
  },
};

const TRANSLATIONS: Record<string, { home: string; resources: string; dizin: string }> = {
  en: { home: "Home", resources: "Resources", dizin: "Field Analyses Directory" },
  de: { home: "Startseite", resources: "Ressourcen", dizin: "Verzeichnis der Feldanalysen" },
  fr: { home: "Accueil", resources: "Ressources", dizin: "Annuaire des analyses de terrain" },
  es: { home: "Inicio", resources: "Recursos", dizin: "Directorio de análisis de campo" },
  ar: { home: "الرئيسية", resources: "الموارد", dizin: "دليل التحليلات الميدانية" },
};

const LOCALIZED_FAQS: Record<string, Array<{ q: string; a: string }>> = {
  en: [
    { q: "What is an engineering field analysis?", a: "A field analysis is a structured study that evaluates a company's actual operational data using deterministic engineering formulas to quantify hidden cost leaks and quote margin erosion. Each analysis includes a problem definition, example parameters, a calculation methodology, and a verified outcome." },
    { q: "How is a cost leakage analysis conducted?", a: "In addition to direct costs (materials, bare labor), hidden overheads such as setup times, downtime allowances, scrap rates, logistics, and warranty reserves are added using a deterministic formula. The result reveals the margin deviation between the paper proposal and the actual cost base." },
    { q: "What standards are these field analyses based on?", a: "The analyses refer to ISO 9001, VDI 2067, ASME B31.3, ASHRAE 90.1, IEC 60034, EN 13306, DIN 276 as well as Lean and Six Sigma methodologies. Each calculation is deterministically designed according to recognized engineering standards." },
    { q: "For which sectors are field analyses available?", a: "The directory covers 12 sectors: CNC/machining, construction/bid management, industrial cleaning, logistics, energy management, welding/metal fabrication, HVAC, plumbing/electrical, sheet metal, restaurant/food, e-commerce, and sustainability/carbon (CBAM)." },
    { q: "How can quote margin erosion be prevented?", a: "The first step is to quantify hidden overheads: setup, downtime, scrap, delays, and warranty reserves must be included in the starting quote price. SectorCalc's corresponding Premium tools automatically calculate the minimum safe quote floor to protect your margin for each industry." },
  ],
  de: [
    { q: "Was ist eine ingenieurtechnische Feldanalyse?", a: "Eine Feldanalyse ist eine strukturierte Studie, die die tatsächlichen Betriebsdaten eines Unternehmens mithilfe deterministischer Ingenieurformeln bewertet, um verdeckte Kostenabflüsse und Angebotsmargenerosionen zu quantifizieren. Jede Analyse umfasst eine Problemdefinition, Beispielparameter, eine Berechnungsmethodik und ein verifiziertes Ergebnis." },
  ],
  fr: [
    { q: "Qu'est-ce qu'une analyse de terrain d'ingénierie ?", a: "Une analyse de terrain est une étude structurée qui évalue les données opérationnelles réelles d'une entreprise à l'aide de formules d'ingénierie déterministes pour quantifier les fuites de coûts cachées et l'érosion de la marge des devis. Chaque analyse comprend une définition du problème, des exemples de paramètres, une méthodologie de calcul et un résultat vérifié." },
  ],
  es: [
    { q: "¿Qué es un análisis de campo de ingeniería?", a: "Un análisis de campo es un estudio estructurado que evalúa los datos operativos reales de una empresa utilizando fórmulas de ingeniería deterministas para cuantificar las fugas de costos ocultas y la erosión del margen de cotización. Cada análisis incluye una definición del problema, parámetros de ejemplo, una metodología de cálculo y un resultado verificado." },
  ],
  ar: [
    { q: "ما هو التحليل الميداني الهندسي؟", a: "التحليل الميداني هو دراسة منظمة تقيم البيانات التشغيلية الفعلية للشركة باستخدام صيغ هندسية حتمية لقياس تسرب التكاليف الخفي وتآكل هامش عرض السعر. يتضمن كل تحليل تعريف المشكلة، ومعلمات مثال، ومنهجية حساب، ونتيجة موثقة." },
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
