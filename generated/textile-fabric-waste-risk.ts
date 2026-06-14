// Auto-generated from textile-fabric-waste-risk-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TextileFabricWasteRiskInput {
  fabricInputWeight: number;
  fabricOutputWeight: number;
  wasteDisposalCostPerKg: number;
  fabricCostPerKg: number;
  productionVolume: number;
  fabricPerUnit: number;
  defectRate: number;
  reworkRate: number;
  laborCostPerHour: number;
  wasteHandlingTimePerKg: number;
  dataConfidence: number;
}

export const TextileFabricWasteRiskInputSchema = z.object({
  fabricInputWeight: z.number().min(0).default(1000),
  fabricOutputWeight: z.number().min(0).default(800),
  wasteDisposalCostPerKg: z.number().min(0).default(0.5),
  fabricCostPerKg: z.number().min(0).default(10),
  productionVolume: z.number().min(0).default(10000),
  fabricPerUnit: z.number().min(0).default(0.5),
  defectRate: z.number().min(0).max(100).default(5),
  reworkRate: z.number().min(0).max(100).default(3),
  laborCostPerHour: z.number().min(0).default(15),
  wasteHandlingTimePerKg: z.number().min(0).default(0.1),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface TextileFabricWasteRiskOutput {
  totalWasteCost: number;
  breakdown: {
    materialLossCost: number;
    disposalCost: number;
    laborCostWaste: number;
    wasteWeight: number;
    wastePercentage: number;
    wasteCostPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TextileFabricWasteRiskInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.wasteWeight = ((): number => { try { const __v = input.fabricInputWeight - input.fabricOutputWeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wastePercentage = ((): number => { try { const __v = (results.wasteWeight / input.fabricInputWeight) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialLossCost = ((): number => { try { const __v = results.wasteWeight * input.fabricCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.disposalCost = ((): number => { try { const __v = results.wasteWeight * input.wasteDisposalCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostWaste = ((): number => { try { const __v = results.wasteWeight * input.wasteHandlingTimePerKg * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWasteCost = ((): number => { try { const __v = results.materialLossCost + results.disposalCost + results.laborCostWaste; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wasteCostPerUnit = ((): number => { try { const __v = results.totalWasteCost / input.productionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectWasteWeight = ((): number => { try { const __v = input.fabricInputWeight * (input.defectRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkWasteWeight = ((): number => { try { const __v = input.fabricInputWeight * (input.reworkRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hiddenLossDrivers = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalWasteCost * (1 + (1 - input.dataConfidence)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTextileFabricWasteRisk(input: TextileFabricWasteRiskInput): TextileFabricWasteRiskOutput {
  const results = evaluateFormulas(input);
  const totalWasteCost = results.totalWasteCost ?? 0;
  const breakdown = {
    materialLossCost: results.materialLossCost,
    disposalCost: results.disposalCost,
    laborCostWaste: results.laborCostWaste,
    wasteWeight: results.wasteWeight,
    wastePercentage: results.wastePercentage,
    wasteCostPerUnit: results.wasteCostPerUnit,
  };

  // rule: fabricOutputWeight must be less than or equal to fabricInputWeight
  // rule: defectRate + reworkRate must be less than or equal to 100
  // rule: fabricPerUnit must be greater than 0
  // rule: productionVolume must be greater than 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if wastePercentage > 20 then 'CRITICAL: High waste percentage'
  // threshold skipped (non-JS): if defectRate > 10 then 'WARNING: Defect rate exceeds 10%'
  // threshold skipped (non-JS): if reworkRate > 5 then 'WARNING: Rework rate exceeds 5%'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalWasteCost; } })();

  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of detailed waste analysis report","CSV export of input and output data","Trend analysis over time (monthly waste cost tracking)","Benchmarking against industry average waste percentages","Scenario simulation (what-if analysis for defect rate reduction)"],
  };
}
