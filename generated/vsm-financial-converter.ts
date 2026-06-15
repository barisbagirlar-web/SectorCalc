// Auto-generated from vsm-financial-converter-schema.json
import * as z from 'zod';

export interface Vsm_financial_converterInput {
  annualDemand: number;
  sellingPrice: number;
  materialCostPerUnit: number;
  laborCostPerHour: number;
  totalCycleTime: number;
  totalValueAddedTime: number;
  defectRate: number;
  reworkCostPerUnit: number;
  inventoryHoldingCostPercent: number;
  averageInventoryValue: number;
  overheadRate: number;
  operatorsPerShift: number;
  shiftsPerDay: number;
  workingDaysPerYear: number;
  wasteReductionTarget: number;
}

export const Vsm_financial_converterInputSchema = z.object({
  annualDemand: z.number().min(1000).max(10000000).default(100000),
  sellingPrice: z.number().min(1).max(10000).default(50),
  materialCostPerUnit: z.number().min(0).max(5000).default(20),
  laborCostPerHour: z.number().min(5).max(200).default(25),
  totalCycleTime: z.number().min(0.1).max(1000).default(45),
  totalValueAddedTime: z.number().min(0).max(1000).default(15),
  defectRate: z.number().min(0).max(100).default(2),
  reworkCostPerUnit: z.number().min(0).max(1000).default(10),
  inventoryHoldingCostPercent: z.number().min(0).max(50).default(20),
  averageInventoryValue: z.number().min(0).max(100000000).default(500000),
  overheadRate: z.number().min(0).max(500).default(150),
  operatorsPerShift: z.number().min(1).max(500).default(10),
  shiftsPerDay: z.number().min(1).max(3).default(2),
  workingDaysPerYear: z.number().min(200).max(365).default(240),
  wasteReductionTarget: z.number().min(0).max(100).default(15),
});

function evaluateAllFormulas(input: Vsm_financial_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["f1_laborCostPerUnit"] = (input.totalCycleTime / 60) * input.laborCostPerHour; } catch { results["f1_laborCostPerUnit"] = 0; }
  try { results["f2_overheadCostPerUnit"] = (results["f1_laborCostPerUnit"] ?? 0) * (input.overheadRate / 100); } catch { results["f2_overheadCostPerUnit"] = 0; }
  try { results["f3_qualityCostPerUnit"] = (input.defectRate / 100) * input.reworkCostPerUnit; } catch { results["f3_qualityCostPerUnit"] = 0; }
  try { results["f4_inventoryCostPerUnit"] = (input.averageInventoryValue * (input.inventoryHoldingCostPercent / 100)) / input.annualDemand; } catch { results["f4_inventoryCostPerUnit"] = 0; }
  try { results["f5_totalCostPerUnit"] = input.materialCostPerUnit + (results["f1_laborCostPerUnit"] ?? 0) + (results["f2_overheadCostPerUnit"] ?? 0) + (results["f3_qualityCostPerUnit"] ?? 0) + (results["f4_inventoryCostPerUnit"] ?? 0); } catch { results["f5_totalCostPerUnit"] = 0; }
  try { results["f6_profitPerUnit"] = input.sellingPrice - (results["f5_totalCostPerUnit"] ?? 0); } catch { results["f6_profitPerUnit"] = 0; }
  try { results["f7_annualWasteLoss"] = ((input.totalCycleTime - input.totalValueAddedTime) / input.totalCycleTime) * (results["f5_totalCostPerUnit"] ?? 0) * input.annualDemand; } catch { results["f7_annualWasteLoss"] = 0; }
  try { results["f8_primaryResult"] = ((results["f6_profitPerUnit"] ?? 0) * input.annualDemand) - (results["f7_annualWasteLoss"] ?? 0); } catch { results["f8_primaryResult"] = 0; }
  return results;
}


export function calculateVsm_financial_converter(input: Vsm_financial_converterInput): Vsm_financial_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualProfitAfterWaste"] ?? 0;
  const breakdown = {
    totalRevenue: values["totalRevenue"] ?? 0,
    totalMaterialCost: values["totalMaterialCost"] ?? 0,
    totalLaborCost: values["totalLaborCost"] ?? 0,
    totalOverheadCost: values["totalOverheadCost"] ?? 0,
    totalQualityCost: values["totalQualityCost"] ?? 0,
    totalInventoryCost: values["totalInventoryCost"] ?? 0,
    totalWasteLoss: values["totalWasteLoss"] ?? 0,
    potentialSavings: values["potentialSavings"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Non-Value-Added Time","Quality Defect Rework","Inventory Carrying Cost","Overhead Allocation"];
  const suggestedActions: string[] = ["Implement Kaizen on bottleneck processes","Deploy Six Sigma DMAIC for defect reduction","Introduce Kanban system to reduce WIP inventory","Review overhead allocation and eliminate non-value-adding activities"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-scenario simulation"],
  };
}


export interface Vsm_financial_converterOutput {
  totalWasteCost: number;
  breakdown: { totalRevenue: number; totalMaterialCost: number; totalLaborCost: number; totalOverheadCost: number; totalQualityCost: number; totalInventoryCost: number; totalWasteLoss: number; potentialSavings: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
