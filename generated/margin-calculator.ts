// Auto-generated from margin-calculator-schema.json
import * as z from 'zod';

export interface Margin_calculatorInput {
  revenue: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  defectRate: number;
  reworkCostPerUnit: number;
  unitsProduced: number;
  inventoryHoldingCost: number;
  averageInventoryValue: number;
  logisticsCost: number;
  qualitySystemCost: number;
  productionVolume: number;
  setupTimeHours: number;
  batchSize: number;
  laborRate: number;
  machineDowntimePercent: number;
  energyCostPerUnit: number;
  warrantyReturnRate: number;
  warrantyCostPerReturn: number;
  scrapRate: number;
  materialCostPerUnit: number;
}

export const Margin_calculatorInputSchema = z.object({
  revenue: z.number().min(0).max(100000000).default(100000),
  materialCost: z.number().min(0).max(100000000).default(40000),
  laborCost: z.number().min(0).max(100000000).default(20000),
  overheadCost: z.number().min(0).max(100000000).default(15000),
  defectRate: z.number().min(0).max(100).default(2.5),
  reworkCostPerUnit: z.number().min(0).max(10000).default(50),
  unitsProduced: z.number().min(1).max(1000000).default(1000),
  inventoryHoldingCost: z.number().min(0).max(100).default(15),
  averageInventoryValue: z.number().min(0).max(100000000).default(50000),
  logisticsCost: z.number().min(0).max(100000000).default(10000),
  qualitySystemCost: z.number().min(0).max(100000000).default(5000),
  productionVolume: z.number().min(1).max(1000000).default(1000),
  setupTimeHours: z.number().min(0).max(100).default(2),
  batchSize: z.number().min(1).max(100000).default(100),
  laborRate: z.number().min(0).max(500).default(25),
  machineDowntimePercent: z.number().min(0).max(100).default(5),
  energyCostPerUnit: z.number().min(0).max(100).default(2),
  warrantyReturnRate: z.number().min(0).max(100).default(1),
  warrantyCostPerReturn: z.number().min(0).max(100000).default(200),
  scrapRate: z.number().min(0).max(100).default(1.5),
  materialCostPerUnit: z.number().min(0).max(10000).default(40),
});

function evaluateAllFormulas(input: Margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost + input.laborCost + input.overheadCost; results["totalDirectCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (input.defectRate / 100) * input.unitsProduced * input.reworkCostPerUnit + (input.scrapRate / 100) * input.unitsProduced * input.materialCostPerUnit + (input.warrantyReturnRate / 100) * input.unitsProduced * input.warrantyCostPerReturn; results["qualityCost"] = Number.isFinite(v) ? v : 0; } catch { results["qualityCost"] = 0; }
  try { const v = input.logisticsCost + (input.inventoryHoldingCost / 100) * input.averageInventoryValue; results["logisticsAndInventoryCost"] = Number.isFinite(v) ? v : 0; } catch { results["logisticsAndInventoryCost"] = 0; }
  try { const v = (input.setupTimeHours * input.laborRate * (input.unitsProduced / input.batchSize)) + (input.machineDowntimePercent / 100) * (input.laborCost + input.overheadCost); results["setupAndDowntimeCost"] = Number.isFinite(v) ? v : 0; } catch { results["setupAndDowntimeCost"] = 0; }
  try { const v = input.energyCostPerUnit * input.unitsProduced; results["energyCost"] = Number.isFinite(v) ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) + (results["qualityCost"] ?? 0) + (results["logisticsAndInventoryCost"] ?? 0) + (results["setupAndDowntimeCost"] ?? 0) + (results["energyCost"] ?? 0) + input.qualitySystemCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = ((input.revenue - (results["totalCost"] ?? 0)) / input.revenue) * 100; results["grossMargin"] = Number.isFinite(v) ? v : 0; } catch { results["grossMargin"] = 0; }
  return results;
}


export function calculateMargin_calculator(input: Margin_calculatorInput): Margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["grossMargin"] ?? 0;
  const breakdown = {
    totalDirectCost: values["totalDirectCost"] ?? 0,
    qualityCost: values["qualityCost"] ?? 0,
    logisticsAndInventoryCost: values["logisticsAndInventoryCost"] ?? 0,
    setupAndDowntimeCost: values["setupAndDowntimeCost"] ?? 0,
    energyCost: values["energyCost"] ?? 0,
    qualitySystemCost: values["qualitySystemCost"] ?? 0,
    totalCost: values["totalCost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Defect Loss","Scrap Loss","Warranty Loss","Setup Loss","Downtime Loss","Inventory Holding Loss"];
  const suggestedActions: string[] = ["Implement Six Sigma DMAIC to reduce defect rate below 3%.","Apply Lean waste reduction techniques to lower scrap rate.","Use SMED methodology to cut setup time by 50%.","Implement TPM (Total Productive Maintenance) to reduce downtime.","Adopt Just-In-Time (JIT) inventory to reduce holding costs.","Strengthen ISO 9001 quality management system and root cause analysis."];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: { totalDirectCost: number; qualityCost: number; logisticsAndInventoryCost: number; setupAndDowntimeCost: number; energyCost: number; qualitySystemCost: number; totalCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
