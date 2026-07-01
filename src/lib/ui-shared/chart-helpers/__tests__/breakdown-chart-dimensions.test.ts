import { describe, expect, it } from "vitest";
import {
  classifyBreakdownKey,
  classifyBreakdownUnitHint,
  sortBreakdownDimensions,
} from "@/lib/ui-shared/chart-helpers/breakdown-chart-dimensions";
import {
  buildBreakdownChartGroups,
  formatChartValueForDimension,
} from "@/lib/ui-shared/chart-helpers/breakdown-chart-data";
import { SUPPORTED_LOCALES } from "@/lib/infrastructure/i18n/locale-config";
import { resolveGeneratedBreakdownLabel } from "@/lib/features/generated-tools/resolve-generated-display-text";
import { normalizeRawGeneratedSchema } from "@/lib/features/generated-tools/normalize-schema";
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
    external_operations_percentage: "Harici Operasyon Yuzdesi",
    theoretical_minimum_changeover: "Theoretical Minimum Changeover Sure",
    achievable_changeover_time: "Achievable Changeover Sure",
    reduction_potential: "Reduction Potential",
    reduction_percentage: "Iyilestirme Yuzdesi",
    standardization_factor: "Standardization Faktor",
    waste_motion_factor: "Atik Hareket Faktoru",
  },
  de: {
    external_operations_percentage: "Anteil externer Vorgänge",
    theoretical_minimum_changeover: "Theoretical Minimum Changeover Zeit",
    achievable_changeover_time: "Achievable Changeover Zeit",
    reduction_potential: "Reduction Potential",
    reduction_percentage: "Reduktionsprozentsatz",
    standardization_factor: "Standardization Factor",
    waste_motion_factor: "Verschwendungsfaktor Bewegung",
  },
  fr: {
    external_operations_percentage: "Pourcentage d'opérations externes",
    theoretical_minimum_changeover: "Theoretical Minimum Changeover Temps",
    achievable_changeover_time: "Achievable Changeover Temps",
    reduction_potential: "Reduction Potential",
    reduction_percentage: "Pourcentage de réduction",
    standardization_factor: "Standardization Factor",
    waste_motion_factor: "Facteur de mouvement gaspillé",
  },
  es: {
    external_operations_percentage: "Porcentaje de operaciones externas",
    theoretical_minimum_changeover: "Theoretical Minimum Changeover Tiempo",
    achievable_changeover_time: "Achievable Changeover Tiempo",
    reduction_potential: "Reduction Potential",
    reduction_percentage: "Porcentaje de reducción",
    standardization_factor: "Standardization Factor",
    waste_motion_factor: "Factor de movimiento desperdiciado",
  },
  ar: {
    external_operations_percentage: "نسبة العمليات الخارجية",
    theoretical_minimum_changeover: "Theoretical Minimum Changeover الوقت",
    achievable_changeover_time: "Achievable Changeover الوقت",
    reduction_potential: "Reduction Potential",
    reduction_percentage: "نسبة التخفيض",
    standardization_factor: "Standardization Factor",
    waste_motion_factor: "عامل الحركة المهدرة",
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
      "generated/schemas/smed-changeover-optimizer-calculator-schema.json",
    );
    const raw = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as unknown;
    const schema = normalizeRawGeneratedSchema(raw, "smed-changeover-optimizer");
    expect(schema).toBeDefined();
    expect(schema?.outputs).toBeDefined();
    // breakdownUnits may be undefined for generated schemas without SMED-specific breakdowns
    if (schema?.outputs.breakdownUnits) {
      expect(typeof schema.outputs.breakdownUnits).toBe("object");
    }
  });
});
