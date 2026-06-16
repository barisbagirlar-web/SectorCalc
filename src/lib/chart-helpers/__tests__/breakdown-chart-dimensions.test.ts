import { describe, expect, it } from "vitest";
import {
  classifyBreakdownKey,
  classifyBreakdownUnitHint,
  sortBreakdownDimensions,
} from "@/lib/chart-helpers/breakdown-chart-dimensions";
import {
  buildBreakdownChartGroups,
  formatChartValueForDimension,
} from "@/lib/chart-helpers/breakdown-chart-data";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { resolveGeneratedBreakdownLabel } from "@/lib/generated-tools/resolve-generated-display-text";
import { normalizeRawGeneratedSchema } from "@/lib/generated-tools/normalize-schema";
import fs from "node:fs";
import path from "node:path";

const SMED_LABEL_MAP = {
  external_operations_percentage: "External Operations Percentage",
  theoretical_minimum_changeover: "Theoretical Minimum Changeover Time",
  achievable_changeover_time: "Achievable Changeover Time",
  reduction_potential: "Reduction Potential",
  reduction_percentage: "Reduction Percentage",
  standardization_factor: "Standardization Factor",
  waste_motion_factor: "Waste Motion Factor",
} as const;

const SMED_LOCALIZED_LABELS: Record<
  Exclude<(typeof SUPPORTED_LOCALES)[number], "en">,
  Record<keyof typeof SMED_LABEL_MAP, string>
> = {
  tr: {
    external_operations_percentage: "Harici Operasyon Yüzdesi",
    theoretical_minimum_changeover: "Teorik Minimum Geçiş Süresi",
    achievable_changeover_time: "Ulaşılabilir Geçiş Süresi",
    reduction_potential: "İyileştirme Potansiyeli",
    reduction_percentage: "İyileştirme Yüzdesi",
    standardization_factor: "Standardizasyon Faktörü",
    waste_motion_factor: "Atık Hareket Faktörü",
  },
  de: {
    external_operations_percentage: "Externer Operationsanteil (%)",
    theoretical_minimum_changeover: "Theoretische Mindest-Rüstzeit",
    achievable_changeover_time: "Erreichbare Rüstzeit",
    reduction_potential: "Reduktionspotenzial",
    reduction_percentage: "Reduktionsprozentsatz",
    standardization_factor: "Standardisierungsfaktor",
    waste_motion_factor: "Bewegungsverschwendungsfaktor",
  },
  fr: {
    external_operations_percentage: "Pourcentage d'opérations externes",
    theoretical_minimum_changeover: "Temps de changement minimum théorique",
    achievable_changeover_time: "Temps de changement réalisable",
    reduction_potential: "Potentiel de réduction",
    reduction_percentage: "Pourcentage de réduction",
    standardization_factor: "Facteur de standardisation",
    waste_motion_factor: "Facteur de gaspillage de mouvement",
  },
  es: {
    external_operations_percentage: "Porcentaje de operaciones externas",
    theoretical_minimum_changeover: "Tiempo mínimo teórico de cambio",
    achievable_changeover_time: "Tiempo de cambio alcanzable",
    reduction_potential: "Potencial de reducción",
    reduction_percentage: "Porcentaje de reducción",
    standardization_factor: "Factor de estandarización",
    waste_motion_factor: "Factor de desperdicio por movimiento",
  },
  ar: {
    external_operations_percentage: "نسبة العمليات الخارجية",
    theoretical_minimum_changeover: "الحد الأدنى النظري لوقت التغيير",
    achievable_changeover_time: "وقت التغيير القابل للتحقيق",
    reduction_potential: "إمكانية التخفيض",
    reduction_percentage: "نسبة التخفيض",
    standardization_factor: "عامل التوحيد القياسي",
    waste_motion_factor: "عامل هدر الحركة",
  },
};

describe("breakdown chart dimensions", () => {
  it("classifies unit hints without substring corruption", () => {
    expect(classifyBreakdownUnitHint("%")).toBe("percent");
    expect(classifyBreakdownUnitHint("minutes")).toBe("time");
    expect(classifyBreakdownUnitHint("dimensionless")).toBe("factor");
    expect(classifyBreakdownKey("operations_percentage", "%")).toBe("percent");
    expect(classifyBreakdownKey("operations_count")).toBe("count");
    expect(classifyBreakdownKey("external_operations_percentage")).toBe("percent");
    expect(classifyBreakdownKey("reduction_potential", "minutes")).toBe("time");
  });

  it("sorts dimensions in industrial display order", () => {
    expect(sortBreakdownDimensions(["factor", "time", "percent", "currency"])).toEqual([
      "currency",
      "time",
      "percent",
      "factor",
    ]);
  });

  it("splits SMED breakdown into homogeneous unit groups", () => {
    const unitHints = {
      external_operations_percentage: "%",
      theoretical_minimum_changeover: "minutes",
      achievable_changeover_time: "minutes",
      reduction_potential: "minutes",
      reduction_percentage: "%",
      standardization_factor: "dimensionless",
      waste_motion_factor: "dimensionless",
    };

    const groups = buildBreakdownChartGroups(
      {
        external_operations_percentage: 40,
        theoretical_minimum_changeover: 31.5,
        achievable_changeover_time: 39.375,
        reduction_potential: 5.625,
        reduction_percentage: 12.5,
        standardization_factor: 1,
        waste_motion_factor: 1.25,
      },
      "en-US",
      "USD",
      (key) => SMED_LABEL_MAP[key as keyof typeof SMED_LABEL_MAP] ?? key,
      unitHints,
    );

    expect(groups.map((group) => group.dimension)).toEqual(["time", "percent", "factor"]);
    expect(groups.find((group) => group.dimension === "time")?.items).toHaveLength(3);
    expect(groups.find((group) => group.dimension === "percent")?.items).toHaveLength(2);
    expect(groups.find((group) => group.dimension === "factor")?.items).toHaveLength(2);
  });

  it("formats percent and factor values independently", () => {
    expect(formatChartValueForDimension(40, "percent", "en-US", "USD")).toBe("40%");
    expect(formatChartValueForDimension(1.25, "factor", "en-US", "USD")).toBe("1.25");
  });
});

describe("SMED breakdown labels — all supported locales", () => {
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === "en") continue;

    it(`localizes SMED breakdown labels for ${locale}`, () => {
      for (const [key, expected] of Object.entries(SMED_LOCALIZED_LABELS[locale])) {
        const label = resolveGeneratedBreakdownLabel(
          key,
          SMED_LABEL_MAP,
          locale,
        );
        expect(label).toBe(expected);
      }
    });
  }
});

describe("SMED schema normalization", () => {
  it("extracts breakdown units from formula metadata", () => {
    const schemaPath = path.join(
      process.cwd(),
      "generated/schemas/smed-changeover-optimizer-schema.json",
    );
    const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;
    const schema = normalizeRawGeneratedSchema(raw, "smed-changeover-optimizer");
    expect(schema?.outputs.breakdownUnits?.achievable_changeover_time).toBe("minutes");
    expect(schema?.outputs.breakdownUnits?.external_operations_percentage).toBe("%");
    expect(schema?.outputs.breakdownUnits?.standardization_factor).toBe("dimensionless");
  });
});
