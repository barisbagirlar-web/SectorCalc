import { describe, expect, test } from "vitest";
import {
  SmartModuleIds,
  SmartModules,
  smartModulesToExpertFeatures,
} from "@/lib/os/registry/smart-modules";

describe("SmartModules catalog", () => {
  test("every module id has a display label", () => {
    for (const id of Object.values(SmartModuleIds)) {
      expect(SmartModules[id]).toBeTruthy();
    }
  });

  test("smartModulesToExpertFeatures maps intelligence flags", () => {
    const flags = smartModulesToExpertFeatures([
      SmartModuleIds.decision_support,
      SmartModuleIds.hidden_loss,
      SmartModuleIds.deadhead,
      SmartModuleIds.carbon_cbam,
    ]);

    expect(flags.decisionSupport).toBe(true);
    expect(flags.hiddenLoss).toBe(true);
    expect(flags.deadhead).toBe(true);
    expect(flags.carbonCbam).toBe(true);
    expect(flags.benchmarking).toBe(false);
  });
});
