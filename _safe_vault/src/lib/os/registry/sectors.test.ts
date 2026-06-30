import { describe, expect, test } from "vitest";
import {
  IndustrialRegistry,
  SmartModuleIds,
  SectorRegistry,
  getSectorEntry,
  hasExpertFeature,
  hasSectorSmartModule,
  listSectorSmartModules,
} from "@/lib/os/registry/sectors";

describe("SmartModules sector integration", () => {
  test("cnc enables full manufacturing intelligence stack", () => {
    const entry = getSectorEntry("cnc");

    expect(hasSectorSmartModule(entry, SmartModuleIds.hidden_loss)).toBe(true);
    expect(hasSectorSmartModule(entry, SmartModuleIds.energy_opt)).toBe(true);
    expect(hasSectorSmartModule(entry, SmartModuleIds.carbon_cbam)).toBe(true);
    expect(hasSectorSmartModule(entry, SmartModuleIds.benchmarking)).toBe(true);
    expect(listSectorSmartModules(entry)).toHaveLength(7);
  });

  test("logistics enables routing and compliance modules", () => {
    const entry = getSectorEntry("logistics");

    expect(hasSectorSmartModule(entry, SmartModuleIds.deadhead)).toBe(true);
    expect(hasSectorSmartModule(entry, SmartModuleIds.compliance)).toBe(true);
    expect(hasSectorSmartModule(entry, SmartModuleIds.fiscal_multi)).toBe(true);
    expect(hasExpertFeature(entry, "hiddenLoss")).toBe(false);
  });

  test("agriculture uses soil and seasonal modules without decision support", () => {
    const entry = getSectorEntry("agriculture");

    expect(hasSectorSmartModule(entry, SmartModuleIds.soil_nutrients)).toBe(true);
    expect(hasSectorSmartModule(entry, SmartModuleIds.seasonal_loss)).toBe(true);
    expect(hasSectorSmartModule(entry, SmartModuleIds.decision_support)).toBe(false);
    expect(hasSectorSmartModule(entry, SmartModuleIds.benchmarking)).toBe(false);
  });

  test("all 27 sectors define smart module features", () => {
    expect(Object.keys(SectorRegistry)).toHaveLength(27);

    for (const key of Object.keys(IndustrialRegistry)) {
      const entry = getSectorEntry(key as keyof typeof SectorRegistry);
      expect(entry.features.length).toBeGreaterThan(0);
      expect(entry.features).toEqual(IndustrialRegistry[key as keyof typeof IndustrialRegistry].features);
    }
  });
});
