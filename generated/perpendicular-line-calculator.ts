// Auto-generated from perpendicular-line-calculator-schema.json
import * as z from 'zod';

export interface Perpendicular_line_calculatorInput {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

export const Perpendicular_line_calculatorInputSchema = z.object({
  x1: z.number().default(0),
  y1: z.number().default(0),
  x2: z.number().default(1),
  y2: z.number().default(1),
  x3: z.number().default(2),
  y3: z.number().default(3),
});

function evaluateAllFormulas(input: Perpendicular_line_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (function() { let m_orig = (x2 == x1) ? null : (y2 - y1) / (x2 - x1); if (x2 == x1) { return 'y = ' + y3; } else if (y2 == y1) { return 'x = ' + x3; } else { let m_perp = -1 / m_orig; let b_perp = y3 - m_perp * x3; return 'y = ' + m_perp + 'x + ' + b_perp; } })(); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = (function() { let m_orig = (x2 == x1) ? null : (y2 - y1) / (x2 - x1); if (x2 == x1) { return 'Slope: 0 (horizontal)'; } else if (y2 == y1) { return 'Slope: undefined (vertical)'; } else { let m_perp = -1 / m_orig; return 'Slope: ' + m_perp; } })(); results["breakdown[0]"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown[0]"] = 0; }
  try { const v = (function() { let m_orig = (x2 == x1) ? null : (y2 - y1) / (x2 - x1); if (x2 == x1) { return 'Y-Intercept: ' + y3; } else if (y2 == y1) { return 'Y-Intercept: undefined (vertical line)'; } else { let m_perp = -1 / m_orig; let b_perp = y3 - m_perp * x3; return 'Y-Intercept: ' + b_perp; } })(); results["breakdown[1]"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown[1]"] = 0; }
  return results;
}


export function calculatePerpendicular_line_calculator(input: Perpendicular_line_calculatorInput): Perpendicular_line_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Perpendicular"] ?? 0;
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


export interface Perpendicular_line_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
