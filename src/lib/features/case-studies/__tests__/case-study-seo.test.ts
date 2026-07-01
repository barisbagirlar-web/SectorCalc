import { describe, expect, it } from "vitest";
import {
  buildCaseStudyJsonLd,
  buildCaseStudySnippetCopy,
  computeCaseStudySeoPreview,
} from "@/lib/features/case-studies/case-study-seo";
import type { CaseStudy } from "@/lib/features/case-studies/types";

const labels = {
  snippetQuestionFallback: ({ industry }: { industry: string }) =>
    `What measurable results did SectorCalc deliver in ${industry}?`,
  snippetAnswerMetric: ({
    metric,
    before,
    after,
  }: {
    metric: string;
    before: string;
    after: string;
  }) => `${metric} improved from ${before} to ${after}.`,
  snippetAnswerSavings: ({ amount }: { amount: string }) =>
    `Documented efficiency gain: €${amount}.`,
};

const sampleStudy: CaseStudy = {
  id: "CS-2026-099",
  slug: "cnc-oee-improvement",
  title: "CNC Atolyesi OEE'sini %18'den %61'e Cikardi",
  subtitle: "Durus ve hurda maliyetlerinde olculebilir iyilesme",
  industry: "Otomotiv Yan Sanayi",
  country: "Turkey",
  city: "Izmir",
  projectDuration: "6 months",
  savingsEur: 85_000,
  tools: ["oee-downtime-calculator"],
  challenge: "Dusuk OEE ve yuksek hurda orani.",
  solution: "SectorCalc modulleri ile surec standardizasyonu. SMED ile setup sureleri kisaltildi.",
  results: [{ metric: "OEE", before: "%18", after: "%61" }],
  testimonial: {
    quote: "Profitarlari artik veriye dayali aliyoruz.",
    author: "Ayse Yilmaz",
    title: "Uretim Muduru",
    company: "Demo CNC A.S.",
  },
  publishedAt: "2026-06-01",
  readTime: 4,
  author: {
    name: "Baris Bagirlar",
    linkedin: "https://www.linkedin.com/in/barisbagirlar/",
  },
  technicalReview: {
    reviewer: "Prof. Dr. Neela Nataraj",
    mathSciNetId: "613458",
  },
};

describe("case-study-featured-snippet", () => {
  it("builds a concise featured answer under 60 words", () => {
    const snippet = buildCaseStudySnippetCopy(sampleStudy, "en", labels);
    const wordCount = snippet.answer.split(/\s+/).filter(Boolean).length;

    expect(snippet.question).toContain("Otomotiv Yan Sanayi");
    expect(snippet.answer).toContain("OEE");
    expect(wordCount).toBeLessThanOrEqual(58);
    expect(snippet.bullets).toHaveLength(1);
  });

  it("uses subtitle when it is already a question", () => {
    const snippet = buildCaseStudySnippetCopy(
      {
        ...sampleStudy,
        subtitle: "Plansiz duruslar nasil azaltildi?",
      },
      "tr",
      labels,
    );

    expect(snippet.question).toBe("Plansiz duruslar nasil azaltildi?");
  });
});

describe("case-study-seo", () => {
  it("computes Turkish SEO preview from form values", () => {
    const preview = computeCaseStudySeoPreview({
      title: sampleStudy.title,
      subtitle: sampleStudy.subtitle,
      industry: sampleStudy.industry,
      savingsEur: "85000",
    });

    expect(preview.slug).toBe("cnc-atolyesi-oee-sini-18-den-61-e-cikardi");
    expect(preview.metaTitle).toContain("SectorCalc Basari Hikayesi");
    expect(preview.metaDescription.length).toBeLessThanOrEqual(160);
    expect(preview.canonicalPath).toBe(`/case-studies/${preview.slug}`);
  });

  it("builds expanded JSON-LD graph for case study pages", () => {
    const jsonLd = buildCaseStudyJsonLd(sampleStudy, "en");
    const serialized = JSON.stringify(jsonLd);

    expect(serialized).toContain("CaseStudy");
    expect(serialized).toContain("Article");
    expect(serialized).toContain("BreadcrumbList");
    expect(serialized).toContain("SoftwareApplication");
    expect(serialized).toContain("SpeakableSpecification");
    expect(serialized).toContain("Prof. Dr. Neela Nataraj");
    expect(serialized).toContain("Demo CNC A.S.");
    expect(serialized).toContain("Baris Bagirlar");
    expect(serialized).toContain("85000");
  });
});
