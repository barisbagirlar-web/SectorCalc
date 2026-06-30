import { describe, expect, it } from "vitest";
import {
  DEFAULT_EMISSION_FACTORS,
  emissionFactorsToCalculationMap,
  mergeEmissionFactorLists,
} from "@/lib/features/emission-factors";
import { DEFAULT_CARBON_EMISSION_FACTOR_MAP } from "@/lib/features/carbon/carbon-footprint-report";

describe("emission factors", () => {
  it("merges user overrides onto global factors", () => {
    const merged = mergeEmissionFactorLists(DEFAULT_EMISSION_FACTORS, [
      {
        category: "electricity",
        factor: 0.55,
        lastUpdated: new Date("2025-01-01T00:00:00.000Z"),
      },
    ]);

    const electricity = merged.find((factor) => factor.category === "electricity");
    expect(electricity?.factor).toBe(0.55);
    expect(electricity?.source).toBe("custom");
    expect(electricity?.unit).toBe("kWh");
  });

  it("maps emission factor list to calculation map keys", () => {
    const map = emissionFactorsToCalculationMap([
      ...DEFAULT_EMISSION_FACTORS,
      {
        category: "freight_road",
        unit: "tkm",
        factor: 0.12,
        source: "custom",
        lastUpdated: new Date(),
      },
    ]);

    expect(map.freightRoad).toBe(0.12);
    expect(map.electricity).toBe(DEFAULT_CARBON_EMISSION_FACTOR_MAP.electricity);
  });
});
