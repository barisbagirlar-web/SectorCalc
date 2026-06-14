// Auto-generated from muda-hunter-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MudaHunterInput {
  analysisPeriodDays: number;
  productionUnits: number;
  unitVariableCost: number;
  unitSellingPrice: number;
  revenue: number;
  excessProductionUnits: number;
  waitingHours: number;
  waitingOpportunityCostMode: 'manual' | 'automatic';
  hourlyOpportunityCost: number;
  transportDistanceKm: number;
  transportCostPerKm: number;
  excessInventoryValue: number;
  inventoryCarryingRate: number;
  motionWasteHours: number;
  averageLaborRate: number;
  defectUnits: number;
  reworkCostPerUnit: number;
  scrapValuePerUnit: number;
  overprocessingHours: number;
  overprocessingCostPerHour: number;
  dataConfidence: number;
  implementationDifficulty: number;
}

export const MudaHunterInputSchema = z.object({
  analysisPeriodDays: z.number().min(1).max(365).default(30),
  productionUnits: z.number().min(0).default(10000),
  unitVariableCost: z.number().min(0).default(50),
  unitSellingPrice: z.number().min(0).default(100),
  revenue: z.number().min(0).default(1000000),
  excessProductionUnits: z.number().min(0).default(500),
  waitingHours: z.number().min(0).default(200),
  waitingOpportunityCostMode: z.enum(['manual', 'automatic']).default('automatic'),
  hourlyOpportunityCost: z.number().min(0).default(100),
  transportDistanceKm: z.number().min(0).default(5000),
  transportCostPerKm: z.number().min(0).default(2),
  excessInventoryValue: z.number().min(0).default(50000),
  inventoryCarryingRate: z.number().min(0).max(100).default(20),
  motionWasteHours: z.number().min(0).default(100),
  averageLaborRate: z.number().min(0).default(30),
  defectUnits: z.number().min(0).default(200),
  reworkCostPerUnit: z.number().min(0).default(20),
  scrapValuePerUnit: z.number().min(0).default(5),
  overprocessingHours: z.number().min(0).default(150),
  overprocessingCostPerHour: z.number().min(0).default(40),
  dataConfidence: z.number().min(0).max(100).default(80),
  implementationDifficulty: z.number().min(1).max(5).default(3),
});

export interface MudaHunterOutput {
  totalWasteCost: number;
  breakdown: {
    overproduction: number;
    waiting: number;
    transport: number;
    inventory: number;
    motion: number;
    defects: number;
    overprocessing: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MudaHunterInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.excessProductionWaste = input.excessProductionUnits * input.unitVariableCost;
  results.waitingWaste = input.waitingOpportunityCostMode === 'manual' ? input.waitingHours * input.hourlyOpportunityCost : input.waitingHours * (input.unitSellingPrice - input.unitVariableCost);
  results.transportWaste = input.transportDistanceKm * input.transportCostPerKm;
  results.inventoryWaste = input.excessInventoryValue * (input.inventoryCarryingRate/100) * (input.analysisPeriodDays/365);
  results.motionWaste = input.motionWasteHours * input.averageLaborRate;
  results.defectWaste = input.defectUnits * (input.reworkCostPerUnit + input.unitVariableCost - input.scrapValuePerUnit);
  results.overprocessingWaste = input.overprocessingHours * input.overprocessingCostPerHour;
  results.totalWasteCost = results.excessProductionWaste + results.waitingWaste + results.transportWaste + results.inventoryWaste + results.motionWaste + results.defectWaste + results.overprocessingWaste;
  return results;
}

export function calculateMudaHunter(input: MudaHunterInput): MudaHunterOutput {
  const results = evaluateFormulas(input);
  const totalWasteCost = results.totalWasteCost;
  const breakdown = {
    overproduction: results.excessProductionWaste,
    waiting: results.waitingWaste,
    transport: results.transportWaste,
    inventory: results.inventoryWaste,
    motion: results.motionWaste,
    defects: results.defectWaste,
    overprocessing: results.overprocessingWaste,
  };

  // rule: Eğer Waiting opportunity cost mode 'manual' ise Hourly opportunity cost > 0 olmalı
  // rule: Data confidence 0-100 arasında
  // rule: Implementation difficulty 1-5 arasında tamsayı
  // threshold defectRate: defectUnits / productionUnits > 0.05 → 'KRITIK' uyarısı
  // threshold inventoryCarryingCost: excessInventoryValue * (inventoryCarryingRate/100) > revenue*0.1 → yüksek stok maliyeti
  const hiddenLossDrivers: string[] = ["string"];
  const suggestedActions: string[] = ["string"];
  const dataConfidenceAdjusted = results.totalWasteCost * (input.dataConfidence/100);

  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Historical trend analysis (paid plans)","Benchmarking against industry averages"],
  };
}
