/* eslint-disable */
// @ts-nocheck

import { describe, expect, test } from "vitest";
import {
  LOCALE_GLOSSARY,
  type GlossaryTerm,
} from "@/lib/i18n/locale-glossary";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locale-config";

const CORE_TERMS: GlossaryTerm[] = [
  "decisionReport",
  "hiddenLoss",
  "premiumAnalyzer",
  "calculator",
  "export",
  "oee",
];

describe("locale-glossary", () => {
  test("glossary covers all active locales for every term", () => {
    for (const term of Object.keys(LOCALE_GLOSSARY) as GlossaryTerm[]) {
      for (const locale of SUPPORTED_LOCALES) {
        const value = LOCALE_GLOSSARY[term][locale];
        expect(value, `${term}.${locale}`).toBeTruthy();
        expect(typeof value).toBe("string");
      }
    }
  });

  for (const term of CORE_TERMS) {
    test(`${term} has native labels in all locales`, () => {
      for (const locale of SUPPORTED_LOCALES) {
        expect(LOCALE_GLOSSARY[term][locale].length).toBeGreaterThan(0);
      }
    });
  }

  test("decision report labels match style guide", () => {
    expect(LOCALE_GLOSSARY.decisionReport.en).toBe("Decision report");
  });

  test("hidden loss labels match style guide", () => {
    expect(LOCALE_GLOSSARY.hiddenLoss.en).toBe("Hidden loss");
  });

  test("OEE stays untranslated with explanation note", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(LOCALE_GLOSSARY.oee[locale]).toBe("OEE");
    }
    expect(LOCALE_GLOSSARY.oee.note).toContain("Overall Equipment Effectiveness");
  });

  test("premium analyzer labels are distinct per locale", () => {
    const labels = SUPPORTED_LOCALES.map(
      (locale: SupportedLocale) => LOCALE_GLOSSARY.premiumAnalyzer[locale],
    );
    const unique = new Set(labels);
    expect(unique.size).toBe(labels.length);
  });
});
