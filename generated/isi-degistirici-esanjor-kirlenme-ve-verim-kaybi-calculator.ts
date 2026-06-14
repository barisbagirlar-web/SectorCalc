// Auto-generated from isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInput {
  cleanHeatTransferCoefficient: number;
  fouledHeatTransferCoefficient: number;
  heatTransferArea: number;
  logMeanTemperatureDifference: number;
  operatingHoursPerYear: number;
  energyCost: number;
  cleaningCost: number;
  cleaningFrequency: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInputSchema = z.object({
  cleanHeatTransferCoefficient: z.number().min(100).max(2000).default(500),
  fouledHeatTransferCoefficient: z.number().min(50).max(1500).default(300),
  heatTransferArea: z.number().min(1).max(10000).default(100),
  logMeanTemperatureDifference: z.number().min(1).max(100).default(30),
  operatingHoursPerYear: z.number().min(0).max(8760).default(8000),
  energyCost: z.number().min(0).max(1).default(0.1),
  cleaningCost: z.number().min(0).max(100000).default(5000),
  cleaningFrequency: z.number().min(0.1).max(10).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorOutput {
  totalAnnualLoss: number;
  breakdown: {
    foulingFactor: number;
    efficiencyLoss: number;
    annualEnergyLoss: number;
    annualEnergyCostLoss: number;
    annualCleaningCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.foulingFactor = ((): number => { try { const __v = (input.cleanHeatTransferCoefficient - input.fouledHeatTransferCoefficient) / input.cleanHeatTransferCoefficient; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.efficiencyLoss = ((): number => { try { const __v = results.foulingFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatTransferRateClean = ((): number => { try { const __v = input.cleanHeatTransferCoefficient * input.heatTransferArea * input.logMeanTemperatureDifference; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatTransferRateFouled = ((): number => { try { const __v = input.fouledHeatTransferCoefficient * input.heatTransferArea * input.logMeanTemperatureDifference; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyLossRate = ((): number => { try { const __v = results.heatTransferRateClean - results.heatTransferRateFouled; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyLoss = ((): number => { try { const __v = results.energyLossRate * input.operatingHoursPerYear / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCostLoss = ((): number => { try { const __v = results.annualEnergyLoss * input.energyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCleaningCost = ((): number => { try { const __v = input.cleaningCost / input.cleaningFrequency; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualLoss = ((): number => { try { const __v = results.annualEnergyCostLoss + results.annualCleaningCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalAnnualLoss * (input.dataConfidence === 'low' ? 1.2 : input.dataConfidence === 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator(input: IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorInput): IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualLoss = results.totalAnnualLoss ?? 0;
  const breakdown = {
    foulingFactor: results.foulingFactor,
    efficiencyLoss: results.efficiencyLoss,
    annualEnergyLoss: results.annualEnergyLoss,
    annualEnergyCostLoss: results.annualEnergyCostLoss,
    annualCleaningCost: results.annualCleaningCost,
  };

  // rule: fouledHeatTransferCoefficient <= cleanHeatTransferCoefficient
  // rule: heatTransferArea > 0
  // rule: logMeanTemperatureDifference > 0
  // rule: operatingHoursPerYear >= 0
  // rule: energyCost >= 0
  // rule: cleaningCost >= 0
  // rule: cleaningFrequency > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if foulingFactor > 0.5 then 'Yuksek kirlenme'
  // threshold skipped (non-JS): if efficiencyLoss > 0.3 then 'Kritik verim kaybi'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalAnnualLoss; } })();

  return {
    totalAnnualLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
