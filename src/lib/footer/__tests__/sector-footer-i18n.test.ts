import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { FOOTER_PLATFORM_NAV } from "@/config/site";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";

type MessageTree = Record<string, unknown>;

const MESSAGES_DIR = join(process.cwd(), "messages");
const FOOTER_PLATFORM_NAV_KEYS = FOOTER_PLATFORM_NAV.map((item) => item.key);

function loadMessages(locale: string): MessageTree {
  return JSON.parse(readFileSync(join(MESSAGES_DIR, `${locale}.json`), "utf8")) as MessageTree;
}

function sectorFooterKeys(messages: MessageTree): string[] {
  const sectorFooter = messages.sectorFooter;
  expect(sectorFooter).toBeTruthy();
  return Object.keys(sectorFooter as MessageTree);
}

function navMessages(locale: string): Record<string, string> {
  const nav = loadMessages(locale).nav;
  expect(nav).toBeTruthy();
  return nav as Record<string, string>;
}

describe("sector footer i18n (6 locales)", () => {
  const requiredSectorFooterKeys = sectorFooterKeys(loadMessages("en"));

  test("SUPPORTED_LOCALES matches project standard", () => {
    expect([...SUPPORTED_LOCALES]).toEqual(["en", "tr", "de", "fr", "es", "ar"]);
  });

  for (const locale of SUPPORTED_LOCALES) {
    test(`${locale}: sectorFooter keys complete`, () => {
      const keys = sectorFooterKeys(loadMessages(locale));
      expect(keys.sort()).toEqual(requiredSectorFooterKeys.sort());
    });

    test(`${locale}: platform nav labels localized and non-empty`, () => {
      const nav = navMessages(locale);
      for (const key of FOOTER_PLATFORM_NAV_KEYS) {
        const value = nav[key];
        expect(typeof value).toBe("string");
        expect(value.trim().length).toBeGreaterThan(0);
      }
    });

    if (locale !== "en") {
      test(`${locale}: platform nav labels differ from English`, () => {
        const enNav = navMessages("en");
        const localeNav = navMessages(locale);
        for (const key of FOOTER_PLATFORM_NAV_KEYS) {
          expect(localeNav[key]).not.toBe(enNav[key]);
        }
      });
    }
  }
});
