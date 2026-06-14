// Auto-generated from unit-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface UnitCostCalculatorInput {
  totalCost: number;
  totalUnitsProduced: number;
  defectRate: number;
  scrapRate: number;
  setupTimeHours: number;
  batchSize: number;
  laborRatePerHour: number;
  laborHoursPerUnit: number;
  materialCostPerUnit: number;
  overheadRate: number;
  dataConfidence: number;
}

export const UnitCostCalculatorInputSchema = z.object({
  totalCost: z.number().min(0).default(0),
  totalUnitsProduced: z.number().min(1).default(1),
  defectRate: z.number().min(0).max(1).default(0),
  scrapRate: z.number().min(0).max(1).default(0),
  setupTimeHours: z.number().min(0).default(0),
  batchSize: z.number().min(1).default(1),
  laborRatePerHour: z.number().min(0).default(20),
  laborHoursPerUnit: z.number().min(0).default(0.5),
  materialCostPerUnit: z.number().min(0).default(10),
  overheadRate: z.number().min(0).max(1).default(0.2),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface UnitCostCalculatorOutput {
  unitCost: number;
  breakdown: {
    directLaborCostPerUnit: number;
    directMaterialCostPerUnit: number;
    overheadCostPerUnit: number;
    setupCostPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: UnitCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.effectiveUnits = ((): number => { try { const __v = input.totalUnitsProduced * (1 - input.defectRate) * (1 - input.scrapRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.setupCostPerUnit = ((): number => { try { const __v = (input.setupTimeHours * input.laborRatePerHour) / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directLaborCostPerUnit = ((): number => { try { const __v = input.laborHoursPerUnit * laborRatePerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directMaterialCostPerUnit = ((): number => { try { const __v = input.materialCostPerUnit / (1 - input.scrapRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCostPerUnit = ((): number => { try { const __v = results.directLaborCostPerUnit + results.directMaterialCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCostPerUnit = ((): number => { try { const __v = results.directCostPerUnit * input.overheadRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.unitCost = ((): number => { try { const __v = results.directCostPerUnit + results.overheadCostPerUnit + results.setupCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.unitCost / input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateUnitCostCalculator(input: UnitCostCalculatorInput): UnitCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const unitCost = results.unitCost ?? 0;
  const breakdown = {
    directLaborCostPerUnit: results.directLaborCostPerUnit,
    directMaterialCostPerUnit: results.directMaterialCostPerUnit,
    overheadCostPerUnit: results.overheadCostPerUnit,
    setupCostPerUnit: results.setupCostPerUnit,
  };

  // rule: totalCost >= 0
  // rule: totalUnitsProduced >= 1
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: scrapRate >= 0 and scrapRate <= 1
  // rule: setupTimeHours >= 0
  // rule: batchSize >= 1
  // rule: laborRatePerHour >= 0
  // rule: laborHoursPerUnit >= 0
  // rule: materialCostPerUnit >= 0
  // rule: overheadRate >= 0 and overheadRate <= 1
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  // rule: If defectRate > 0.05 then warning: 'High defect rate - consider quality improvement'
  // rule: If scrapRate > 0.05 then warning: 'High scrap rate - review material usage'
  // rule: If setupTimeHours > 2 then warning: 'Long setup time - consider SMED'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.05
  // threshold skipped (non-JS): 0.05
  // threshold skipped (non-JS): 2

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return unitCost; } })();

  return {
    unitCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical data)","Benchmarking against industry standards","Detailed breakdown report with charts"],
  };
}
