// Auto-generated from cnc-quote-risk-analyzer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CncQuoteRiskAnalyzerInput {
  materialCostPerPart: number;
  laborCostPerHour: number;
  cycleTimeMinutes: number;
  setupTimeMinutes: number;
  batchSize: number;
  defectRate: number;
  overheadRate: number;
  profitMarginTarget: number;
  dataConfidence: 'low' | 'medium' | 'high';
  machineUtilization: number;
}

export const CncQuoteRiskAnalyzerInputSchema = z.object({
  materialCostPerPart: z.number().min(0).default(10),
  laborCostPerHour: z.number().min(0).default(30),
  cycleTimeMinutes: z.number().min(0.1).max(1440).default(5),
  setupTimeMinutes: z.number().min(0).max(1440).default(60),
  batchSize: z.number().min(1).default(100),
  defectRate: z.number().min(0).max(1).default(0.02),
  overheadRate: z.number().min(0).max(1).default(0.2),
  profitMarginTarget: z.number().min(0).max(1).default(0.15),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  machineUtilization: z.number().min(0).max(1).default(0.8),
});

export interface CncQuoteRiskAnalyzerOutput {
  totalQuoteRisk: number;
  breakdown: {
    directLaborCostPerPart: number;
    setupCostPerPart: number;
    totalDirectCostPerPart: number;
    overheadCostPerPart: number;
    totalCostPerPart: number;
    defectCostPerPart: number;
    adjustedCostPerPart: number;
    quotePricePerPart: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CncQuoteRiskAnalyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directLaborCostPerPart = ((): number => { try { const __v = input.laborCostPerHour * (input.cycleTimeMinutes / 60); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.setupCostPerPart = ((): number => { try { const __v = input.laborCostPerHour * (input.setupTimeMinutes / 60) / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCostPerPart = ((): number => { try { const __v = input.materialCostPerPart + results.directLaborCostPerPart + results.setupCostPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCostPerPart = ((): number => { try { const __v = results.totalDirectCostPerPart * input.overheadRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPart = ((): number => { try { const __v = results.totalDirectCostPerPart + results.overheadCostPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectCostPerPart = ((): number => { try { const __v = results.totalCostPerPart * input.defectRate / (1 - input.defectRate); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedCostPerPart = ((): number => { try { const __v = results.totalCostPerPart + results.defectCostPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.quotePricePerPart = ((): number => { try { const __v = results.adjustedCostPerPart / (1 - input.profitMarginTarget); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalQuoteRisk = ((): number => { try { const __v = results.quotePricePerPart * input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalQuoteRisk * (input.dataConfidence === 'low' ? 1.2 : input.dataConfidence === 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCncQuoteRiskAnalyzer(input: CncQuoteRiskAnalyzerInput): CncQuoteRiskAnalyzerOutput {
  const results = evaluateFormulas(input);
  const totalQuoteRisk = results.totalQuoteRisk ?? 0;
  const breakdown = {
    directLaborCostPerPart: results.directLaborCostPerPart,
    setupCostPerPart: results.setupCostPerPart,
    totalDirectCostPerPart: results.totalDirectCostPerPart,
    overheadCostPerPart: results.overheadCostPerPart,
    totalCostPerPart: results.totalCostPerPart,
    defectCostPerPart: results.defectCostPerPart,
    adjustedCostPerPart: results.adjustedCostPerPart,
    quotePricePerPart: results.quotePricePerPart,
  };

  // rule: batchSize must be >= 1
  // rule: cycleTimeMinutes must be > 0
  // rule: setupTimeMinutes must be >= 0
  // rule: defectRate must be between 0 and 1
  // rule: overheadRate must be between 0 and 1
  // rule: profitMarginTarget must be between 0 and 1
  // rule: machineUtilization must be between 0 and 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Defect rate exceeds 5% - review process capability.
  // threshold skipped (non-JS): Warning: Machine utilization below 60% - consider reducing capacity or increasing throughput.
  // threshold skipped (non-JS): Warning: Profit margin target below 10% - may not cover risks.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalQuoteRisk; } })();

  return {
    totalQuoteRisk,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
