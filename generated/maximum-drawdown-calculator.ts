// Auto-generated from maximum-drawdown-calculator-schema.json
import * as z from 'zod';

export interface Maximum_drawdown_calculatorInput {
  initialInvestment: number;
  peakValue: number;
  troughValue: number;
  timeToTrough: number;
  recoveryValue: number;
  recoveryTime: number;
}

export const Maximum_drawdown_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  peakValue: z.number().default(15000),
  troughValue: z.number().default(8000),
  timeToTrough: z.number().default(6),
  recoveryValue: z.number().default(15000),
  recoveryTime: z.number().default(12),
});

function evaluateAllFormulas(input: Maximum_drawdown_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.peakValue - input.troughValue) / input.peakValue) * 100; results["maxDrawdownPercent"] = Number.isFinite(v) ? v : 0; } catch { results["maxDrawdownPercent"] = 0; }
  try { const v = input.peakValue - input.troughValue; results["absoluteDrawdown"] = Number.isFinite(v) ? v : 0; } catch { results["absoluteDrawdown"] = 0; }
  try { const v = ((input.initialInvestment - input.troughValue) / input.initialInvestment) * 100; results["lossFromInitialPercent"] = Number.isFinite(v) ? v : 0; } catch { results["lossFromInitialPercent"] = 0; }
  try { const v = (input.peakValue / input.troughValue - 1) * 100; results["requiredRecoveryGainPercent"] = Number.isFinite(v) ? v : 0; } catch { results["requiredRecoveryGainPercent"] = 0; }
  try { const v = input.recoveryValue > 0 ? ((input.recoveryValue - input.troughValue) / input.troughValue) * 100 : 0; results["actualRecoveryGainPercent"] = Number.isFinite(v) ? v : 0; } catch { results["actualRecoveryGainPercent"] = 0; }
  try { const v = input.recoveryValue >= input.peakValue ? 'Full Recovery' : (input.recoveryValue > 0 ? 'Partial Recovery' : 'Not Recovered'); results["recoveryStatus"] = Number.isFinite(v) ? v : 0; } catch { results["recoveryStatus"] = 0; }
  results["_absoluteDrawdown__USD"] = 0;
  results["_lossFromInitialPercent__"] = 0;
  results["_requiredRecoveryGainPercent__"] = 0;
  results["_actualRecoveryGainPercent__"] = 0;
  try { const v = (results["recoveryStatus"] ?? 0); results["_recoveryStatus_"] = Number.isFinite(v) ? v : 0; } catch { results["_recoveryStatus_"] = 0; }
  return results;
}


export function calculateMaximum_drawdown_calculator(input: Maximum_drawdown_calculatorInput): Maximum_drawdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxDrawdownPercent"] ?? 0;
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


export interface Maximum_drawdown_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
