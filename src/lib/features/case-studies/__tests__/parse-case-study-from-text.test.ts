import { describe, expect, it } from "vitest";
import {
  mergeParsedCaseStudyIntoFormValues,
  validateParsedCaseStudyFromText,
} from "@/lib/features/case-studies/parse-case-study-from-text";
import { emptyCaseStudyFormValues } from "@/lib/features/case-studies/case-study-drafts";

describe("parse-case-study-from-text", () => {
  it("validates parser output and normalizes metric/label fields", () => {
    const result = validateParsedCaseStudyFromText({
      title: "OEE Recovery",
      subtitle: "Setup time cut in half",
      industry: "CNC Machining",
      country: "Turkey",
      city: "Izmir",
      duration: "Jan 2026 – May 2026",
      savings: "850000",
      tools: ["oee-downtime-calculator", "smed-changeover-optimizer"],
      challenge: "Low OEE and long setup.",
      solution: "Used SectorCalc tools.",
      results: [{ label: "OEE", before: "18%", after: "61%" }],
      testimonial: "Great results.",
      author: "Ali Yilmaz",
      authorTitle: "Production Manager",
      company: "Izmir CNC",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.results).toEqual([{ metric: "OEE", before: "18%", after: "61%" }]);
    expect(result.data.tools).toBe("oee-downtime-calculator, smed-changeover-optimizer");
    expect(result.data.savings).toBe(850000);
  });

  it("merges parsed fields into form values", () => {
    const base = emptyCaseStudyFormValues("CS-2026-01");
    const parsed = {
      title: "OEE Recovery",
      subtitle: "Faster changeovers",
      industry: "CNC Machining",
      country: "Turkey",
      city: "Izmir",
      duration: "3 months",
      savings: 12000,
      tools: "oee-downtime-calculator",
      challenge: "Low OEE.",
      solution: "SMED rollout.",
      results: [{ metric: "OEE", before: "20%", after: "55%" }],
      testimonial: "We saved time.",
      author: "Jane Doe",
      authorTitle: "Plant Manager",
      company: "Acme CNC",
    };

    const merged = mergeParsedCaseStudyIntoFormValues(base, parsed);
    expect(merged.title).toBe("OEE Recovery");
    expect(merged.savingsEur).toBe("12000");
    expect(merged.testimonialAuthor).toBe("Jane Doe");
    expect(merged.results[0]?.metric).toBe("OEE");
  });
});
