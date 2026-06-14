// Auto-generated from kapasite-planlama-ve-darbogaz-yatirim-onceliklendirme-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInput {
  annualDemand: number;
  availableWorkingDaysPerYear: number;
  shiftsPerDay: number;
  hoursPerShift: number;
  overallEquipmentEffectiveness: number;
  cycleTimePerUnit: number;
  defectRate: number;
  setupTimePerBatch: number;
  batchSize: number;
  bottleneckMachineCapacity: number;
  investmentCost: number;
  costPerUnit: number;
  sellingPricePerUnit: number;
  discountRate: number;
  projectLifeYears: number;
  dataConfidence: number;
}

export const KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInputSchema = z.object({
  annualDemand: z.number().min(0).default(100000),
  availableWorkingDaysPerYear: z.number().min(1).max(365).default(250),
  shiftsPerDay: z.number().min(1).max(3).default(1),
  hoursPerShift: z.number().min(1).max(12).default(8),
  overallEquipmentEffectiveness: z.number().min(0).max(100).default(85),
  cycleTimePerUnit: z.number().min(0.01).default(5),
  defectRate: z.number().min(0).max(100).default(2),
  setupTimePerBatch: z.number().min(0).default(30),
  batchSize: z.number().min(1).default(1000),
  bottleneckMachineCapacity: z.number().min(0.01).default(100),
  investmentCost: z.number().min(0).default(500000),
  costPerUnit: z.number().min(0).default(50),
  sellingPricePerUnit: z.number().min(0).default(100),
  discountRate: z.number().min(0).max(100).default(10),
  projectLifeYears: z.number().min(1).max(30).default(5),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorOutput {
  npv: number;
  breakdown: {
    availableCapacity: number;
    theoreticalCapacity: number;
    effectiveCapacity: number;
    taktTime: number;
    bottleneckUtilization: number;
    capacityGap: number;
    additionalCapacityNeeded: number;
    annualRevenue: number;
    annualCost: number;
    annualProfit: number;
    irr: number;
    paybackPeriod: number;
    roi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.availableCapacity = ((): number => { try { const __v = input.availableWorkingDaysPerYear * input.shiftsPerDay * input.hoursPerShift * 60 * (input.overallEquipmentEffectiveness / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.theoreticalCapacity = ((): number => { try { const __v = results.availableCapacity / input.cycleTimePerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveCapacity = ((): number => { try { const __v = results.theoreticalCapacity * (1 - input.defectRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.taktTime = ((): number => { try { const __v = (input.availableWorkingDaysPerYear * input.shiftsPerDay * input.hoursPerShift * 60) / input.annualDemand; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bottleneckUtilization = ((): number => { try { const __v = input.annualDemand / (input.bottleneckMachineCapacity * input.availableWorkingDaysPerYear * input.shiftsPerDay * input.hoursPerShift * (input.overallEquipmentEffectiveness / 100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.capacityGap = ((): number => { try { const __v = input.annualDemand - results.effectiveCapacity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.additionalCapacityNeeded = ((): number => { try { const __v = results.capacityGap > 0 ? results.capacityGap : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualRevenue = ((): number => { try { const __v = input.annualDemand * input.sellingPricePerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCost = ((): number => { try { const __v = input.annualDemand * input.costPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualProfit = ((): number => { try { const __v = results.annualRevenue - results.annualCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.irr = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = input.investmentCost / results.annualProfit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.annualProfit * input.projectLifeYears - input.investmentCost) / input.investmentCost * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedNPV = ((): number => { try { const __v = results.npv * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculator(input: KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorInput): KapasitePlanlamaVeDarbogazYatirimOnceliklendirmeCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    availableCapacity: results.availableCapacity,
    theoreticalCapacity: results.theoreticalCapacity,
    effectiveCapacity: results.effectiveCapacity,
    taktTime: results.taktTime,
    bottleneckUtilization: results.bottleneckUtilization,
    capacityGap: results.capacityGap,
    additionalCapacityNeeded: results.additionalCapacityNeeded,
    annualRevenue: results.annualRevenue,
    annualCost: results.annualCost,
    annualProfit: results.annualProfit,
    irr: results.irr,
    paybackPeriod: results.paybackPeriod,
    roi: results.roi,
  };

  // rule: annualDemand > 0
  // rule: availableWorkingDaysPerYear >= 1 && availableWorkingDaysPerYear <= 365
  // rule: shiftsPerDay >= 1 && shiftsPerDay <= 3
  // rule: hoursPerShift >= 1 && hoursPerShift <= 12
  // rule: overallEquipmentEffectiveness >= 0 && overallEquipmentEffectiveness <= 100
  // rule: cycleTimePerUnit > 0
  // rule: defectRate >= 0 && defectRate <= 100
  // rule: setupTimePerBatch >= 0
  // rule: batchSize > 0
  // rule: bottleneckMachineCapacity > 0
  // rule: investmentCost >= 0
  // rule: costPerUnit > 0
  // rule: sellingPricePerUnit > costPerUnit
  // rule: discountRate >= 0 && discountRate <= 100
  // rule: projectLifeYears >= 1 && projectLifeYears <= 30
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.defectRate > 5) hiddenLossDrivers.push("Kritik: Hata orani %5 uzerinde, kalite iyilestirme gerekli.");
  if (input.overallEquipmentEffectiveness < 85) hiddenLossDrivers.push("Uyari: OEE %85 altinda, iyilestirme firsati.");
  if (input.cycleTimePerUnit > (input.availableWorkingDaysPerYear * input.shiftsPerDay * input.hoursPerShift * 60 / input.annualDemand)) hiddenLossDrivers.push("Uyari: Cevrim suresi Takt Time uzerinde, darbogaz riski.");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNPV; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis verilerle karsilastirma)","Senaryo karsilastirma (birden fazla yatirim secenegi)","Detayli rapor (tum ara degiskenler ve grafikler)"],
  };
}
