import { describe, expect, it } from "vitest";
import { listPublishedCaseStudies } from "@/lib/case-studies/published-case-study-locale";
import {
  filterCaseStudiesForDatabase,
  formatEuroAmount,
  parseEuroAmount,
  resolveCaseStudySavingsEur,
} from "@/lib/case-studies/academic-database";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";

describe("academic case studies database", () => {
  it("parses localized euro amounts", () => {
    expect(parseEuroAmount("369.600€")).toBe(369600);
    expect(parseEuroAmount("$85,000")).toBe(85000);
  });

  it("formats savings as EUR currency in every supported locale", () => {
    const amount = 1_232_000;
    for (const locale of SUPPORTED_LOCALES) {
      const formatted = formatEuroAmount(amount, locale);
      expect(formatted).toMatch(/1/);
      expect(formatted).toMatch(/232/);
      expect(formatted).toMatch(/000/);
      expect(formatted).toMatch(/€|EUR/i);
    }
  });

  it("filters published studies by industry and savings band", () => {
    const studies = listPublishedCaseStudies("en");
    const filtered = filterCaseStudiesForDatabase(studies, {
      industry: "Manufacturing / CNC machining",
      savings: "0-100k",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.slug).toBe("cnc-oee-improvement");
  });

  it("exposes database metadata on published studies", () => {
    const study = listPublishedCaseStudies("en")[0];
    expect(study?.country).toBe("Germany");
    expect(study?.city).toBe("Stuttgart");
    expect(resolveCaseStudySavingsEur(study!)).toBeGreaterThan(1_000_000);
  });
});
