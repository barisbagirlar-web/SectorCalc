import { describe, expect, test } from "vitest";
import {
  normalizeGeneratedI18nText,
  resolveGeneratedI18nText,
} from "@/lib/generated-tools/resolve-i18n-text";

describe("resolve-i18n-text", () => {
  test("normalizeGeneratedI18nText falls back to English label", () => {
    expect(normalizeGeneratedI18nText(undefined, "Feed Rate")).toEqual({
      en: "Feed Rate",
    });
  });

  test("normalizeGeneratedI18nText keeps provided locales", () => {
    expect(
      normalizeGeneratedI18nText(
        { en: "Feed Rate", tr: "İlerleme Hızı" },
        "Feed Rate",
      ),
    ).toEqual({
      en: "Feed Rate",
      tr: "İlerleme Hızı",
    });
  });

  test("resolveGeneratedI18nText prefers active locale", () => {
    const i18n = normalizeGeneratedI18nText(
      {
        en: "Cutting Length",
        tr: "Kesme Uzunluğu",
        de: "Schnittlänge",
      },
      "Cutting Length",
    );

    expect(resolveGeneratedI18nText(i18n, "tr", "Cutting Length")).toBe(
      "Kesme Uzunluğu",
    );
    expect(resolveGeneratedI18nText(i18n, "de", "Cutting Length")).toBe(
      "Schnittlänge",
    );
  });

  test("resolveGeneratedI18nText falls back to English then legacy label", () => {
    const i18n = normalizeGeneratedI18nText({ en: "Spindle Speed" }, "Spindle Speed");

    expect(resolveGeneratedI18nText(i18n, "fr", "Spindle Speed")).toBe(
      "Spindle Speed",
    );
    expect(resolveGeneratedI18nText(undefined, "tr", "Legacy Label")).toBe(
      "Legacy Label",
    );
  });
});
