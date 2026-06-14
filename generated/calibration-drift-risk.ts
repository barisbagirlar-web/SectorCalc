// Auto-generated from calibration-drift-risk-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CalibrationDriftRiskInput {
  calibrationIntervalDays: number;
  driftRatePerDay: number;
  toleranceLimit: number;
  numberOfInstruments: number;
  costPerCalibration: number;
  costOfFailure: number;
  dataConfidence: number;
}

export const CalibrationDriftRiskInputSchema = z.object({
  calibrationIntervalDays: z.number().min(1).max(365).default(90),
  driftRatePerDay: z.number().min(0).max(100).default(0.01),
  toleranceLimit: z.number().min(0).max(100).default(1),
  numberOfInstruments: z.number().min(1).max(10000).default(10),
  costPerCalibration: z.number().min(0).default(500),
  costOfFailure: z.number().min(0).default(10000),
  dataConfidence: z.number().min(0).max(100).default(95),
});

export interface CalibrationDriftRiskOutput {
  totalAnnualRiskCost: number;
  breakdown: {
    expectedDrift: number;
    driftRiskIndex: number;
    probabilityOfFailure: number;
    expectedAnnualFailures: number;
    annualCalibrationCost: number;
    annualFailureCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CalibrationDriftRiskInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.expectedDrift = ((): number => { try { const __v = input.driftRatePerDay * input.calibrationIntervalDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driftRiskIndex = ((): number => { try { const __v = results.expectedDrift / input.toleranceLimit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.probabilityOfFailure = ((): number => { try { const __v = results.driftRiskIndex > 1 ? 1 : results.driftRiskIndex; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedAnnualFailures = ((): number => { try { const __v = results.probabilityOfFailure * input.numberOfInstruments * (365 / input.calibrationIntervalDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCalibrationCost = ((): number => { try { const __v = input.numberOfInstruments * (365 / input.calibrationIntervalDays) * input.costPerCalibration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualFailureCost = ((): number => { try { const __v = results.expectedAnnualFailures * input.costOfFailure; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualRiskCost = ((): number => { try { const __v = results.annualCalibrationCost + results.annualFailureCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedRisk = ((): number => { try { const __v = results.totalAnnualRiskCost * (1 + (1 - input.dataConfidence/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCalibrationDriftRisk(input: CalibrationDriftRiskInput): CalibrationDriftRiskOutput {
  const results = evaluateFormulas(input);
  const totalAnnualRiskCost = results.totalAnnualRiskCost ?? 0;
  const breakdown = {
    expectedDrift: results.expectedDrift,
    driftRiskIndex: results.driftRiskIndex,
    probabilityOfFailure: results.probabilityOfFailure,
    expectedAnnualFailures: results.expectedAnnualFailures,
    annualCalibrationCost: results.annualCalibrationCost,
    annualFailureCost: results.annualFailureCost,
  };

  // rule: calibrationIntervalDays must be >= 1 and <= 365
  // rule: driftRatePerDay must be >= 0 and <= 100
  // rule: toleranceLimit must be > 0
  // rule: numberOfInstruments must be >= 1
  // rule: costPerCalibration must be >= 0
  // rule: costOfFailure must be >= 0
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): driftRiskIndex

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedRisk; } catch { return totalAnnualRiskCost; } })();

  return {
    totalAnnualRiskCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed report with breakdown and recommendations"],
  };
}
