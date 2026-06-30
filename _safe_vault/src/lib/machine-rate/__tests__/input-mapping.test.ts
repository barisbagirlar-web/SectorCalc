import { describe, expect, it } from "vitest";
import {
  buildMachineInputMapping,
  hasMachineRateMappableInputs,
  mapMachineToFormValues,
} from "@/lib/machine-rate/input-mapping";
import { DEMO_MACHINE_RECORDS } from "@/lib/machine-rate/types";

describe("machine-rate input mapping", () => {
  it("detects mappable tool inputs", () => {
    expect(hasMachineRateMappableInputs(["machineCostPerHour", "quantity"])).toBe(true);
    expect(hasMachineRateMappableInputs(["quantity", "scrapRate"])).toBe(false);
  });

  it("builds input mapping from tool schema ids", () => {
    expect(
      buildMachineInputMapping([
        "energyCostPerHour",
        "maintenanceCostPerHour",
        "quantity",
      ]),
    ).toEqual({
      energyCostPerHour: "energyCost",
      maintenanceCostPerHour: "maintenanceCost",
    });
  });

  it("maps machine profile fields to matching form inputs only", () => {
    const machine = DEMO_MACHINE_RECORDS[0];
    const mapped = mapMachineToFormValues(machine, {
      machineHourlyCost: "hourlyRate",
      maintenanceCostPerHour: "maintenanceCost",
    });

    expect(mapped).toEqual({
      machineHourlyCost: machine.hourlyRate,
      maintenanceCostPerHour: machine.maintenanceCost,
    });
  });
});
