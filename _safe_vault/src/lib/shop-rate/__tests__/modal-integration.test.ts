import { describe, expect, it } from "vitest";
import { mapShopRateRatesToFormValues } from "@/lib/machine-rate/input-mapping";
import { calculateShopRateHourlyCostCalculator } from "@/lib/shop-rate/modal-calculator";
import { extractShopRateSavedRates } from "@/lib/shop-rate/extract-rates";

describe("shop rate modal integration", () => {
  it("extracts hourly rate from calculator result", () => {
    const inputs = {
      directLaborCostPerHour: 25,
      overheadRate: 150,
      machineCostPerHour: 10,
      materialCostPerUnit: 5,
      productionRatePerHour: 10,
      defectRate: 2,
      utilizationRate: 85,
      profitMargin: 20,
      dataConfidence: "medium" as const,
    };

    const result = calculateShopRateHourlyCostCalculator(inputs);
    const rates = extractShopRateSavedRates(inputs, result);

    expect(rates.hourlyRate).toBeGreaterThan(0);
    expect(rates.energyCost).toBe(4.5);
    expect(rates.maintenanceCost).toBe(3.5);
    expect(rates.amortization).toBe(2);
    expect(rates.currency).toBe("USD");
  });

  it("maps calculated shop rate to parent form fields", () => {
    const mapped = mapShopRateRatesToFormValues(
      {
        hourlyRate: 120,
        energyCost: 8,
        maintenanceCost: 6,
        amortization: 4,
        currency: "USD",
      },
      {
        machineCostPerHour: "hourlyRate",
        energyCostPerHour: "energyCost",
        maintenanceCostPerHour: "maintenanceCost",
      },
    );

    expect(mapped).toEqual({
      machineCostPerHour: 120,
      energyCostPerHour: 8,
      maintenanceCostPerHour: 6,
    });
  });
});
