// Auto-generated from 7-israf-muda-avcisi-parasal-karsilik-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface Tool7IsrafMudaAvcisiParasalKarsilikCalculatorInput {
  wasteType: 'overproduction' | 'waiting' | 'transportation' | 'overprocessing' | 'inventory' | 'motion' | 'defects';
  wasteQuantity: number;
  unitCost: number;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  workingDaysPerYear: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const Tool7IsrafMudaAvcisiParasalKarsilikCalculatorInputSchema = z.object({
  wasteType: z.enum(['overproduction', 'waiting', 'transportation', 'overprocessing', 'inventory', 'motion', 'defects']).default('overproduction'),
  wasteQuantity: z.number().min(0).max(100000).default(10),
  unitCost: z.number().min(0).max(100000).default(50),
  frequency: z.enum(['hourly', 'daily', 'weekly', 'monthly', 'yearly']).default('daily'),
  workingDaysPerYear: z.number().min(1).max(365).default(250),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface Tool7IsrafMudaAvcisiParasalKarsilikCalculatorOutput {
  adjustedAnnualLoss: number;
  breakdown: {
    dailyLoss: number;
    annualLoss: number;
    dataConfidenceMultiplier: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: Tool7IsrafMudaAvcisiParasalKarsilikCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dailyLoss = (() => { try { return input.wasteQuantity * input.unitCost; } catch { return 0; } })();
  results.annualLoss = (() => { try { return results.dailyLoss * (input.frequency == 'hourly' ? 8 : input.frequency == 'daily' ? 1 : input.frequency == 'weekly' ? 1/5 : input.frequency == 'monthly' ? 1/20 : 1/250) * input.workingDaysPerYear; } catch { return 0; } })();
  results.dataConfidenceMultiplier = (() => { try { return input.dataConfidence == 'low' ? 0.8 : input.dataConfidence == 'medium' ? 1.0 : 1.2; } catch { return 0; } })();
  results.adjustedAnnualLoss = (() => { try { return results.annualLoss * results.dataConfidenceMultiplier; } catch { return 0; } })();
  return results;
}

export function calculateTool7IsrafMudaAvcisiParasalKarsilikCalculator(input: Tool7IsrafMudaAvcisiParasalKarsilikCalculatorInput): Tool7IsrafMudaAvcisiParasalKarsilikCalculatorOutput {
  const results = evaluateFormulas(input);
  const adjustedAnnualLoss = results.adjustedAnnualLoss ?? 0;
  const breakdown = {
    dailyLoss: results.dailyLoss,
    annualLoss: results.annualLoss,
    dataConfidenceMultiplier: results.dataConfidenceMultiplier,
  };

  // rule: wasteQuantity >= 0
  // rule: unitCost >= 0
  // rule: workingDaysPerYear >= 1 && workingDaysPerYear <= 365
  // rule: if wasteType == 'defects' then unitCost > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): annualLoss

  const dataConfidenceAdjusted = (() => { try { return results.adjustedAnnualLoss; } catch { return adjustedAnnualLoss; } })();

  return {
    adjustedAnnualLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi grafigi)","Karsilastirma (farkli donemler veya hatlar arasi)","Detayli rapor (breakdown ve onerilerle)"],
  };
}
