import { describe, expect, test } from "vitest";
import {
  getActiveLocales,
  getLocaleDefinition,
  LOCALE_DEFINITIONS,
  ROOT_LOCALE,
  SUPPORTED_LOCALES,
} from "@/lib/i18n/locale-config";

describe("locale-config", () => {
  test("SUPPORTED_LOCALES en,tr,de,fr,es,ar içerir", () => {
    expect([...SUPPORTED_LOCALES]).toEqual(["en", "tr", "de", "fr", "es", "ar"]);
  });

  test("en isRoot true ve pathPrefix empty", () => {
    expect(getLocaleDefinition("en").isRoot).toBe(true);
    expect(getLocaleDefinition("en").pathPrefix).toBe("");
  });

  test("tr pathPrefix /tr", () => {
    expect(getLocaleDefinition("tr").pathPrefix).toBe("/tr");
  });

  test("de pathPrefix /de", () => {
    expect(getLocaleDefinition("de").pathPrefix).toBe("/de");
  });

  test("fr pathPrefix /fr", () => {
    expect(getLocaleDefinition("fr").pathPrefix).toBe("/fr");
  });

  test("es pathPrefix /es", () => {
    expect(getLocaleDefinition("es").pathPrefix).toBe("/es");
  });

  test("ar pathPrefix /ar", () => {
    expect(getLocaleDefinition("ar").pathPrefix).toBe("/ar");
  });

  test("ar textDirection rtl", () => {
    expect(getLocaleDefinition("ar").textDirection).toBe("rtl");
  });

  test("de/fr/es currency EUR", () => {
    expect(getLocaleDefinition("de").currency).toBe("EUR");
    expect(getLocaleDefinition("fr").currency).toBe("EUR");
    expect(getLocaleDefinition("es").currency).toBe("EUR");
  });

  test("tr currency TRY", () => {
    expect(getLocaleDefinition("tr").currency).toBe("TRY");
  });

  test("getActiveLocales returns all supported locales", () => {
    expect(getActiveLocales()).toEqual(SUPPORTED_LOCALES);
  });

  test("ROOT_LOCALE is en", () => {
    expect(ROOT_LOCALE).toBe("en");
    expect(LOCALE_DEFINITIONS.en.isRoot).toBe(true);
  });
});
