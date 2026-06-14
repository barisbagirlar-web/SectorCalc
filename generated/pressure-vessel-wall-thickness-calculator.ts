// Auto-generated from pressure-vessel-wall-thickness-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PressureVesselWallThicknessCalculatorInput {
  designPressure: number;
  vesselInnerRadius: number;
  allowableStress: number;
  jointEfficiency: '0.45' | '0.50' | '0.55' | '0.60' | '0.65' | '0.70' | '0.75' | '0.80' | '0.85' | '0.90' | '0.95' | '1.0';
  corrosionAllowance: number;
  materialType: 'Carbon Steel' | 'Stainless Steel' | 'Alloy Steel' | 'Aluminum' | 'Other';
}

export const PressureVesselWallThicknessCalculatorInputSchema = z.object({
  designPressure: z.number().min(0.1).max(100).default(1),
  vesselInnerRadius: z.number().min(50).max(5000).default(500),
  allowableStress: z.number().min(50).max(500).default(138),
  jointEfficiency: z.enum(['0.45', '0.50', '0.55', '0.60', '0.65', '0.70', '0.75', '0.80', '0.85', '0.90', '0.95', '1.0']).default('1.0'),
  corrosionAllowance: z.number().min(0).max(10).default(2),
  materialType: z.enum(['Carbon Steel', 'Stainless Steel', 'Alloy Steel', 'Aluminum', 'Other']).default('Carbon Steel'),
});

export interface PressureVesselWallThicknessCalculatorOutput {
  nominalThickness: number;
  breakdown: {
    requiredThickness: number;
    corrosionAllowance: number;
    stressCheck: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PressureVesselWallThicknessCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.requiredThickness = ((): number => { try { const __v = (input.designPressure * input.vesselInnerRadius) / (input.allowableStress * (Number(input.jointEfficiency) || 0) - 0.6 * input.designPressure) + input.corrosionAllowance; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.nominalThickness = ((): number => { try { const __v = Math.ceil(results.requiredThickness / 1.0) * 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.stressCheck = ((): number => { try { const __v = (input.designPressure * (input.vesselInnerRadius + results.nominalThickness - input.corrosionAllowance)) / (results.nominalThickness - input.corrosionAllowance) <= input.allowableStress * (Number(input.jointEfficiency) || 0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePressureVesselWallThicknessCalculator(input: PressureVesselWallThicknessCalculatorInput): PressureVesselWallThicknessCalculatorOutput {
  const results = evaluateFormulas(input);
  const nominalThickness = results.nominalThickness ?? 0;
  const breakdown = {
    requiredThickness: results.requiredThickness,
    corrosionAllowance: results.corrosionAllowance,
    stressCheck: results.stressCheck,
  };

  // rule: designPressure > 0
  // rule: vesselInnerRadius > 0
  // rule: allowableStress > 0
  // rule: jointEfficiency > 0 and jointEfficiency <= 1
  // rule: corrosionAllowance >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High pressure vessel, consider special design per ASME BPVC Section VIII Div.2
  // threshold skipped (non-JS): Excessive corrosion allowance, verify material selection

  const dataConfidenceAdjusted = (() => { try { return results.nominalThickness; } catch { return nominalThickness; } })();

  return {
    nominalThickness,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with ASME Section VIII Div.2","Detailed Report with Material Specifications"],
  };
}
