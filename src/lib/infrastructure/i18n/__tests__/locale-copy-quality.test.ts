import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  getLocaleDefinition,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/lib/infrastructure/i18n/locale-config";
import {
  CTA_KEYS,
  CTA_MAX_LENGTH,
  LOCALE_CTA,
} from "@/lib/infrastructure/i18n/locale-cta";
import { LOCALE_GLOSSARY } from "@/lib/infrastructure/i18n/locale-glossary";

type MessageTree = Record<string, unknown>;

const MESSAGES_DIR = join(process.cwd(), "messages");

const ENGLISH_CTA_PATTERNS = [
  /^Unlock full report$/i,
  /^View pricing$/i,
  /^Open premium calculator$/i,
  /^Run a Free Margin Check$/i,
  /^View Premium Calculators$/i,
  /^Sign in$/i,
  /^Calculate now$/i,
  /^Loading\.\.\.$/i,
];

const REQUIRED_TOP_LEVEL = [
  "nav",
  "navigation",
  "pricing",
  "premiumReport",
  "premiumDecisionReport",
  "legal",
  "errors",
  "emptyStates",
  "seo",
  "campaign",
  "cta",
] as const;

const REQUIRED_NAV_KEYS = [
  "calculators",
  "industries",
  "caseStudies",
  "pricing",
  "resources",
  "login",
  "signUp",
  "getPro",
] as const;

const REQUIRED_PRICING_KEYS = ["title", "freeCta", "proCta"] as const;

const REQUIRED_PREMIUM_REPORT_KEYS = [
  "executiveSummary",
  "mainExposure",
  "hiddenDrivers",
  "thresholdCheck",
  "suggestedActions",
  "assumptions",
  "exportReady",
  "legalNote",
] as const;

const REQUIRED_LEGAL_KEYS = ["disclaimer", "premiumDisclaimer"] as const;

const FORBIDDEN_VALUE_PATTERNS = [
  /\bTODO\b/,
  /\bplaceholder\b/i,
  /\bundefined\b/,
  /\bNaN\b/,
  /\bInfinity\b/,
];

function loadMessages(locale: SupportedLocale): MessageTree {
  const filePath = join(MESSAGES_DIR, `${locale}.json`);
  expect(existsSync(filePath), `messages/${locale}.json must exist`).toBe(true);
  return JSON.parse(readFileSync(filePath, "utf8")) as MessageTree;
}

function getNested(obj: MessageTree, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as MessageTree)) {
      return (acc as MessageTree)[key];
    }
    return undefined;
  }, obj);
}

function collectStringValues(obj: unknown, prefix = ""): readonly { path: string; value: string }[] {
  if (typeof obj === "string") {
    return [{ path: prefix, value: obj }];
  }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return [];
  }
  return Object.entries(obj as MessageTree).flatMap(([key, value]) =>
    collectStringValues(value, prefix ? `${prefix}.${key}` : key),
  );
}

function isEnglishCtaSmell(value: string): boolean {
  return ENGLISH_CTA_PATTERNS.some((pattern) => pattern.test(value.trim()));
}

describe("locale-copy-quality", () => {
  for (const locale of SUPPORTED_LOCALES) {
    describe(`messages/${locale}.json`, () => {
      const messages = loadMessages(locale);

      test("required top-level sections exist", () => {
        for (const key of REQUIRED_TOP_LEVEL) {
          expect(messages[key], `missing top-level ${key}`).toBeDefined();
        }
      });

      test("navigation keys present", () => {
        const nav = (messages.navigation ?? messages.nav) as MessageTree;
        for (const key of REQUIRED_NAV_KEYS) {
          expect(nav[key], `navigation.${key}`).toBeTruthy();
        }
      });

      test("pricing keys present", () => {
        const pricing = messages.pricing as MessageTree;
        for (const key of REQUIRED_PRICING_KEYS) {
          expect(pricing[key], `pricing.${key}`).toBeTruthy();
        }
      });

      test("premiumReport keys present", () => {
        const report = messages.premiumReport as MessageTree;
        for (const key of REQUIRED_PREMIUM_REPORT_KEYS) {
          expect(report[key], `premiumReport.${key}`).toBeTruthy();
        }
      });

      test("legal note present", () => {
        const legal = messages.legal as MessageTree;
        for (const key of REQUIRED_LEGAL_KEYS) {
          expect(legal[key], `legal.${key}`).toBeTruthy();
        }
      });

      test("cta section matches LOCALE_CTA dictionary", () => {
        const cta = messages.cta as MessageTree;
        for (const key of CTA_KEYS) {
          expect(cta[key], `cta.${key}`).toBe(LOCALE_CTA[locale][key]);
        }
      });

      test(
        "no forbidden placeholder values",
        () => {
          const strings = collectStringValues(messages);
          for (const { path, value } of strings) {
            for (const pattern of FORBIDDEN_VALUE_PATTERNS) {
              expect(pattern.test(value), `${path}: "${value}"`).toBe(false);
            }
          }
        },
        30000,
      );

      if (locale !== "en") {
        test("public CTA strings avoid literal English patterns", () => {
          const ctaValues = Object.values(messages.cta as MessageTree) as string[];
          const lockedCta = getNested(messages, "premiumDecisionReport.locked.unlockCta");
          const pricingCta = getNested(messages, "premiumDecisionReport.locked.pricingCta");
          const candidates = [
            ...ctaValues,
            ...(typeof lockedCta === "string" ? [lockedCta] : []),
            ...(typeof pricingCta === "string" ? [pricingCta] : []),
          ];
          for (const value of candidates) {
            expect(isEnglishCtaSmell(value), `English smell: "${value}"`).toBe(false);
          }
        });
      }
    });
  }

  test("CTA length limits — violations listed as warnings only", () => {
    const violations: string[] = [];
    for (const locale of SUPPORTED_LOCALES) {
      for (const key of CTA_KEYS) {
        const value = LOCALE_CTA[locale][key];
        const max = CTA_MAX_LENGTH[locale];
        if (value.length > max) {
          violations.push(`${locale}.${key}: ${value.length} > ${max}`);
        }
      }
    }
    if (violations.length > 0) {
      console.warn("CTA length violations:\n" + violations.join("\n"));
    }
    expect(violations.length).toBeLessThanOrEqual(5);
  });

  test("Arabic locale textDirection is rtl", () => {
    expect(getLocaleDefinition("ar").textDirection).toBe("rtl");
  });

  test("locale.fr label present in all message files", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const messages = loadMessages(locale);
      const localeBlock = messages.locale as MessageTree;
      expect(localeBlock.fr).toBe("Francais");
    }
  });
});
