// Auto-generated from smed-setup-suresi-ve-ekonomik-parti-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SmedSetupSuresiVeEkonomikPartiCalculatorInput {
  annualDemand: number;
  setupTime: number;
  hourlyCost: number;
  holdingCostPerUnit: number;
  productionRate: number;
  workingDaysPerYear: number;
  hoursPerShift: number;
  shiftsPerDay: number;
  dataConfidence: number;
}

export const SmedSetupSuresiVeEkonomikPartiCalculatorInputSchema = z.object({
  annualDemand: z.number().min(1).default(10000),
  setupTime: z.number().min(0).default(30),
  hourlyCost: z.number().min(0).default(50),
  holdingCostPerUnit: z.number().min(0).default(2),
  productionRate: z.number().min(1).default(100),
  workingDaysPerYear: z.number().min(1).max(365).default(250),
  hoursPerShift: z.number().min(1).max(24).default(8),
  shiftsPerDay: z.number().min(1).max(3).default(1),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface SmedSetupSuresiVeEkonomikPartiCalculatorOutput {
  economicBatchQuantity: number;
  breakdown: {
    setupCostPerSetup: number;
    dailyDemand: number;
    dailyProductionRate: number;
    totalSetupCostPerYear: number;
    totalHoldingCostPerYear: number;
    totalInventoryCostPerYear: number;
    setupTimeReductionPotential: number;
    savingsFromSetupReduction: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SmedSetupSuresiVeEkonomikPartiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.setupCostPerSetup = ((): number => { try { const __v = input.setupTime / 60 * input.hourlyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyDemand = ((): number => { try { const __v = input.annualDemand / input.workingDaysPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyProductionRate = ((): number => { try { const __v = input.productionRate * input.hoursPerShift * input.shiftsPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.economicBatchQuantity = ((): number => { try { const __v = Math.Math.sqrt((2 * input.annualDemand * results.setupCostPerSetup) / input.holdingCostPerUnit); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSetupCostPerYear = ((): number => { try { const __v = (input.annualDemand / results.economicBatchQuantity) * results.setupCostPerSetup; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalHoldingCostPerYear = ((): number => { try { const __v = (results.economicBatchQuantity / 2) * input.holdingCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalInventoryCostPerYear = ((): number => { try { const __v = results.totalSetupCostPerYear + results.totalHoldingCostPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.setupTimeReductionPotential = ((): number => { try { const __v = input.setupTime > 30 ? input.setupTime - 30 : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.savingsFromSetupReduction = ((): number => { try { const __v = results.setupTimeReductionPotential > 0 ? (results.setupTimeReductionPotential / 60) * input.hourlyCost * (input.annualDemand / results.economicBatchQuantity) : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalInventoryCostPerYear / input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSmedSetupSuresiVeEkonomikPartiCalculator(input: SmedSetupSuresiVeEkonomikPartiCalculatorInput): SmedSetupSuresiVeEkonomikPartiCalculatorOutput {
  const results = evaluateFormulas(input);
  const economicBatchQuantity = results.economicBatchQuantity ?? 0;
  const breakdown = {
    setupCostPerSetup: results.setupCostPerSetup,
    dailyDemand: results.dailyDemand,
    dailyProductionRate: results.dailyProductionRate,
    totalSetupCostPerYear: results.totalSetupCostPerYear,
    totalHoldingCostPerYear: results.totalHoldingCostPerYear,
    totalInventoryCostPerYear: results.totalInventoryCostPerYear,
    setupTimeReductionPotential: results.setupTimeReductionPotential,
    savingsFromSetupReduction: results.savingsFromSetupReduction,
  };

  // rule: annualDemand > 0
  // rule: setupTime >= 0
  // rule: hourlyCost >= 0
  // rule: holdingCostPerUnit >= 0
  // rule: productionRate > 0
  // rule: workingDaysPerYear >= 1 && workingDaysPerYear <= 365
  // rule: hoursPerShift >= 1 && hoursPerShift <= 24
  // rule: shiftsPerDay >= 1 && shiftsPerDay <= 3
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If setupTime > 60, warning: 'High setup time; consider SMED improvements.'
  // threshold skipped (non-JS): If holdingCostPerUnit > 10, warning: 'High holding cost; review inventory policy.'
  // threshold skipped (non-JS): If hourlyCost > 100, warning: 'High labor cost; consider automation.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return economicBatchQuantity; } })();

  return {
    economicBatchQuantity,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmarking","Detailed Report with Graphs"],
  };
}
