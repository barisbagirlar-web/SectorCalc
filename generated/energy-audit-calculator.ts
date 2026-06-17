// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Energy_audit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.equipmentPower * input.operatingHours * (input.loadFactor / 100); results["annualEnergyConsumption"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualEnergyConsumption"] = 0; }
  try { const v = (asFormulaNumber(results["annualEnergyConsumption"])) * input.costPerKWh; results["totalEnergyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalEnergyCost"] = 0; }
  try { const v = (asFormulaNumber(results["annualEnergyConsumption"])) / input.floorArea; results["energyIntensity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["energyIntensity"] = 0; }
  try { const v = (asFormulaNumber(results["annualEnergyConsumption"])) * input.emissionFactor; results["carbonFootprint"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbonFootprint"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEnergy_audit_calculator(input: Energy_audit_calculatorInput): Energy_audit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalEnergyCost"]);
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


export interface Energy_audit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
