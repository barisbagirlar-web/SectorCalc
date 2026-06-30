import type { GeneratedToolResult } from "@/lib/features/generated-tools/types";
import type { ShopRateSavedRates } from "@/lib/features/shop-rate/types";
import type { ShopRateHourlyCostCalculatorInput } from "@/lib/features/shop-rate/modal-calculator";

const MACHINE_COST_SPLIT = {
  energy: 0.45,
  maintenance: 0.35,
  amortization: 0.2,
} as const;

export function extractShopRateSavedRates(
  inputs: Record<string, unknown>,
  result: GeneratedToolResult,
): ShopRateSavedRates {
  const parsedInputs = inputs as Partial<ShopRateHourlyCostCalculatorInput>;
  const machineCostPerHour = Number(parsedInputs.machineCostPerHour) || 0;
  const shopRatePerHour = Number(result.shopRatePerHour);
  const adjustedRate = Number(result.dataConfidenceAdjusted);
  const hourlyRate =
    Number.isFinite(adjustedRate) && adjustedRate > 0
      ? adjustedRate
      : Number.isFinite(shopRatePerHour)
        ? shopRatePerHour
        : 0;

  return {
    hourlyRate,
    energyCost: machineCostPerHour * MACHINE_COST_SPLIT.energy,
    maintenanceCost: machineCostPerHour * MACHINE_COST_SPLIT.maintenance,
    amortization: machineCostPerHour * MACHINE_COST_SPLIT.amortization,
    currency: "USD",
  };
}
