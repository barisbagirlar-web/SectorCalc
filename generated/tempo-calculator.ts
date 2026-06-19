// Auto-generated from tempo-calculator-schema.json
import * as z from 'zod';

export interface Tempo_calculatorInput {
  availableTimePerShift: number;
  shiftsPerDay: number;
  demandPerDay: number;
  efficiencyFactor: number;
  dataConfidence?: number;
}

export const Tempo_calculatorInputSchema = z.object({
  availableTimePerShift: z.number().default(8),
  shiftsPerDay: z.number().default(1),
  demandPerDay: z.number().default(1000),
  efficiencyFactor: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tempo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.availableTimePerShift * input.shiftsPerDay * 3600 * input.efficiencyFactor / 100) / input.demandPerDay; results["taktTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taktTime"] = 0; }
  try { const v = input.demandPerDay / (input.availableTimePerShift * input.shiftsPerDay * input.efficiencyFactor / 100); results["tempoHour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tempoHour"] = 0; }
  try { const v = input.availableTimePerShift * input.shiftsPerDay * 3600 * input.efficiencyFactor / 100; results["netTimeSeconds"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netTimeSeconds"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTempo_calculator(input: Tempo_calculatorInput): Tempo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["taktTime"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Tempo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
