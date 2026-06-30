import { describe, expect, it } from "vitest";
import {
  applyCaseStudyLocalePack,
  buildUniformLocalePack,
  formValuesToLocaleContent,
  parseCaseStudyLocalePack,
} from "@/lib/features/case-studies/case-study-locale-pack";
import { emptyCaseStudyFormValues } from "@/lib/features/case-studies/case-study-drafts";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";

describe("case-study-locale-pack", () => {
  it("builds locale content from form values", () => {
    const values = {
      ...emptyCaseStudyFormValues("CS-2026-99"),
      title: "OEE Recovery",
      subtitle: "Faster changeovers",
      industry: "CNC",
      challenge: "Low OEE",
      solution: "SMED rollout",
      results: [{ metric: "OEE", before: "20%", after: "55%" }],
      testimonialQuote: "Great outcome",
      testimonialAuthor: "Jane Doe",
      testimonialTitle: "Plant Manager",
      testimonialCompany: "Acme CNC",
    };

    const content = formValuesToLocaleContent(values);
    expect(content.title).toBe("OEE Recovery");
    expect(content.results).toHaveLength(1);
    expect(content.testimonial?.author).toBe("Jane Doe");
  });

  it("parses and applies six-locale packs", () => {
    const pack = buildUniformLocalePack({
      title: "Base title",
      subtitle: "Base subtitle",
      industry: "Energy",
      challenge: "Challenge text",
      solution: "Solution text",
      results: [{ metric: "OEE", before: "10%", after: "40%" }],
    });

    const parsed = parseCaseStudyLocalePack(pack);
    expect(parsed).toBeDefined();
    expect(SUPPORTED_LOCALES.every((locale) => parsed?.[locale]?.title === "Base title")).toBe(true);

    const localized = applyCaseStudyLocalePack(
      {
        slug: "demo",
        title: "Fallback",
        subtitle: "",
        industry: "",
        tools: [],
        challenge: "",
        solution: "",
        results: [],
        publishedAt: "2026-01-01",
        readTime: 4,
      },
      "tr",
      pack,
    );

    expect(localized.title).toBe("Base title");
  });
});
