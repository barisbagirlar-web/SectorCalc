import { describe, expect, test } from "vitest";
import {
  getActiveLocales,
  getLocaleDefinition,
  LOCALE_DEFINITIONS,
  ROOT_LOCALE,
  SUPPORTED_LOCALES,
} from "@/lib/i18n/locale-config";

describe("locale-config", () => {
  test("SUPPORTED_LOCALES contains en", () => {
    expect([...SUPPORTED_LOCALES]).toEqual(["en"]);
  });

  test("en isRoot true and pathPrefix empty", () => {
    expect(getLocaleDefinition("en").isRoot).toBe(true);
    expect(getLocaleDefinition("en").pathPrefix).toBe("");
  });

  test("getActiveLocales returns all supported locales", () => {
    expect(getActiveLocales()).toEqual(SUPPORTED_LOCALES);
  });

  test("ROOT_LOCALE is en", () => {
    expect(ROOT_LOCALE).toBe("en");
    expect(LOCALE_DEFINITIONS.en.isRoot).toBe(true);
  });
});
