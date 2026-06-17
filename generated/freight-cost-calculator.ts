// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Freight_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.shipment_weight_kg + input.shipment_volume_cbm + input.distance_km; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.shipment_weight_kg + input.shipment_volume_cbm + input.distance_km; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFreight_cost_calculator(input: Freight_cost_calculatorInput): Freight_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
