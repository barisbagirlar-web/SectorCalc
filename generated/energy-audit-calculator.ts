// Auto-generated from energy-audit-calculator-schema.json
import * as z from 'zod';

export interface Energy_audit_calculatorInput {
  equipmentPower: number;
  operatingHours: number;
  loadFactor: number;
  costPerKWh: number;
  floorArea: number;
  emissionFactor: number;
}

export const Energy_audit_calculatorInputSchema = z.object({
  equipmentPower: z.number().default(50),
  operatingHours: z.number().default(2000),
  loadFactor: z.number().default(80),
  costPerKWh: z.number().default(0.12),
  floorArea: z.number().default(1000),
  emissionFactor: z.number().default(0.5),
});

function evaluateAllFormulas(input: Energy_audit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.equipmentPower * input.operatingHours * (input.loadFactor / 100); results["annualEnergyConsumption"] = Number.isFinite(v) ? v : 0; } catch { results["annualEnergyConsumption"] = 0; }
  try { const v = (results["annualEnergyConsumption"] ?? 0) * input.costPerKWh; results["totalEnergyCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalEnergyCost"] = 0; }
  try { const v = (results["annualEnergyConsumption"] ?? 0) / input.floorArea; results["energyIntensity"] = Number.isFinite(v) ? v : 0; } catch { results["energyIntensity"] = 0; }
  try { const v = (results["annualEnergyConsumption"] ?? 0) * input.emissionFactor; results["carbonFootprint"] = Number.isFinite(v) ? v : 0; } catch { results["carbonFootprint"] = 0; }
  return results;
}


export function calculateEnergy_audit_calculator(input: Energy_audit_calculatorInput): Energy_audit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalEnergyCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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


export interface Energy_audit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
