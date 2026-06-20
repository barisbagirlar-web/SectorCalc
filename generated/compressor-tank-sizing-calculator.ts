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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compressor_tank_sizing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.compressorFlowRate - input.demandFlowRate) * input.peakDuration / (input.pressureDifferential * 14.7 / (input.systemPressure + 14.7)); results["requiredTankVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredTankVolume"] = Number.NaN; }
  try { const v = input.peakDemandFlowRate * input.peakDuration / 60; results["peakDemandCompensation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakDemandCompensation"] = Number.NaN; }
  try { const v = input.compressorControlType === 'on-off' ? 1.5 : input.compressorControlType === 'modulating' ? 1.2 : 1.0; results["controlFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["controlFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["requiredTankVolume"])) * (toNumericFormulaValue(results["controlFactor"])) * (1 + (input.ambientTemperature - 60) * 0.0035); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCompressor_tank_sizing_calculator(input: Compressor_tank_sizing_calculatorInput): Compressor_tank_sizing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    requiredTankVolume: toNumericFormulaValue(values["requiredTankVolume"]),
    controlFactor: toNumericFormulaValue(values["controlFactor"])
  };
  const hiddenLossDrivers: string[] = ["Unregulated demand spikes due to leaks","Inadequate pressure differential setting"];
  const suggestedActions: string[] = ["Install flow meters to identify peak demand sources","Implement pressure/flow controllers to stabilize demand"];
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
    unit: "gallons",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom report branding"],
  };
}


export interface Compressor_tank_sizing_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { requiredTankVolume: number; controlFactor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Compressor_tank_sizing_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "gallons",
  breakdownKeys: ["requiredTankVolume","controlFactor"],
} as const;

