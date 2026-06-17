import { describe, expect, it } from "vitest";
import { buildCaseStudyJsonLd, computeCaseStudySeoPreview } from "@/lib/case-studies/case-study-seo";
import type { CaseStudy } from "@/lib/case-studies/types";

const sampleStudy: CaseStudy = {
  id: "CS-2026-099",
  slug: "cnc-oee-improvement",
  title: "CNC Atölyesi OEE'sini %18'den %61'e Çıkardı",
  subtitle: "Duruş ve hurda maliyetlerinde ölçülebilir iyileşme",
  industry: "Otomotiv Yan Sanayi",
  country: "Turkey",
  city: "Izmir",
  projectDuration: "6 months",
  savingsEur: 85_000,
  tools: ["oee-downtime-calculator"],
  challenge: "Düşük OEE ve yüksek hurda oranı.",
  solution: "SectorCalc modülleri ile süreç standardizasyonu.",
  results: [{ metric: "OEE", before: "%18", after: "%61" }],
  testimonial: {
    quote: "Kararları artık veriye dayalı alıyoruz.",
    author: "Ayşe Yılmaz",
    title: "Üretim Müdürü",
    company: "Demo CNC A.Ş.",
  },
  publishedAt: "2026-06-01",
  readTime: 4,
  author: {
    name: "Barış Bağırlar",
    linkedin: "https://www.linkedin.com/in/barisbagirlar/",
  },
  technicalReview: {
    reviewer: "Prof. Dr. Neela Nataraj",
    mathSciNetId: "613458",
  },
};

describe("case-study-seo", () => {
  it("computes Turkish SEO preview from form values", () => {
    const preview = computeCaseStudySeoPreview({
      title: sampleStudy.title,
      subtitle: sampleStudy.subtitle,
      industry: sampleStudy.industry,
      savingsEur: "85000",
    });

    expect(preview.slug).toBe("cnc-atolyesi-oee-sini-18-den-61-e-cıkardı");
    expect(preview.metaTitle).toContain("SectorCalc Başarı Hikayesi");
    expect(preview.metaDescription.length).toBeLessThanOrEqual(160);
    expect(preview.canonicalPath).toBe(`/case-studies/${preview.slug}`);
  });

  it("builds CaseStudy JSON-LD with Person and Organization nodes", () => {
    const jsonLd = buildCaseStudyJsonLd(sampleStudy, "en");
    const serialized = JSON.stringify(jsonLd);

    expect(serialized).toContain("CaseStudy");
    expect(serialized).toContain("Prof. Dr. Neela Nataraj");
    expect(serialized).toContain("Demo CNC A.Ş.");
    expect(serialized).toContain("Barış Bağırlar");
    expect(serialized).toContain("85000");
  });
});
