// Auto-generated from solar-panel-calculator-schema.json
import * as z from 'zod';

export interface Solar_panel_calculatorInput {
  panelArea: number;
  panelEfficiency: number;
  solarIrradiance: number;
  systemLosses: number;
  tiltAngle: number;
  azimuthAngle: number;
  latitude: number;
  annualSunHours: number;
  dataConfidence?: number;
}

export const Solar_panel_calculatorInputSchema = z.object({
  panelArea: z.number().default(1.6),
  panelEfficiency: z.number().default(18),
  solarIrradiance: z.number().default(1000),
  systemLosses: z.number().default(14),
  tiltAngle: z.number().default(30),
  azimuthAngle: z.number().default(0),
  latitude: z.number().default(41),
  annualSunHours: z.number().default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Solar_panel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.panelArea * input.panelEfficiency / 100; results["peakPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakPower"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["peakPower"])) * input.annualSunHours * (1 - input.systemLosses / 100); results["annualEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualEnergy"])) / 365; results["dailyEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualEnergy"])) / 12; results["monthlyEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualEnergy"])) * 0.5; results["co2Reduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["co2Reduction"] = Number.NaN; }
  return results;
}


export function calculateSolar_panel_calculator(input: Solar_panel_calculatorInput): Solar_panel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["peakPower"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Solar_panel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
