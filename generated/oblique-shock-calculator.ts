// Auto-generated from oblique-shock-calculator-schema.json
import * as z from 'zod';

export interface Oblique_shock_calculatorInput {
  mach: number;
  beta: number;
  gamma: number;
  p01: number;
  T01: number;
  gas_constant: number;
}

export const Oblique_shock_calculatorInputSchema = z.object({
  mach: z.number().default(2),
  beta: z.number().default(30),
  gamma: z.number().default(1.4),
  p01: z.number().default(101325),
  T01: z.number().default(300),
  gas_constant: z.number().default(287),
});

function evaluateAllFormulas(input: Oblique_shock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan(2 * (1 / Math.tan(input.beta * Math.PI / 180)) * (input.mach ** 2 * Math.sin(input.beta * Math.PI / 180) ** 2 - 1) / (input.mach ** 2 * (input.gamma + Math.cos(2 * input.beta * Math.PI / 180)) + 2)) * 180 / Math.PI; results["theta"] = Number.isFinite(v) ? v : 0; } catch { results["theta"] = 0; }
  try { const v = input.mach * Math.sin(input.beta * Math.PI / 180); results["Mn1"] = Number.isFinite(v) ? v : 0; } catch { results["Mn1"] = 0; }
  try { const v = Math.sqrt(((input.gamma - 1) * (input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2 + 2) / (2 * input.gamma * (input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2 - (input.gamma - 1))); results["Mn2"] = Number.isFinite(v) ? v : 0; } catch { results["Mn2"] = 0; }
  try { const v = (results["Mn2"] ?? 0) / Math.sin((input.beta - (results["theta"] ?? 0)) * Math.PI / 180); results["M2"] = Number.isFinite(v) ? v : 0; } catch { results["M2"] = 0; }
  try { const v = 1 + 2 * input.gamma / (input.gamma + 1) * ((input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2 - 1); results["p_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["p_ratio"] = 0; }
  try { const v = (1 + 2 * input.gamma / (input.gamma + 1) * ((input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2 - 1)) * (2 + (input.gamma - 1) * (input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2) / ((input.gamma + 1) * (input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2); results["T_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["T_ratio"] = 0; }
  try { const v = (input.gamma + 1) * (input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2 / (2 + (input.gamma - 1) * (input.mach * Math.sin(input.beta * Math.PI / 180)) ** 2); results["rho_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["rho_ratio"] = 0; }
  try { const v = (( (input.gamma + 1) * (results["Mn1"] ?? 0) ** 2 / (2 + (input.gamma - 1) * (results["Mn1"] ?? 0) ** 2) ) ** (input.gamma / (input.gamma - 1))) * ((input.gamma + 1) / (2 * input.gamma * (results["Mn1"] ?? 0) ** 2 - (input.gamma - 1))) ** (1 / (input.gamma - 1)); results["p02_p01_ratio"] = Number.isFinite(v) ? v : 0; } catch { results["p02_p01_ratio"] = 0; }
  try { const v = input.p01 * (1 + (input.gamma - 1) / 2 * input.mach ** 2) ** (-input.gamma / (input.gamma - 1)); results["p1"] = Number.isFinite(v) ? v : 0; } catch { results["p1"] = 0; }
  try { const v = input.T01 * (1 + (input.gamma - 1) / 2 * input.mach ** 2) ** (-1); results["T1"] = Number.isFinite(v) ? v : 0; } catch { results["T1"] = 0; }
  try { const v = (results["p_ratio"] ?? 0) * (results["p1"] ?? 0); results["p2"] = Number.isFinite(v) ? v : 0; } catch { results["p2"] = 0; }
  try { const v = (results["T_ratio"] ?? 0) * (results["T1"] ?? 0); results["T2"] = Number.isFinite(v) ? v : 0; } catch { results["T2"] = 0; }
  try { const v = (results["p2"] ?? 0) / (input.gas_constant * (results["T2"] ?? 0)); results["rho2"] = Number.isFinite(v) ? v : 0; } catch { results["rho2"] = 0; }
  try { const v = (results["p02_p01_ratio"] ?? 0) * input.p01; results["p02"] = Number.isFinite(v) ? v : 0; } catch { results["p02"] = 0; }
  return results;
}


export function calculateOblique_shock_calculator(input: Oblique_shock_calculatorInput): Oblique_shock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["theta"] ?? 0;
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


export interface Oblique_shock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
