// Auto-generated from vakum-sistemi-kacak-ve-enerji-kayip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface VakumSistemiKacakVeEnerjiKayipCalculatorInput {
  systemVolume: number;
  operatingPressure: number;
  leakRate: number;
  pumpPower: number;
  electricityCost: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  pumpEfficiency: number;
  leakReductionPotential: number;
  repairCost: number;
}

export const VakumSistemiKacakVeEnerjiKayipCalculatorInputSchema = z.object({
  systemVolume: z.number().min(0.1).max(10000).default(10),
  operatingPressure: z.number().min(0.001).max(1000).default(100),
  leakRate: z.number().min(0).max(100).default(0.1),
  pumpPower: z.number().min(0.1).max(500).default(5),
  electricityCost: z.number().min(0.01).max(1).default(0.12),
  operatingHoursPerDay: z.number().min(0).max(24).default(24),
  operatingDaysPerYear: z.number().min(1).max(365).default(365),
  pumpEfficiency: z.number().min(10).max(100).default(80),
  leakReductionPotential: z.number().min(0).max(100).default(50),
  repairCost: z.number().min(0).max(100000).default(1000),
});

export interface VakumSistemiKacakVeEnerjiKayipCalculatorOutput {
  totalAnnualLoss: number;
  breakdown: {
    annualEnergyCost: number;
    annualLeakCost: number;
    potentialSavings: number;
    paybackPeriod: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: VakumSistemiKacakVeEnerjiKayipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualEnergyConsumption = ((): number => { try { const __v = input.pumpPower * input.operatingHoursPerDay * input.operatingDaysPerYear / input.pumpEfficiency * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCost = ((): number => { try { const __v = results.annualEnergyConsumption * input.electricityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.leakPowerLoss = ((): number => { try { const __v = input.leakRate * input.operatingPressure * 0.001 * 1000 / 3600; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLeakEnergyLoss = ((): number => { try { const __v = results.leakPowerLoss * input.operatingHoursPerDay * input.operatingDaysPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLeakCost = ((): number => { try { const __v = results.annualLeakEnergyLoss * input.electricityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.potentialSavings = ((): number => { try { const __v = results.annualLeakCost * input.leakReductionPotential / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = input.repairCost / results.potentialSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualLoss = ((): number => { try { const __v = results.annualEnergyCost + results.annualLeakCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateVakumSistemiKacakVeEnerjiKayipCalculator(input: VakumSistemiKacakVeEnerjiKayipCalculatorInput): VakumSistemiKacakVeEnerjiKayipCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualLoss = results.totalAnnualLoss ?? 0;
  const breakdown = {
    annualEnergyCost: results.annualEnergyCost,
    annualLeakCost: results.annualLeakCost,
    potentialSavings: results.potentialSavings,
    paybackPeriod: results.paybackPeriod,
  };

  // rule: operatingPressure > 0
  // rule: leakRate >= 0
  // rule: pumpPower > 0
  // rule: electricityCost > 0
  // rule: operatingHoursPerDay >= 0 && operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear >= 1 && operatingDaysPerYear <= 365
  // rule: pumpEfficiency >= 10 && pumpEfficiency <= 100
  // rule: leakReductionPotential >= 0 && leakReductionPotential <= 100
  // rule: repairCost >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.leakRate > 1) hiddenLossDrivers.push("leakRate");
  if (input.pumpEfficiency < 60) hiddenLossDrivers.push("pumpEfficiency");

  const dataConfidenceAdjusted = (() => { try { return results.totalAnnualLoss * (1 - 0.1); } catch { return totalAnnualLoss; } })();

  return {
    totalAnnualLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri disa aktarimi","Trend analizi (zaman serisi)","Karsilastirmali senaryo analizi","Detayli enerji kaybi raporu"],
  };
}
