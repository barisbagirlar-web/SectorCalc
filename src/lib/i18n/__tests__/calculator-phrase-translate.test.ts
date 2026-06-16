import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";
import { resolveGeneratedBreakdownLabel } from "@/lib/generated-tools/resolve-generated-display-text";

const BREAKDOWN_LABEL_MAP = {
  cutting_time: "Cutting Time",
  tool_change_downtime: "Tool Change Downtime",
  spindle_speed: "Spindle Speed",
  tool_change_frequency: "Tool Change Frequency",
} as const;

const LOCALIZED_BREAKDOWN: Record<
  Exclude<(typeof SUPPORTED_LOCALES)[number], "en">,
  Record<keyof typeof BREAKDOWN_LABEL_MAP, string>
> = {
  tr: {
    cutting_time: "Kesme Süresi",
    tool_change_downtime: "Takım Değiştirme Duruşu",
    spindle_speed: "İş Mili Hızı",
    tool_change_frequency: "Takım Değiştirme Sıklığı",
  },
  de: {
    cutting_time: "Schnittzeit",
    tool_change_downtime: "Werkzeugwechsel-Ausfallzeit",
    spindle_speed: "Spindeldrehzahl",
    tool_change_frequency: "Werkzeugwechsel-Häufigkeit",
  },
  fr: {
    cutting_time: "Temps de coupe",
    tool_change_downtime: "Temps d'arrêt de changement d'outil",
    spindle_speed: "Vitesse de broche",
    tool_change_frequency: "Fréquence de changement d'outil",
  },
  es: {
    cutting_time: "Tiempo de corte",
    tool_change_downtime: "Tiempo de inactividad por cambio de herramienta",
    spindle_speed: "Velocidad del husillo",
    tool_change_frequency: "Frecuencia de cambio de herramienta",
  },
  ar: {
    cutting_time: "وقت القطع",
    tool_change_downtime: "وقت التوقف لتغيير الأداة",
    spindle_speed: "سرعة المغزل",
    tool_change_frequency: "تكرار تغيير الأداة",
  },
};

const SELECT_OPTIONS: Record<
  Exclude<(typeof SUPPORTED_LOCALES)[number], "en">,
  Record<string, string>
> = {
  tr: { "CNC Lathe": "CNC Torna", "CNC Mill": "CNC Freze", "Multi-Axis": "Çok Eksenli" },
  de: {
    "CNC Lathe": "CNC-Drehmaschine",
    "CNC Mill": "CNC-Fräsmaschine",
    "Multi-Axis": "Mehrachsig",
  },
  fr: { "CNC Lathe": "Tour CNC", "CNC Mill": "Fraiseuse CNC", "Multi-Axis": "Multi-axes" },
  es: { "CNC Lathe": "Torno CNC", "CNC Mill": "Fresadora CNC", "Multi-Axis": "Multieje" },
  ar: { "CNC Lathe": "مخرطة CNC", "CNC Mill": "آلة تفريز CNC", "Multi-Axis": "متعدد المحاور" },
};

const HIDDEN_LOSS_DRIVERS = [
  "Excessive Tool Changes",
  "Low Spindle Utilization",
  "Non-Optimal Feed Rate",
] as const;

const SUGGESTED_ACTIONS = [
  "Increase Feed Rate",
  "Enable High Feed Strategy",
  "Optimize Tool Life",
  "Reduce Number of Passes",
] as const;

describe("translateCalculatorPhrase — machining surface + drivers", () => {
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === "en") continue;

    it(`localizes machining breakdown labels for ${locale}`, () => {
      for (const [key, expected] of Object.entries(LOCALIZED_BREAKDOWN[locale])) {
        const label = resolveGeneratedBreakdownLabel(
          key,
          BREAKDOWN_LABEL_MAP,
          locale,
        );
        expect(label).toBe(expected);
      }
    });

    it(`localizes machine type select labels for ${locale}`, () => {
      for (const [english, expected] of Object.entries(SELECT_OPTIONS[locale])) {
        expect(translateCalculatorPhrase(english, locale)).toBe(expected);
      }
    });

    it(`removes residue word 'affects' for ${locale}`, () => {
      const translated = translateCalculatorPhrase(
        "ISO 3685 standard for tool life; affects surface finish and cycle time.",
        locale,
      );
      expect(translated.toLowerCase()).not.toContain("affects");
    });

    it(`localizes hidden loss drivers for ${locale}`, () => {
      for (const english of HIDDEN_LOSS_DRIVERS) {
        const translated = translateCalculatorPhrase(english, locale);
        expect(translated).not.toBe(english);
      }
    });

    it(`localizes suggested actions for ${locale}`, () => {
      for (const english of SUGGESTED_ACTIONS) {
        const translated = translateCalculatorPhrase(english, locale);
        expect(translated).not.toBe(english);
      }
    });
  }
});

describe("translateCalculatorPhrase — SMED breakdown labels", () => {
  const SMED_LABEL_MAP = {
    external_operations_percentage: "External Operations Percentage",
    waste_motion_factor: "Waste Motion Factor",
    reduction_percentage: "Reduction Percentage",
  } as const;

  it("does not corrupt operations/percentage substrings in Turkish", () => {
    expect(
      resolveGeneratedBreakdownLabel(
        "external_operations_percentage",
        SMED_LABEL_MAP,
        "tr",
      ),
    ).toBe("Harici Operasyon Yüzdesi");
    expect(
      resolveGeneratedBreakdownLabel("waste_motion_factor", SMED_LABEL_MAP, "tr"),
    ).toBe("Atık Hareket Faktörü");
    expect(
      resolveGeneratedBreakdownLabel("reduction_percentage", SMED_LABEL_MAP, "tr"),
    ).toBe("İyileştirme Yüzdesi");
  });
});

