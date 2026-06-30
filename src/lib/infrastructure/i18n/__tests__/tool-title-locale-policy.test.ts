import { describe, expect, it } from "vitest";
import {
  isLocalizedToolTitle,
  resolveSchemaEnglishTitle,
  titleNeedsLocaleTranslation,
} from "@/lib/infrastructure/i18n/tool-title-locale-policy";

describe("tool-title-locale-policy", () => {
  it("humanizes slug-only schemas into English calculator titles", () => {
    expect(resolveSchemaEnglishTitle("anderson-darling-test", {})).toBe(
      "Anderson Darling Test Calculator",
    );
    expect(resolveSchemaEnglishTitle("chemical-equation-balancer-calculator", {})).toBe(
      "Chemical Equation Balancer",
    );
  });

  it("accepts glossary-translated titles without diacritics", () => {
    expect(isLocalizedToolTitle("Kimyasal Denklem Dengeleyici", "tr")).toBe(true);
    expect(isLocalizedToolTitle("Leasing vs. Kauf Vergleichsrechner", "de")).toBe(true);
    expect(isLocalizedToolTitle("Optimiseur de matrice de changement", "fr")).toBe(true);
    expect(isLocalizedToolTitle("Veredicto de cumplimiento CBAM", "es")).toBe(true);
  });

  it("flags missing or English-identical locale slots", () => {
    const entry = {
      en: "Margin Calculator",
      tr: "Margin Calculator",
      de: "Margin Rechner",
    };
    expect(titleNeedsLocaleTranslation(entry, "tr", entry.en)).toBe(true);
    expect(titleNeedsLocaleTranslation(entry, "de", entry.en)).toBe(false);
    expect(titleNeedsLocaleTranslation(entry, "fr", entry.en)).toBe(true);
  });
});
