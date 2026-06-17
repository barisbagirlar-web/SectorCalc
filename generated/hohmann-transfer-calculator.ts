// Auto-generated from hohmann-transfer-calculator-schema.json
import * as z from 'zod';

export interface Hohmann_transfer_calculatorInput {
  bodyRadius: number;
  alt1: number;
  alt2: number;
  mu: number;
}

export const Hohmann_transfer_calculatorInputSchema = z.object({
  bodyRadius: z.number().default(6378),
  alt1: z.number().default(300),
  alt2: z.number().default(35786),
  mu: z.number().default(398600.44),
});

function evaluateAllFormulas(input: Hohmann_transfer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bodyRadius + input.alt1; results["r1"] = Number.isFinite(v) ? v : 0; } catch { results["r1"] = 0; }
  try { const v = input.bodyRadius + input.alt2; results["r2"] = Number.isFinite(v) ? v : 0; } catch { results["r2"] = 0; }
  try { const v = Math.sqrt(input.mu / (results["r1"] ?? 0)); results["v1i"] = Number.isFinite(v) ? v : 0; } catch { results["v1i"] = 0; }
  try { const v = Math.sqrt(input.mu / (results["r2"] ?? 0)); results["v2f"] = Number.isFinite(v) ? v : 0; } catch { results["v2f"] = 0; }
  try { const v = ((results["r1"] ?? 0) + (results["r2"] ?? 0)) / 2; results["a"] = Number.isFinite(v) ? v : 0; } catch { results["a"] = 0; }
  try { const v = Math.sqrt(2 * input.mu / (results["r1"] ?? 0) - input.mu / (results["a"] ?? 0)); results["vp"] = Number.isFinite(v) ? v : 0; } catch { results["vp"] = 0; }
  try { const v = Math.sqrt(2 * input.mu / (results["r2"] ?? 0) - input.mu / (results["a"] ?? 0)); results["va"] = Number.isFinite(v) ? v : 0; } catch { results["va"] = 0; }
  try { const v = (results["vp"] ?? 0) - (results["v1i"] ?? 0); results["dv1"] = Number.isFinite(v) ? v : 0; } catch { results["dv1"] = 0; }
  try { const v = (results["v2f"] ?? 0) - (results["va"] ?? 0); results["dv2"] = Number.isFinite(v) ? v : 0; } catch { results["dv2"] = 0; }
  try { const v = (results["dv1"] ?? 0) + (results["dv2"] ?? 0); results["dvTotal"] = Number.isFinite(v) ? v : 0; } catch { results["dvTotal"] = 0; }
  try { const v = Math.PI * Math.sqrt(Math.pow((results["a"] ?? 0), 3) / input.mu); results["t_transfer"] = Number.isFinite(v) ? v : 0; } catch { results["t_transfer"] = 0; }
  results["__dv1__km_s"] = 0;
  results["__dv2__km_s"] = 0;
  results["__t_transfer__s"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateHohmann_transfer_calculator(input: Hohmann_transfer_calculatorInput): Hohmann_transfer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Hohmann_transfer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
