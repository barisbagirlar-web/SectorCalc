// Auto-generated from panel-shop-margin-verdict-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PanelShopMarginVerdictInput {
  revenue: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  defectRate: number;
  dataConfidence: number;
}

export const PanelShopMarginVerdictInputSchema = z.object({
  revenue: z.number().min(0).default(0),
  materialCost: z.number().min(0).default(0),
  laborCost: z.number().min(0).default(0),
  overheadCost: z.number().min(0).default(0),
  defectRate: z.number().min(0).max(1).default(0.02),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface PanelShopMarginVerdictOutput {
  finalMarginRate: number;
  breakdown: {
    totalCost: number;
    grossMargin: number;
    marginRate: number;
    defectCost: number;
    adjustedMargin: number;
    adjustedMarginRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PanelShopMarginVerdictInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalCost = ((): number => { try { const __v = input.materialCost + input.laborCost + input.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossMargin = ((): number => { try { const __v = input.revenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginRate = ((): number => { try { const __v = results.grossMargin / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectCost = ((): number => { try { const __v = results.totalCost * input.defectRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedMargin = ((): number => { try { const __v = results.grossMargin - results.defectCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedMarginRate = ((): number => { try { const __v = results.adjustedMargin / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalMarginRate = ((): number => { try { const __v = results.adjustedMarginRate * input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePanelShopMarginVerdict(input: PanelShopMarginVerdictInput): PanelShopMarginVerdictOutput {
  const results = evaluateFormulas(input);
  const finalMarginRate = results.finalMarginRate ?? 0;
  const breakdown = {
    totalCost: results.totalCost,
    grossMargin: results.grossMargin,
    marginRate: results.marginRate,
    defectCost: results.defectCost,
    adjustedMargin: results.adjustedMargin,
    adjustedMarginRate: results.adjustedMarginRate,
  };

  // rule: revenue >= 0
  // rule: materialCost >= 0
  // rule: laborCost >= 0
  // rule: overheadCost >= 0
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: dataConfidence >= 0 and dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.defectRate > 0.05) hiddenLossDrivers.push("CRITICAL: Defect rate exceeds 5% threshold. Immediate quality improvement required.");

  const dataConfidenceAdjusted = (() => { try { return results.finalMarginRate; } catch { return finalMarginRate; } })();

  return {
    finalMarginRate,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Breakdown"],
  };
}
