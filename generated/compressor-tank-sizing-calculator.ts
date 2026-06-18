// @ts-nocheck
// Auto-generated from compressor-tank-sizing-calculator-schema.json
import * as z from 'zod';

export interface Compressor_tank_sizing_calculatorInput {
  compressorFlowRate: number;
  demandFlowRate: number;
  peakDemandFlowRate: number;
  peakDuration: number;
  systemPressure: number;
  pressureDifferential: number;
  compressorControlType: string;
  ambientTemperature: number;
}

export const Compressor_tank_sizing_calculatorInputSchema = z.object({
  compressorFlowRate: z.number().min(10).max(10000).default(100),
  demandFlowRate: z.number().min(5).max(9500).default(80),
  peakDemandFlowRate: z.number().min(10).max(15000).default(150),
  peakDuration: z.number().min(1).max(600).default(30),
  systemPressure: z.number().min(30).max(250).default(100),
  pressureDifferential: z.number().min(1).max(50).default(10),
  compressorControlType: z.enum(['Load/Unload', 'Variable Speed Drive (VSD)', 'Modulating', 'Start/Stop']).default('Load/Unload'),
  ambientTemperature: z.number().min(-20).max(130).default(80),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compressor_tank_sizing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.compressorFlowRate * input.demandFlowRate * input.peakDemandFlowRate * input.peakDuration; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.compressorFlowRate * input.demandFlowRate * input.peakDemandFlowRate * input.peakDuration * (input.systemPressure * input.pressureDifferential * input.ambientTemperature); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.systemPressure * input.pressureDifferential * input.ambientTemperature; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCompressor_tank_sizing_calculator(input: Compressor_tank_sizing_calculatorInput): Compressor_tank_sizing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom report branding"],
  };
}


export interface Compressor_tank_sizing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
