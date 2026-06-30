import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";

const MESSAGES_DIR = join(process.cwd(), "messages");

const REQUIRED_DATABASE_KEYS = [
  "indexSummaryHeading",
  "indexSummaryIntro",
  "indexSummaryLineSavingsOnly",
  "indexSummaryLineWithMetric",
  "colSavings",
  "colProjectDuration",
] as const;

function loadDatabaseMessages(locale: string): Record<string, string> {
  const messages = JSON.parse(readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf8")) as Record<
    string,
    unknown
  >;
  const caseStudies = messages.caseStudies as Record<string, unknown> | undefined;
  const database = caseStudies?.database as Record<string, string> | undefined;
  return database ?? {};
}

describe("case-studies i18n leak guard (6 locales)", () => {
  it("defines required database keys with non-empty localized copy", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const database = loadDatabaseMessages(locale);

      for (const key of REQUIRED_DATABASE_KEYS) {
        const value = database[key];
        expect(typeof value, `${locale}: caseStudies.database.${key}`).toBe("string");
        expect((value ?? "").trim().length, `${locale}: empty ${key}`).toBeGreaterThan(0);
        expect(value, `${locale}: raw key leak`).not.toMatch(/^caseStudies\.database\./);
      }
    }
  });
});
