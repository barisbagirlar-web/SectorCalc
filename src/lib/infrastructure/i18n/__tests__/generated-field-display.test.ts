import { describe, expect, test } from "vitest";
import { resolveGeneratedFieldDisplay, hasDistinctSchemaLocaleCopy } from "@/lib/infrastructure/i18n/generated-field-display";

describe("generated-field-display", () => {
  test("prefers distinct schema label_i18n over bundle fallback", () => {
    const display = resolveGeneratedFieldDisplay(
      "sample-calculator",
      {
        id: "width",
        label: "Width (mm)",
        label_i18n: {
          en: "Width (mm)",
          de: "Breite (mm)",
        },
        businessContext: "Part width",
        businessContext_i18n: {
          en: "Part width",
          de: "Teilbreite",
        },
      },
      "de",
    );

    expect(display.label).toBe("Breite (mm)");
    expect(display.helper).toBe("Teilbreite");
  });

  test("hasDistinctSchemaLocaleCopy detects localized schema slots", () => {
    expect(
      hasDistinctSchemaLocaleCopy(
        { en: "Width (mm)", de: "Breite (mm)" },
        "de",
      ),
    ).toBe(true);
    expect(
      hasDistinctSchemaLocaleCopy(
        { en: "Width (mm)", de: "Width (mm)" },
        "de",
      ),
    ).toBe(false);
  });
});
