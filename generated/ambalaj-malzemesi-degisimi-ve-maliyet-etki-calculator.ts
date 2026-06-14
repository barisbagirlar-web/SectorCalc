// Auto-generated from ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInput {
  currentMaterialCostPerUnit: number;
  newMaterialCostPerUnit: number;
  annualUsageKg: number;
  changeoverCost: number;
  qualityImpact: 'positive' | 'neutral' | 'negative';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputSchema = z.object({
  currentMaterialCostPerUnit: z.number().min(0).default(10),
  newMaterialCostPerUnit: z.number().min(0).default(8),
  annualUsageKg: z.number().min(0).default(10000),
  changeoverCost: z.number().min(0).default(5000),
  qualityImpact: z.enum(['positive', 'neutral', 'negative']).default('neutral'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorOutput {
  costSavings: number;
  breakdown: {
    annualMaterialCostCurrent: number;
    annualMaterialCostNew: number;
    grossSavings: number;
    changeoverCost: number;
    netSavings: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualMaterialCostCurrent = ((): number => { try { const __v = input.currentMaterialCostPerUnit * input.annualUsageKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualMaterialCostNew = ((): number => { try { const __v = input.newMaterialCostPerUnit * input.annualUsageKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossSavings = ((): number => { try { const __v = results.annualMaterialCostCurrent - results.annualMaterialCostNew; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netSavings = ((): number => { try { const __v = results.grossSavings - input.changeoverCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costSavings = ((): number => { try { const __v = results.netSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.costSavings * 0.8 : (input.dataConfidence == 'medium' ? results.costSavings * 0.9 : results.costSavings); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(input: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInput): AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorOutput {
  const results = evaluateFormulas(input);
  const costSavings = results.costSavings ?? 0;
  const breakdown = {
    annualMaterialCostCurrent: results.annualMaterialCostCurrent,
    annualMaterialCostNew: results.annualMaterialCostNew,
    grossSavings: results.grossSavings,
    changeoverCost: results.changeoverCost,
    netSavings: results.netSavings,
  };

  // rule: currentMaterialCostPerUnit > 0
  // rule: newMaterialCostPerUnit > 0
  // rule: annualUsageKg > 0
  // rule: changeoverCost >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if costSavings < 0 then 'Maliyet tasarrufu saglanamiyor, degisim onerilmez'
  // threshold skipped (non-JS): if qualityImpact == 'negative' then 'Kalite riski var, dikkatli olunmali'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return costSavings; } })();

  return {
    costSavings,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (birden fazla malzeme secenegi)","Detayli rapor (kalite etkisi dahil)"],
  };
}
