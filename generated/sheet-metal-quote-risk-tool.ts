// Auto-generated from sheet-metal-quote-risk-tool-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SheetMetalQuoteRiskToolInput {
  materialCostPerKg: number;
  materialThickness: number;
  partArea: number;
  annualVolume: number;
  setupTimeHours: number;
  cycleTimeSeconds: number;
  laborRatePerHour: number;
  machineRatePerHour: number;
  scrapRate: number;
  defectRate: number;
  toolingCost: number;
  overheadRate: number;
  profitMarginTarget: number;
  dataConfidence: 'low' | 'medium' | 'high';
  materialType: 'steel' | 'aluminum' | 'stainless_steel' | 'copper';
}

export const SheetMetalQuoteRiskToolInputSchema = z.object({
  materialCostPerKg: z.number().min(0.5).max(20).default(2.5),
  materialThickness: z.number().min(0.5).max(6).default(1.5),
  partArea: z.number().min(1).max(10000).default(100),
  annualVolume: z.number().min(100).max(1000000).default(10000),
  setupTimeHours: z.number().min(0.5).max(8).default(2),
  cycleTimeSeconds: z.number().min(5).max(300).default(30),
  laborRatePerHour: z.number().min(10).max(100).default(25),
  machineRatePerHour: z.number().min(20).max(200).default(50),
  scrapRate: z.number().min(0).max(20).default(3),
  defectRate: z.number().min(0).max(10).default(2),
  toolingCost: z.number().min(500).max(50000).default(5000),
  overheadRate: z.number().min(5).max(50).default(20),
  profitMarginTarget: z.number().min(5).max(40).default(15),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  materialType: z.enum(['steel', 'aluminum', 'stainless_steel', 'copper']).default('steel'),
});

export interface SheetMetalQuoteRiskToolOutput {
  riskAdjustedPrice: number;
  breakdown: {
    materialCostPerPart: number;
    laborCostPerPart: number;
    machineCostPerPart: number;
    setupCostPerPart: number;
    toolingCostPerPart: number;
    overheadCostPerPart: number;
    scrapCostPerPart: number;
    defectCostPerPart: number;
    totalCostWithWaste: number;
    targetPrice: number;
    riskAdjustedPrice: number;
    annualRevenue: number;
    annualProfit: number;
    roi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SheetMetalQuoteRiskToolInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.densityFactor = ((): number => { try { const __v = {"steel": 7.85, "aluminum": 2.7, "stainless_steel": 8.0, "copper": 8.96}; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostPerPart = ((): number => { try { const __v = (input.cycleTimeSeconds / 3600) * input.laborRatePerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.machineCostPerPart = ((): number => { try { const __v = (input.cycleTimeSeconds / 3600) * input.machineRatePerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.batchSize = ((): number => { try { const __v = input.annualVolume / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toolingCostPerPart = ((): number => { try { const __v = input.toolingCost / input.annualVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskFactor = ((): number => { try { const __v = input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.1 : 1.0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCostPerPart = ((): number => { try { const __v = input.materialCostPerKg * (input.partArea * input.materialThickness * 0.000001) * results.densityFactor[input.materialType]; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.setupCostPerPart = ((): number => { try { const __v = input.setupTimeHours * (input.laborRatePerHour + input.machineRatePerHour) / (input.annualVolume / results.batchSize); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCostPerPart = ((): number => { try { const __v = results.materialCostPerPart + results.laborCostPerPart + results.machineCostPerPart + results.setupCostPerPart + results.toolingCostPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCostPerPart = ((): number => { try { const __v = results.directCostPerPart * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPart = ((): number => { try { const __v = results.directCostPerPart + results.overheadCostPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.scrapCostPerPart = ((): number => { try { const __v = results.totalCostPerPart * (input.scrapRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.defectCostPerPart = ((): number => { try { const __v = results.totalCostPerPart * (input.defectRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostWithWaste = ((): number => { try { const __v = results.totalCostPerPart + results.scrapCostPerPart + results.defectCostPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.targetPrice = ((): number => { try { const __v = results.totalCostWithWaste / (1 - input.profitMarginTarget / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskAdjustedPrice = ((): number => { try { const __v = results.targetPrice * results.riskFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualRevenue = ((): number => { try { const __v = results.targetPrice * input.annualVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualProfit = ((): number => { try { const __v = results.annualRevenue * (input.profitMarginTarget / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.annualProfit / input.toolingCost) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSheetMetalQuoteRiskTool(input: SheetMetalQuoteRiskToolInput): SheetMetalQuoteRiskToolOutput {
  const results = evaluateFormulas(input);
  const riskAdjustedPrice = results.riskAdjustedPrice ?? 0;
  const breakdown = {
    materialCostPerPart: results.materialCostPerPart,
    laborCostPerPart: results.laborCostPerPart,
    machineCostPerPart: results.machineCostPerPart,
    setupCostPerPart: results.setupCostPerPart,
    toolingCostPerPart: results.toolingCostPerPart,
    overheadCostPerPart: results.overheadCostPerPart,
    scrapCostPerPart: results.scrapCostPerPart,
    defectCostPerPart: results.defectCostPerPart,
    totalCostWithWaste: results.totalCostWithWaste,
    targetPrice: results.targetPrice,
    riskAdjustedPrice: results.riskAdjustedPrice,
    annualRevenue: results.annualRevenue,
    annualProfit: results.annualProfit,
    roi: results.roi,
  };

  // rule: materialCostPerKg > 0
  // rule: materialThickness > 0
  // rule: partArea > 0
  // rule: annualVolume >= 100
  // rule: setupTimeHours >= 0.5
  // rule: cycleTimeSeconds >= 5
  // rule: laborRatePerHour >= 10
  // rule: machineRatePerHour >= 20
  // rule: scrapRate >= 0 and scrapRate <= 20
  // rule: defectRate >= 0 and defectRate <= 10
  // rule: toolingCost >= 500
  // rule: overheadRate >= 5 and overheadRate <= 50
  // rule: profitMarginTarget >= 5 and profitMarginTarget <= 40
  // rule: if dataConfidence == 'low' then apply risk factor 1.2
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): >5 -> 'Critical: Defect rate exceeds 5%'
  // threshold skipped (non-JS): >10 -> 'Warning: High scrap rate'
  // threshold skipped (non-JS): <10 -> 'Warning: Low profit margin target'

  const dataConfidenceAdjusted = (() => { try { return results.riskAdjustedPrice; } catch { return riskAdjustedPrice; } })();

  return {
    riskAdjustedPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed cost breakdown report"],
  };
}
