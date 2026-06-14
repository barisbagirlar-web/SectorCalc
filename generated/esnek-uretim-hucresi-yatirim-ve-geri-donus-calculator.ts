// Auto-generated from esnek-uretim-hucresi-yatirim-ve-geri-donus-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EsnekUretimHucresiYatirimVeGeriDonusCalculatorInput {
  initialInvestment: number;
  annualOperatingCost: number;
  annualRevenue: number;
  discountRate: number;
  projectLife: number;
  salvageValue: number;
  annualProductionVolume: number;
  defectRate: number;
  setupTimePerBatch: number;
  batchSize: number;
  laborCostPerHour: number;
  energyCostPerUnit: number;
  maintenanceCostPerYear: number;
  dataConfidence: number;
}

export const EsnekUretimHucresiYatirimVeGeriDonusCalculatorInputSchema = z.object({
  initialInvestment: z.number().min(0).default(500000),
  annualOperatingCost: z.number().min(0).default(100000),
  annualRevenue: z.number().min(0).default(300000),
  discountRate: z.number().min(0).max(100).default(10),
  projectLife: z.number().min(1).max(30).default(10),
  salvageValue: z.number().min(0).default(50000),
  annualProductionVolume: z.number().min(0).default(10000),
  defectRate: z.number().min(0).max(100).default(2),
  setupTimePerBatch: z.number().min(0).default(2),
  batchSize: z.number().min(1).default(500),
  laborCostPerHour: z.number().min(0).default(50),
  energyCostPerUnit: z.number().min(0).default(2),
  maintenanceCostPerYear: z.number().min(0).default(20000),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface EsnekUretimHucresiYatirimVeGeriDonusCalculatorOutput {
  npv: number;
  breakdown: {
    annualNetCashFlow: number;
    paybackPeriod: number;
    roi: number;
    costPerUnit: number;
    totalCostPerUnit: number;
    breakEvenVolume: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualNetCashFlow = (() => { try { return input.annualRevenue - input.annualOperatingCost; } catch { return 0; } })();
  results.discountFactor = (() => { try { return 1 / (1 + input.discountRate/100)^t; } catch { return 0; } })();
  results.npv = (() => { try { return 0; } catch { return 0; } })();
  results.paybackPeriod = (() => { try { return input.initialInvestment / results.annualNetCashFlow; } catch { return 0; } })();
  results.roi = (() => { try { return (results.npv / input.initialInvestment) * 100; } catch { return 0; } })();
  results.costPerUnit = (() => { try { return (input.annualOperatingCost + (input.initialInvestment - input.salvageValue)/input.projectLife) / input.annualProductionVolume; } catch { return 0; } })();
  results.laborCostPerUnit = (() => { try { return (input.setupTimePerBatch * input.laborCostPerHour) / input.batchSize + (1/ (input.annualProductionVolume / (input.batchSize * (1 - input.defectRate/100)))) * input.laborCostPerHour; } catch { return 0; } })();
  results.totalCostPerUnit = (() => { try { return results.costPerUnit + input.energyCostPerUnit + input.maintenanceCostPerYear/input.annualProductionVolume + results.laborCostPerUnit; } catch { return 0; } })();
  results.breakEvenVolume = (() => { try { return input.annualOperatingCost / (input.annualRevenue/input.annualProductionVolume - results.totalCostPerUnit); } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = (() => { try { return results.npv * input.dataConfidence; } catch { return 0; } })();
  return results;
}

export function calculateEsnekUretimHucresiYatirimVeGeriDonusCalculator(input: EsnekUretimHucresiYatirimVeGeriDonusCalculatorInput): EsnekUretimHucresiYatirimVeGeriDonusCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    annualNetCashFlow: results.annualNetCashFlow,
    paybackPeriod: results.paybackPeriod,
    roi: results.roi,
    costPerUnit: results.costPerUnit,
    totalCostPerUnit: results.totalCostPerUnit,
    breakEvenVolume: results.breakEvenVolume,
  };

  // rule: initialInvestment > 0
  // rule: annualOperatingCost >= 0
  // rule: annualRevenue >= 0
  // rule: discountRate >= 0 && discountRate <= 100
  // rule: projectLife >= 1 && projectLife <= 30
  // rule: salvageValue >= 0
  // rule: annualProductionVolume > 0
  // rule: defectRate >= 0 && defectRate <= 100
  // rule: setupTimePerBatch >= 0
  // rule: batchSize > 0
  // rule: laborCostPerHour >= 0
  // rule: energyCostPerUnit >= 0
  // rule: maintenanceCostPerYear >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.defectRate > 5) hiddenLossDrivers.push("Critical: Defect rate exceeds 5%");
  if (input.setupTimePerBatch > 4) hiddenLossDrivers.push("Warning: Setup time exceeds 4 hours; consider SMED");
  if (input.discountRate > 20) hiddenLossDrivers.push("Warning: Discount rate is very high; check cost of capital");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNpv; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (multi-year comparison)","Scenario Comparison (what-if)","Detailed Report with Charts"],
  };
}
