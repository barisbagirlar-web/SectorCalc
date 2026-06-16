// Auto-generated from depth-of-field-calculator-schema.json
import * as z from 'zod';

export interface Depth_of_field_calculatorInput {
  focalLength: number;
  aperture: number;
  subjectDistance: number;
  circleOfConfusion: number;
}

export const Depth_of_field_calculatorInputSchema = z.object({
  focalLength: z.number().default(50),
  aperture: z.number().default(8),
  subjectDistance: z.number().default(10),
  circleOfConfusion: z.number().default(0.03),
});

function evaluateAllFormulas(input: Depth_of_field_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.focalLength, 2) / (input.aperture * input.circleOfConfusion); results["hyperfocal"] = Number.isFinite(v) ? v : 0; } catch { results["hyperfocal"] = 0; }
  try { const v = input.subjectDistance * 1000; results["subjectDistanceMM"] = Number.isFinite(v) ? v : 0; } catch { results["subjectDistanceMM"] = 0; }
  try { const v = ((results["hyperfocal"] ?? 0) * (results["subjectDistanceMM"] ?? 0)) / ((results["hyperfocal"] ?? 0) + ((results["subjectDistanceMM"] ?? 0) - input.focalLength)); results["nearLimitMM"] = Number.isFinite(v) ? v : 0; } catch { results["nearLimitMM"] = 0; }
  try { const v = ((results["hyperfocal"] ?? 0) * (results["subjectDistanceMM"] ?? 0)) / ((results["hyperfocal"] ?? 0) - ((results["subjectDistanceMM"] ?? 0) - input.focalLength)); results["farLimitMM"] = Number.isFinite(v) ? v : 0; } catch { results["farLimitMM"] = 0; }
  try { const v = (results["farLimitMM"] ?? 0) - (results["nearLimitMM"] ?? 0); results["totalDoFMM"] = Number.isFinite(v) ? v : 0; } catch { results["totalDoFMM"] = 0; }
  try { const v = (results["nearLimitMM"] ?? 0) / 1000; results["nearLimit"] = Number.isFinite(v) ? v : 0; } catch { results["nearLimit"] = 0; }
  try { const v = (results["farLimitMM"] ?? 0) / 1000; results["farLimit"] = Number.isFinite(v) ? v : 0; } catch { results["farLimit"] = 0; }
  try { const v = (results["totalDoFMM"] ?? 0) / 1000; results["totalDoF"] = Number.isFinite(v) ? v : 0; } catch { results["totalDoF"] = 0; }
  return results;
}


export function calculateDepth_of_field_calculator(input: Depth_of_field_calculatorInput): Depth_of_field_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Depth_of_field_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
