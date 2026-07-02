import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import { publishedCaseStudyBase } from "@/lib/features/case-studies/data";
import type {
  CaseStudy,
  PublishedCaseStudyLocaleContent,
} from "@/lib/features/case-studies/types";

type LocaleContentMap = Readonly<
  Record<(typeof publishedCaseStudyBase)[number]["slug"], Readonly<Record<SupportedLocale, PublishedCaseStudyLocaleContent>>>
>;

const CONTENT: LocaleContentMap = {
  "muller-prazision-5s-optimization": {
    en: {
      title: "Muller Präzision GmbH: 5S audit score 38→87, €1.232M efficiency gain in 5 months",
      subtitle: "5S productivity breakthrough: €1.2M cash gain in five months without CAPEX",
      industry: "Automotive supply chain (precision CNC parts)",
      challenge:
        "At the Stuttgart plant, a Q4 2025 internal audit scored 5S at 38/100; bench search time averaged 14 min/shift, unplanned downtime was 14.2%, and scrap cost ran €187,000/month.\n\nHidden inefficiency cost:\n500 employees × 22 days × 8 hours × 12% time loss = 10,560 hours/month\nFully loaded hourly cost (German automotive, IG Metall scale): €35/hour\nMonthly cash-flow loss: €369,600",
      solution:
        "SectorCalc Trust Trace™ 5S Audit & Efficiency Loss Cost Converter module was deployed.\n\nImplementation standards:\n- DIN EN ISO 9001:2015 Clause 7.1.4 (Process environment)\n- VDI 2067 Part 3.2 (Economic production evaluation)\n- JIPM TPM Seiri-Seiton-Seiso-Seiketsu-Shitsuke audit protocol\n- Sector: Automotive supply chain, IATF 16949 aligned.",
      results: [
        { metric: "5S audit score", before: "38/100", after: "87/100" },
        { metric: "Scrap rate", before: "8.2%", after: "3.1%" },
        { metric: "Unplanned downtime", before: "14.2%", after: "5.8%" },
        { metric: "Bench search time", before: "14 min/shift", after: "3.2 min/shift" },
        { metric: "Monthly efficiency loss", before: "€369,600", after: "€123,200" },
      ],
      testimonial: {
        quote:
          "SectorCalc's cost converter model turned 5S from a cleaning project into a cash-flow line item on the CFO report. €1.2M in five months - in our pocket with process discipline alone, without any CAPEX.",
        author: "Klaus Weber",
        title: "COO / Plant Director",
        company: "Muller Präzision GmbH",
      },
    },
  },
  "cnc-oee-improvement": {
    en: {
      title: "CNC shop raised OEE from 18% to 61%",
      subtitle: "How unplanned downtime, setup time, and quality losses were reversed",
      industry: "Manufacturing / CNC machining",
      challenge:
        "A CNC job shop running 12 machines for batch production had an OEE of 18%. Unplanned downtime, long setups, and quality losses were eroding throughput - roughly 40 hours of unplanned stops each month.",
      solution:
        "SectorCalc OEE Downtime Calculator mapped stop categories. SMED Changeover Optimizer cut setup from 45 minutes to 12. Scrap rate dropped from 8% to 3% after rework buffers were priced into jobs.",
      results: [
        { metric: "OEE", before: "18%", after: "61%" },
        { metric: "Setup time", before: "45 min", after: "12 min" },
        { metric: "Scrap rate", before: "8%", after: "3%" },
        { metric: "Annual savings", before: "$0", after: "$85,000" },
      ],
      testimonial: {
        quote:
          "With SectorCalc we tripled shop-floor visibility. We now see which machine stopped and why within minutes.",
        author: "Ali Yilmaz",
        title: "Production Manager",
        company: "Izmir CNC Workshop",
      },
    },
  },
  "carbon-reporting-automation": {
    en: {
      title: "Energy firm cut SKDM reporting from 4 hours to 20 minutes",
      subtitle: "How carbon footprint calculation and reporting was automated",
      industry: "Energy / carbon management",
      challenge:
        "An energy company prepared CBAM-style carbon reports in manual Excel workbooks. Each report took four hours with a high error rate.",
      solution:
        "SectorCalc Carbon Footprint Calculator automated product-level footprints. kWh Cost Calculator integrated energy spend into the same review loop.",
      results: [
        { metric: "Reporting time", before: "4 hours", after: "20 min" },
        { metric: "Error rate", before: "12%", after: "0.5%" },
        { metric: "Annual savings", before: "$0", after: "$32,000" },
      ],
      testimonial: {
        quote:
          "We cut SKDM reporting from four hours to twenty minutes. Clients now get consistent, traceable numbers.",
        author: "Mehmet Demir",
        title: "Sustainability Director",
        company: "Energy Corp",
      },
    },
  },
  "welding-cost-reduction": {
    en: {
      title: "Welding shop cut costs by 22%",
      subtitle: "Quote discipline and weld cost optimization for competitive bids",
      industry: "Metal / welding",
      challenge:
        "A welding shop produced different cost figures on every new quote. Wire, gas, labor, and energy were not standardized - margin leaked on competitive bids.",
      solution:
        "SectorCalc Welding Cost Calculator unified wire, gas, labor, and energy in one governed formula. Volume and strength checks added before release.",
      results: [
        { metric: "Quote margin", before: "18%", after: "32%" },
        { metric: "Cost variance", before: "15%", after: "3%" },
        { metric: "Annual savings", before: "$0", after: "$45,000" },
      ],
      testimonial: {
        quote:
          "We quote with confidence now. Weld cost variance dropped from 15% to 3%.",
        author: "Hasan Usta",
        title: "Shop Owner",
        company: "Kaynak Teknik",
      },
    },
  },
};

function normalizeLocale(locale: string): SupportedLocale {
  const normalized = locale.toLowerCase() as SupportedLocale;
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : "en";
}

export function isPublishedCaseStudySlug(slug: string): boolean {
  return slug in CONTENT;
}

export function getPublishedCaseStudyBySlug(slug: string, locale: string): CaseStudy | undefined {
  const localized = CONTENT[slug as keyof typeof CONTENT];
  const base = publishedCaseStudyBase.find((entry) => entry.slug === slug);
  if (!localized || !base) {
    return undefined;
  }

  const content = localized[normalizeLocale(locale)];
  return {
    slug: base.slug,
    tools: base.tools,
    publishedAt: base.publishedAt,
    readTime: base.readTime,
    coverImage: base.coverImage,
    id: base.id,
    country: base.country,
    city: base.city,
    projectDuration: base.projectDuration,
    savingsEur: base.savingsEur,
    ...content,
  };
}

export function listPublishedCaseStudies(locale: string): CaseStudy[] {
  return publishedCaseStudyBase
    .map((base) => getPublishedCaseStudyBySlug(base.slug, locale))
    .filter((entry): entry is CaseStudy => entry !== undefined);
}

export function listPublishedCaseStudySlugs(): readonly string[] {
  return publishedCaseStudyBase.map((entry) => entry.slug);
}
