import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { listPublishedCaseStudies } from "@/lib/case-studies/published-case-study-locale";

const MESSAGES_DIR = join(process.cwd(), "messages");

const DATABASE_KEYS = [
  "metaTitle",
  "metaDescription",
  "headerTitle",
  "breadcrumbHome",
  "breadcrumbCurrent",
  "authorityLine1",
  "authorityLine2",
  "filterIndustry",
  "filterCountry",
  "filterYear",
  "filterSavings",
  "filterAll",
  "filterApply",
  "filterCsv",
  "colCompany",
  "colDetail",
  "noResults",
  "metaRecordId",
  "backToIndex",
  "resultsMetric",
  "sectionStatement",
  "representativeLabel",
] as const;

function loadMessages(locale: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf8")) as Record<
    string,
    unknown
  >;
}

describe("academic case studies i18n (6 locales)", () => {
  it("defines caseStudies.database keys in every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const messages = loadMessages(locale);
      const caseStudies = messages.caseStudies as Record<string, unknown> | undefined;
      const database = caseStudies?.database as Record<string, string> | undefined;

      expect(database, `${locale}: caseStudies.database missing`).toBeDefined();

      for (const key of DATABASE_KEYS) {
        const value = database?.[key];
        expect(typeof value, `${locale}: caseStudies.database.${key}`).toBe("string");
        expect((value ?? "").trim().length, `${locale}: caseStudies.database.${key} empty`).toBeGreaterThan(0);
      }
    }
  });

  it("localizes four published studies in every supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const studies = listPublishedCaseStudies(locale);
      expect(studies).toHaveLength(4);

      for (const study of studies) {
        expect(study.title.length).toBeGreaterThan(10);
        expect(study.industry.length).toBeGreaterThan(3);
        expect(study.results.length).toBeGreaterThanOrEqual(3);
        expect(study.country).toBeTruthy();
        expect(study.city).toBeTruthy();
      }
    }
  });
});
