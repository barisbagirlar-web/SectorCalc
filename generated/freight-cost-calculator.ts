// Auto-generated from freight-cost-calculator-schema.json
import * as z from 'zod';

export interface Freight_cost_calculatorInput {
  shipment_weight_kg: number;
  shipment_volume_cbm: number;
  distance_km: number;
  transport_mode: string;
  fuel_surcharge_percent: number;
  accessorial_charges_usd: number;
  density_factor: number;
  is_hazardous: boolean;
  is_expedited: boolean;
}

export const Freight_cost_calculatorInputSchema = z.object({
  shipment_weight_kg: z.number().min(0).max(50000).default(100),
  shipment_volume_cbm: z.number().min(0).max(200).default(1),
  distance_km: z.number().min(0).max(20000).default(500),
  transport_mode: z.enum(['FTL', 'LTL', 'Air', 'Rail', 'Ocean']).default('FTL'),
  fuel_surcharge_percent: z.number().min(0).max(50).default(15),
  accessorial_charges_usd: z.number().min(0).max(5000).default(50),
  density_factor: z.number().min(10).max(5000).default(100),
  is_hazardous: z.boolean().default(false),
  is_expedited: z.boolean().default(false),
});

function evaluateAllFormulas(input: Freight_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["dimensional_weight"] = (Math.round((input.shipment_volume_cbm * 167) * 10**(1)) / 10**(1)); } catch { results["dimensional_weight"] = 0; }
  try { results["chargeable_weight"] = Math.max(input.shipment_weight_kg, (results["dimensional_weight"] ?? 0)); } catch { results["chargeable_weight"] = 0; }
  results["base_freight_rate"] = 0;
  try { results["fuel_surcharge_amount"] = (Math.round((base_freight_cost * (input.fuel_surcharge_percent / 100)) * 10**(2)) / 10**(2)); } catch { results["fuel_surcharge_amount"] = 0; }
  try { results["hazardous_premium"] = ((input.is_hazardous == true) ? ((results["chargeable_weight"] ?? 0) * 0.10) : (0)); } catch { results["hazardous_premium"] = 0; }
  try { results["expedite_multiplier"] = ((input.is_expedited == true) ? (1.5) : (1.0)); } catch { results["expedite_multiplier"] = 0; }
  try { results["total_freight_cost"] = (Math.round(((base_freight_cost + (results["fuel_surcharge_amount"] ?? 0) + (results["hazardous_premium"] ?? 0) + input.accessorial_charges_usd) * (results["expedite_multiplier"] ?? 0)) * 10**(2)) / 10**(2)); } catch { results["total_freight_cost"] = 0; }
  return results;
}


export function calculateFreight_cost_calculator(input: Freight_cost_calculatorInput): Freight_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_freight_cost"] ?? 0;
  const breakdown = {
    base_freight_cost: values["base_freight_cost"] ?? 0,
    fuel_surcharge_amount: values["fuel_surcharge_amount"] ?? 0,
    hazardous_premium: values["hazardous_premium"] ?? 0,
    accessorial_charges_usd: values["accessorial_charges_usd"] ?? 0,
    expedite_multiplier: values["expedite_multiplier"] ?? 0,
    chargeable_weight: values["chargeable_weight"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Empty Miles Factor","Dwell Time (hours)","Packaging Inefficiency"];
  const suggestedActions: string[] = ["Consolidate Shipments","Optimize Packaging Density","Audit Accessorial Charges","Evaluate Modal Shift"];
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
    premiumFeatures: [],
  };
}


export interface Freight_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { base_freight_cost: number; fuel_surcharge_amount: number; hazardous_premium: number; accessorial_charges_usd: number; expedite_multiplier: number; chargeable_weight: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
