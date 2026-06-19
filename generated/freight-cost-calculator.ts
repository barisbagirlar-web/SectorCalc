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
  dataConfidence?: number;
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
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Freight_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.is_hazardous ? 1 : 0) * input.accessorial_charges_usd; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = (input.is_hazardous ? 1 : 0) * input.accessorial_charges_usd * (1 + (input.fuel_surcharge_percent / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = (input.is_hazardous ? 1 : 0) * input.accessorial_charges_usd * (1 + (input.fuel_surcharge_percent / 100)) * (input.shipment_weight_kg); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.shipment_weight_kg; results["factor_shipment_weight_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_shipment_weight_kg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFreight_cost_calculator(input: Freight_cost_calculatorInput): Freight_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
