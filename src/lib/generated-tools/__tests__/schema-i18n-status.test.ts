import { describe, expect, test } from "vitest";
import {
  buildSchemaI18nBackfillPayload,
  countInputsNeedingI18nBackfill,
  isGeneratedI18nComplete,
  mergeSchemaI18nBackfill,
  schemaNeedsI18nBackfill,
} from "@/lib/generated-tools/schema-i18n-status";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";

const completeI18n = {
  en: "Feed Rate",
  tr: "İlerleme Hızı",
  de: "Vorschubgeschwindigkeit",
  fr: "Vitesse d'avance",
  es: "Velocidad de avance",
  ar: "معدل التغذية",
};

const sampleSchema: GeneratedToolSchema = {
  toolName: "demo-calculator",
  inputs: [
    {
      id: "feedRate",
      label: "Feed Rate",
      type: "number",
      unit: "mm/min",
      businessContext: "Linear feed speed of the cutting tool.",
    },
    {
      id: "spindleSpeed",
      label: "Spindle Speed",
      label_i18n: {
        en: "Spindle Speed",
        tr: "Mil Devri",
        de: "Spindeldrehzahl",
        fr: "Vitesse broche",
        es: "Velocidad del husillo",
        ar: "سرعة المغزل",
      },
      type: "number",
      unit: "RPM",
      businessContext: "Rotational speed of the spindle.",
      businessContext_i18n: {
        en: "Rotational speed of the spindle.",
        tr: "Mil dönüş hızı.",
        de: "Rotationsgeschwindigkeit der Spindel.",
        fr: "Vitesse de rotation de la broche.",
        es: "Velocidad de rotación del husillo.",
        ar: "سرعة دوران المغزل.",
      },
    },
  ],
  validation: { rules: [], thresholds: {} },
  formulas: { total: "feedRate + spindleSpeed" },
  outputs: {
    primary: "total",
    breakdown: {},
    hiddenLossDrivers: [],
    suggestedActions: [],
    dataConfidenceAdjusted: "total",
  },
  premiumFeatures: [],
  premiumRequired: false,
};

describe("schema-i18n-status", () => {
  test("detects incomplete i18n", () => {
    expect(isGeneratedI18nComplete({ en: "Feed Rate" })).toBe(false);
    expect(isGeneratedI18nComplete(completeI18n)).toBe(true);
    expect(schemaNeedsI18nBackfill(sampleSchema)).toBe(true);
    expect(countInputsNeedingI18nBackfill(sampleSchema)).toBe(1);
  });

  test("buildSchemaI18nBackfillPayload includes only pending inputs", () => {
    expect(buildSchemaI18nBackfillPayload(sampleSchema)).toEqual({
      toolName: "demo-calculator",
      inputs: [
        {
          id: "feedRate",
          label: "Feed Rate",
          businessContext: "Linear feed speed of the cutting tool.",
        },
      ],
    });
  });

  test("mergeSchemaI18nBackfill patches matching inputs", () => {
    const merged = mergeSchemaI18nBackfill(sampleSchema, [
      {
        id: "feedRate",
        label_i18n: completeI18n,
        businessContext_i18n: {
          en: "Linear feed speed of the cutting tool.",
          tr: "Kesici takımın doğrusal ilerleme hızı.",
          de: "Lineare Vorschubgeschwindigkeit des Werkzeugs.",
          fr: "Vitesse d'avance linéaire de l'outil.",
          es: "Velocidad lineal de avance de la herramienta.",
          ar: "سرعة التغذية الخطية للأداة.",
        },
      },
    ]);

    expect(merged.inputs[0]?.label_i18n?.tr).toBe("İlerleme Hızı");
    expect(merged.inputs[1]?.label_i18n?.en).toBe("Spindle Speed");
    expect(schemaNeedsI18nBackfill(merged)).toBe(false);
  });
});
