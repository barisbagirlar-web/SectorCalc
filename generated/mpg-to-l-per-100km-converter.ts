// Auto-generated from mpg-to-l-per-100km-converter-schema.json
import * as z from 'zod';

export interface Mpg_to_l_per_100km_converterInput {
  mpg_value: number;
  fuel_type: string;
  driving_cycle: string;
  annual_mileage: number;
  fuel_price_per_gallon: number;
  co2_per_gallon: number;
}

export const Mpg_to_l_per_100km_converterInputSchema = z.object({
  mpg_value: z.number().min(1).max(100).default(25),
  fuel_type: z.enum(['gasoline', 'diesel', 'ethanol', 'biodiesel']).default('gasoline'),
  driving_cycle: z.enum(['city', 'highway', 'combined']).default('combined'),
  annual_mileage: z.number().min(0).max(200000).default(12000),
  fuel_price_per_gallon: z.number().min(0.5).max(10).default(3.5),
  co2_per_gallon: z.number().min(0).max(15).default(8.887),
});

function evaluateAllFormulas(input: Mpg_to_l_per_100km_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["l_per_100km"] = 235.214583 / input.mpg_value; } catch { results["l_per_100km"] = 0; }
  try { results["annual_fuel_consumption"] = input.annual_mileage / input.mpg_value; } catch { results["annual_fuel_consumption"] = 0; }
  try { results["annual_fuel_cost"] = annual_fuel_gallons * input.fuel_price_per_gallon; } catch { results["annual_fuel_cost"] = 0; }
  try { results["annual_co2_emissions"] = annual_fuel_gallons * input.co2_per_gallon; } catch { results["annual_co2_emissions"] = 0; }
  try { results["annual_co2_tonnes"] = annual_co2_kg / 1000; } catch { results["annual_co2_tonnes"] = 0; }
  try { results["efficiency_loss_factor"] = Math.max(0, (40 - input.mpg_value) / 40) * 100; } catch { results["efficiency_loss_factor"] = 0; }
  try { results["environmental_loss_index"] = ((results["l_per_100km"] ?? 0) / 20) * 50 + ((results["annual_co2_tonnes"] ?? 0) / 10) * 50; } catch { results["environmental_loss_index"] = 0; }
  return results;
}


export function calculateMpg_to_l_per_100km_converter(input: Mpg_to_l_per_100km_converterInput): Mpg_to_l_per_100km_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["l_per_100km"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Driving Cycle Penalty","Fuel Type Energy Density","Vehicle Age Efficiency Degradation","Tire Pressure Deviation"];
  const suggestedActions: string[] = ["Optimise Driving Behaviour","Switch to Alternative Fuel","Regular Maintenance","Route Optimisation"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against fleet averages","Real-time dashboard integration"],
  };
}


export interface Mpg_to_l_per_100km_converterOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
