// Auto-generated from iot-sensor-ve-ongorucu-bakim-yatirim-geri-donus-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInput {
  sensorCostPerUnit: number;
  numberOfSensors: number;
  annualMaintenanceCostTraditional: number;
  maintenanceCostReductionPercent: number;
  annualDowntimeHoursTraditional: number;
  downtimeReductionPercent: number;
  costPerDowntimeHour: number;
  sensorLifespanYears: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInputSchema = z.object({
  sensorCostPerUnit: z.number().min(50).max(10000).default(500),
  numberOfSensors: z.number().min(1).max(1000).default(10),
  annualMaintenanceCostTraditional: z.number().min(1000).max(10000000).default(100000),
  maintenanceCostReductionPercent: z.number().min(0).max(50).default(20),
  annualDowntimeHoursTraditional: z.number().min(0).max(8760).default(200),
  downtimeReductionPercent: z.number().min(0).max(80).default(30),
  costPerDowntimeHour: z.number().min(100).max(100000).default(5000),
  sensorLifespanYears: z.number().min(1).max(20).default(5),
  discountRate: z.number().min(0).max(30).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorOutput {
  netPresentValue: number;
  breakdown: {
    totalSensorInvestment: number;
    annualMaintenanceSavings: number;
    annualDowntimeSavings: number;
    annualTotalSavings: number;
    paybackPeriodYears: number;
    returnOnInvestment: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalSensorInvestment = ((): number => { try { const __v = input.sensorCostPerUnit * input.numberOfSensors; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualMaintenanceSavings = ((): number => { try { const __v = input.annualMaintenanceCostTraditional * (input.maintenanceCostReductionPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDowntimeSavings = ((): number => { try { const __v = input.annualDowntimeHoursTraditional * (input.downtimeReductionPercent / 100) * input.costPerDowntimeHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualTotalSavings = ((): number => { try { const __v = results.annualMaintenanceSavings + results.annualDowntimeSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netPresentValue = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriodYears = ((): number => { try { const __v = results.totalSensorInvestment / results.annualTotalSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.returnOnInvestment = ((): number => { try { const __v = (results.annualTotalSavings * input.sensorLifespanYears - results.totalSensorInvestment) / results.totalSensorInvestment * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedNPV = ((): number => { try { const __v = results.netPresentValue * (input.dataConfidence == 'low' ? 0.8 : input.dataConfidence == 'medium' ? 0.9 : 1.0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIotSensorVeOngorucuBakimYatirimGeriDonusCalculator(input: IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorInput): IotSensorVeOngorucuBakimYatirimGeriDonusCalculatorOutput {
  const results = evaluateFormulas(input);
  const netPresentValue = results.netPresentValue ?? 0;
  const breakdown = {
    totalSensorInvestment: results.totalSensorInvestment,
    annualMaintenanceSavings: results.annualMaintenanceSavings,
    annualDowntimeSavings: results.annualDowntimeSavings,
    annualTotalSavings: results.annualTotalSavings,
    paybackPeriodYears: results.paybackPeriodYears,
    returnOnInvestment: results.returnOnInvestment,
  };

  // rule: sensorCostPerUnit > 0
  // rule: numberOfSensors > 0
  // rule: annualMaintenanceCostTraditional > 0
  // rule: maintenanceCostReductionPercent >= 0 && maintenanceCostReductionPercent <= 50
  // rule: annualDowntimeHoursTraditional >= 0
  // rule: downtimeReductionPercent >= 0 && downtimeReductionPercent <= 80
  // rule: costPerDowntimeHour > 0
  // rule: sensorLifespanYears > 0
  // rule: discountRate >= 0 && discountRate <= 30
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High reduction may require significant process changes
  // threshold skipped (non-JS): Aggressive target; verify feasibility
  // threshold skipped (non-JS): High discount rate may undervalue long-term benefits

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNPV; } catch { return netPresentValue; } })();

  return {
    netPresentValue,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
