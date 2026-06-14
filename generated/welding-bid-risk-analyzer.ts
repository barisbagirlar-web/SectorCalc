// Auto-generated from welding-bid-risk-analyzer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface WeldingBidRiskAnalyzerInput {
  projectDurationDays: number;
  laborRatePerHour: number;
  materialCostPerUnit: number;
  unitsToWeld: number;
  defectRate: number;
  reworkCostPerUnit: number;
  overheadRate: number;
  profitMarginTarget: number;
  dataConfidence: number;
  bidType: 'fixed' | 'cost-plus' | 'time-and-materials';
}

export const WeldingBidRiskAnalyzerInputSchema = z.object({
  projectDurationDays: z.number().min(1).max(365).default(30),
  laborRatePerHour: z.number().min(15).max(200).default(50),
  materialCostPerUnit: z.number().min(0).max(10000).default(100),
  unitsToWeld: z.number().min(1).max(100000).default(100),
  defectRate: z.number().min(0).max(1).default(0.05),
  reworkCostPerUnit: z.number().min(0).max(5000).default(50),
  overheadRate: z.number().min(0).max(1).default(0.2),
  profitMarginTarget: z.number().min(0).max(1).default(0.15),
  dataConfidence: z.number().min(0).max(1).default(0.9),
  bidType: z.enum(['fixed', 'cost-plus', 'time-and-materials']).default('fixed'),
});

export interface WeldingBidRiskAnalyzerOutput {
  riskAdjustedBidPrice: number;
  breakdown: {
    directLaborCost: number;
    directMaterialCost: number;
    reworkCost: number;
    overheadCost: number;
    totalCost: number;
    bidPrice: number;
    expectedProfit: number;
    profitMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: WeldingBidRiskAnalyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directLaborCost = ((): number => { try { const __v = input.laborRatePerHour * input.projectDurationDays * 8 * input.unitsToWeld / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directMaterialCost = ((): number => { try { const __v = input.materialCostPerUnit * input.unitsToWeld; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = input.defectRate * input.unitsToWeld * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.directLaborCost + results.directMaterialCost + results.reworkCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * input.overheadRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bidPrice = ((): number => { try { const __v = results.totalCost / (1 - input.profitMarginTarget); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskAdjustedBidPrice = ((): number => { try { const __v = results.bidPrice * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedProfit = ((): number => { try { const __v = results.bidPrice - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = results.expectedProfit / results.bidPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateWeldingBidRiskAnalyzer(input: WeldingBidRiskAnalyzerInput): WeldingBidRiskAnalyzerOutput {
  const results = evaluateFormulas(input);
  const riskAdjustedBidPrice = results.riskAdjustedBidPrice ?? 0;
  const breakdown = {
    directLaborCost: results.directLaborCost,
    directMaterialCost: results.directMaterialCost,
    reworkCost: results.reworkCost,
    overheadCost: results.overheadCost,
    totalCost: results.totalCost,
    bidPrice: results.bidPrice,
    expectedProfit: results.expectedProfit,
    profitMargin: results.profitMargin,
  };

  // rule: projectDurationDays > 0
  // rule: laborRatePerHour > 0
  // rule: materialCostPerUnit >= 0
  // rule: unitsToWeld > 0
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: reworkCostPerUnit >= 0
  // rule: overheadRate >= 0 and overheadRate <= 1
  // rule: profitMarginTarget >= 0 and profitMarginTarget <= 1
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  // rule: if bidType == 'fixed' then profitMarginTarget >= 0.1 else profitMarginTarget >= 0.05
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if defectRate > 0.05 then 'CRITICAL: Defect rate exceeds acceptable limit (5%). Consider process improvement.'
  // threshold skipped (non-JS): if profitMarginTarget < 0.1 then 'WARNING: Low profit margin target may indicate insufficient risk premium.'
  // threshold skipped (non-JS): if dataConfidence < 0.7 then 'WARNING: Low data confidence; results may be unreliable.'

  const dataConfidenceAdjusted = (() => { try { return results.riskAdjustedBidPrice; } catch { return riskAdjustedBidPrice; } })();

  return {
    riskAdjustedBidPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Bid Comparison","Detailed Report with Sensitivity Analysis"],
  };
}
