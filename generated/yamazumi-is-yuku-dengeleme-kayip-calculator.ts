// Auto-generated from yamazumi-is-yuku-dengeleme-kayip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YamazumiIsYukuDengelemeKayipCalculatorInput {
  cycleTimes: number;
  taktTime: number;
  numberOfStations: number;
  laborCostPerHour: number;
  workingHoursPerDay: number;
  workingDaysPerYear: number;
  defectRate: number;
  reworkCostPerUnit: number;
  dataConfidence: number;
}

export const YamazumiIsYukuDengelemeKayipCalculatorInputSchema = z.object({
  cycleTimes: z.number().min(0).default(0),
  taktTime: z.number().min(0.1).default(60),
  numberOfStations: z.number().min(1).default(1),
  laborCostPerHour: z.number().min(0).default(20),
  workingHoursPerDay: z.number().min(0).max(24).default(8),
  workingDaysPerYear: z.number().min(1).max(365).default(250),
  defectRate: z.number().min(0).max(100).default(0),
  reworkCostPerUnit: z.number().min(0).default(0),
  dataConfidence: z.number().min(0).max(1).default(1),
});

export interface YamazumiIsYukuDengelemeKayipCalculatorOutput {
  totalLoss: number;
  breakdown: {
    balanceEfficiency: number;
    totalCycleTime: number;
    maxCycleTime: number;
    totalLaborCostPerYear: number;
    defectCostPerYear: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YamazumiIsYukuDengelemeKayipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalCycleTime = ((): number => { try { const __v = sum(input.cycleTimes); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maxCycleTime = ((): number => { try { const __v = Math.max(input.cycleTimes); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.balanceEfficiency = ((): number => { try { const __v = results.totalCycleTime / (results.maxCycleTime * input.numberOfStations); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCostPerYear = ((): number => { try { const __v = input.laborCostPerHour * input.workingHoursPerDay * input.workingDaysPerYear * input.numberOfStations; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectCostPerYear = ((): number => { try { const __v = input.defectRate / 100 * (results.totalCycleTime / input.taktTime) * input.workingHoursPerDay * input.workingDaysPerYear * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLoss = ((): number => { try { const __v = results.totalLaborCostPerYear * (1 - results.balanceEfficiency) + results.defectCostPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedLoss = ((): number => { try { const __v = results.totalLoss * (1 + (1 - input.dataConfidence)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYamazumiIsYukuDengelemeKayipCalculator(input: YamazumiIsYukuDengelemeKayipCalculatorInput): YamazumiIsYukuDengelemeKayipCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalLoss = results.totalLoss ?? 0;
  const breakdown = {
    balanceEfficiency: results.balanceEfficiency,
    totalCycleTime: results.totalCycleTime,
    maxCycleTime: results.maxCycleTime,
    totalLaborCostPerYear: results.totalLaborCostPerYear,
    defectCostPerYear: results.defectCostPerYear,
  };

  // rule: taktTime > 0
  // rule: numberOfStations >= 1
  // rule: laborCostPerHour >= 0
  // rule: workingHoursPerDay > 0 && workingHoursPerDay <= 24
  // rule: workingDaysPerYear > 0 && workingDaysPerYear <= 365
  // rule: defectRate >= 0 && defectRate <= 100
  // rule: reworkCostPerUnit >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  // rule: cycleTimes array length must equal numberOfStations
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.defectRate > 5) hiddenLossDrivers.push("Kritik: Kusur orani %5 uzerinde");
  if (balanceEfficiency < 0.8) hiddenLossDrivers.push("Uyari: Denge verimliligi %80 altinda");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedLoss; } catch { return totalLoss; } })();

  return {
    totalLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
