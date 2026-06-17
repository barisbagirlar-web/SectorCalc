import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { buildCaseStudyIndexSummaryLine } from "@/lib/case-studies/case-study-seo";
import { listPublishedCaseStudies } from "@/lib/case-studies/published-case-study-locale";

const INDEX_SUMMARY_LABELS = {
  tr: {
    lineSavingsOnly: ({ company, savings }: { company: string; savings: string }) =>
      `${company}: ${savings} belgelenmiş tasarruf`,
    lineWithMetric: ({
      company,
      metric,
      before,
      after,
      savings,
    }: {
      company: string;
      metric: string;
      before: string;
      after: string;
      savings: string;
    }) => `${company}: ${metric} ${before} → ${after}, ${savings} tasarruf`,
  },
  en: {
    lineSavingsOnly: ({ company, savings }: { company: string; savings: string }) =>
      `${company}: ${savings} documented savings`,
    lineWithMetric: ({
      company,
      metric,
      before,
      after,
      savings,
    }: {
      company: string;
      metric: string;
      before: string;
      after: string;
      savings: string;
    }) => `${company}: ${metric} ${before} → ${after}, ${savings} savings`,
  },
  de: {
    lineSavingsOnly: ({ company, savings }: { company: string; savings: string }) =>
      `${company}: ${savings} dokumentierte Einsparungen`,
    lineWithMetric: ({
      company,
      metric,
      before,
      after,
      savings,
    }: {
      company: string;
      metric: string;
      before: string;
      after: string;
      savings: string;
    }) => `${company}: ${metric} ${before} → ${after}, ${savings} Einsparungen`,
  },
  fr: {
    lineSavingsOnly: ({ company, savings }: { company: string; savings: string }) =>
      `${company}: ${savings} d'économies documentées`,
    lineWithMetric: ({
      company,
      metric,
      before,
      after,
      savings,
    }: {
      company: string;
      metric: string;
      before: string;
      after: string;
      savings: string;
    }) => `${company}: ${metric} ${before} → ${after}, ${savings} d'économies`,
  },
  es: {
    lineSavingsOnly: ({ company, savings }: { company: string; savings: string }) =>
      `${company}: ${savings} de ahorro documentado`,
    lineWithMetric: ({
      company,
      metric,
      before,
      after,
      savings,
    }: {
      company: string;
      metric: string;
      before: string;
      after: string;
      savings: string;
    }) => `${company}: ${metric} ${before} → ${after}, ${savings} de ahorro`,
  },
  ar: {
    lineSavingsOnly: ({ company, savings }: { company: string; savings: string }) =>
      `${company}: ${savings} توفير موثق`,
    lineWithMetric: ({
      company,
      metric,
      before,
      after,
      savings,
    }: {
      company: string;
      metric: string;
      before: string;
      after: string;
      savings: string;
    }) => `${company}: ${metric} ${before} → ${after}، ${savings} توفير`,
  },
} as const;

describe("buildCaseStudyIndexSummaryLine (6 locales)", () => {
  it("localizes summary lines without hardcoded English", () => {
    const study = listPublishedCaseStudies("en")[0]!;

    for (const locale of SUPPORTED_LOCALES) {
      const labels = INDEX_SUMMARY_LABELS[locale];
      const line = buildCaseStudyIndexSummaryLine(study, locale, labels);

      expect(line).toContain(study.testimonial?.company ?? study.industry);
      expect(line).not.toContain("documented savings");
      expect(line).not.toMatch(/,\s+savings$/);
    }
  });
});
