// Auto-generated from 3d-print-job-margin-tool-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface Tool3dPrintJobMarginToolInput {
  materialCostPerKg: number;
  materialUsageKg: number;
  printTimeHours: number;
  machineHourlyRate: number;
  laborHourlyRate: number;
  laborHours: number;
  energyCostPerKwh: number;
  machinePowerKw: number;
  defectRate: number;
  overheadRate: number;
  sellingPrice: number;
  dataConfidence: number;
}

export const Tool3dPrintJobMarginToolInputSchema = z.object({
  materialCostPerKg: z.number().min(0).default(50),
  materialUsageKg: z.number().min(0).default(0.5),
  printTimeHours: z.number().min(0).default(10),
  machineHourlyRate: z.number().min(0).default(15),
  laborHourlyRate: z.number().min(0).default(25),
  laborHours: z.number().min(0).default(2),
  energyCostPerKwh: z.number().min(0).default(0.12),
  machinePowerKw: z.number().min(0).default(0.5),
  defectRate: z.number().min(0).max(100).default(5),
  overheadRate: z.number().min(0).default(20),
  sellingPrice: z.number().min(0).default(200),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface Tool3dPrintJobMarginToolOutput {
  marginPercent: number;
  breakdown: {
    materialCost: number;
    machineCost: number;
    laborCost: number;
    energyCost: number;
    overheadCost: number;
    defectCost: number;
    totalCost: number;
    margin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: Tool3dPrintJobMarginToolInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.materialCost = (() => { try { return input.materialCostPerKg * input.materialUsageKg; } catch { return 0; } })();
  results.machineCost = (() => { try { return input.machineHourlyRate * input.printTimeHours; } catch { return 0; } })();
  results.laborCost = (() => { try { return input.laborHourlyRate * input.laborHours; } catch { return 0; } })();
  results.energyCost = (() => { try { return input.energyCostPerKwh * input.machinePowerKw * input.printTimeHours; } catch { return 0; } })();
  results.directCost = (() => { try { return results.materialCost + results.machineCost + results.laborCost + results.energyCost; } catch { return 0; } })();
  results.overheadCost = (() => { try { return results.directCost * (input.overheadRate / 100); } catch { return 0; } })();
  results.totalCost = (() => { try { return results.directCost + results.overheadCost; } catch { return 0; } })();
  results.defectCost = (() => { try { return results.totalCost * (input.defectRate / 100); } catch { return 0; } })();
  results.adjustedTotalCost = (() => { try { return results.totalCost + results.defectCost; } catch { return 0; } })();
  results.margin = (() => { try { return input.sellingPrice - results.adjustedTotalCost; } catch { return 0; } })();
  results.marginPercent = (() => { try { return (results.margin / input.sellingPrice) * 100; } catch { return 0; } })();
  results.dataConfidenceAdjustedMargin = (() => { try { return results.margin * (input.dataConfidence / 100); } catch { return 0; } })();
  return results;
}

export function calculateTool3dPrintJobMarginTool(input: Tool3dPrintJobMarginToolInput): Tool3dPrintJobMarginToolOutput {
  const results = evaluateFormulas(input);
  const marginPercent = results.marginPercent ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    machineCost: results.machineCost,
    laborCost: results.laborCost,
    energyCost: results.energyCost,
    overheadCost: results.overheadCost,
    defectCost: results.defectCost,
    totalCost: results.totalCost,
    margin: results.margin,
  };

  // rule: materialCostPerKg >= 0
  // rule: materialUsageKg >= 0
  // rule: printTimeHours >= 0
  // rule: machineHourlyRate >= 0
  // rule: laborHourlyRate >= 0
  // rule: laborHours >= 0
  // rule: energyCostPerKwh >= 0
  // rule: machinePowerKw >= 0
  // rule: defectRate >= 0 && defectRate <= 100
  // rule: overheadRate >= 0
  // rule: sellingPrice >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.defectRate > 10) hiddenLossDrivers.push("High defect rate: investigate process stability");
  if (marginPercent < 10) hiddenLossDrivers.push("Low margin: consider cost reduction or price increase");
  if (input.dataConfidence < 50) hiddenLossDrivers.push("Low data confidence: results may be unreliable");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedMargin; } catch { return marginPercent; } })();

  return {
    marginPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed cost breakdown report"],
  };
}
