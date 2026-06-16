// Auto-generated from mid-parental-height-calculator-schema.json
import * as z from 'zod';

export interface Mid_parental_height_calculatorInput {
  fatherHeight: number;
  motherHeight: number;
  childSex: number;
  resultUnit: number;
}

export const Mid_parental_height_calculatorInputSchema = z.object({
  fatherHeight: z.number().default(180),
  motherHeight: z.number().default(165),
  childSex: z.number().default(1),
  resultUnit: z.number().default(0),
});

function evaluateAllFormulas(input: Mid_parental_height_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.childSex === 1 ? (input.fatherHeight + input.motherHeight + 13) / 2 : (input.fatherHeight + input.motherHeight - 13) / 2; results["midHeightCm"] = Number.isFinite(v) ? v : 0; } catch { results["midHeightCm"] = 0; }
  try { const v = input.resultUnit === 1 ? (results["midHeightCm"] ?? 0) / 2.54 : (results["midHeightCm"] ?? 0); results["outputHeight"] = Number.isFinite(v) ? v : 0; } catch { results["outputHeight"] = 0; }
  try { const v = input.resultUnit === 1 ? 'inç' : 'cm'; results["outputUnit"] = Number.isFinite(v) ? v : 0; } catch { results["outputUnit"] = 0; }
  try { const v = 'Öngörülen boy: ' + (results["outputHeight"] ?? 0).toFixed(1) + ' ' + (results["outputUnit"] ?? 0); results["primaryText"] = Number.isFinite(v) ? v : 0; } catch { results["primaryText"] = 0; }
  try { const v = 'Baba boyu: ' + input.fatherHeight + ' cm'; results["breakdownStep1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownStep1"] = 0; }
  try { const v = 'Anne boyu: ' + input.motherHeight + ' cm'; results["breakdownStep2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownStep2"] = 0; }
  try { const v = 'Cinsiyet: ' + (input.childSex === 1 ? 'Erkek' : 'Kiz'); results["breakdownStep3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownStep3"] = 0; }
  try { const v = 'Formül: (baba + anne ' + (input.childSex === 1 ? '+ 13' : '- 13') + ') / 2'; results["breakdownStep4"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownStep4"] = 0; }
  try { const v = 'Hesaplanan: ' + (results["midHeightCm"] ?? 0).toFixed(1) + ' cm'; results["breakdownStep5"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownStep5"] = 0; }
  try { const v = input.resultUnit === 1 ? 'İnçe çevrildi: ' + (results["outputHeight"] ?? 0).toFixed(1) + ' inç' : ''; results["breakdownStep6"] = Number.isFinite(v) ? v : 0; } catch { results["breakdownStep6"] = 0; }
  return results;
}


export function calculateMid_parental_height_calculator(input: Mid_parental_height_calculatorInput): Mid_parental_height_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["{primaryText}"] ?? 0;
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


export interface Mid_parental_height_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
