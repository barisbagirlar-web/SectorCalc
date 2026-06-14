// Auto-generated from tolerance-drift-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ToleranceDriftCalculatorInput {
  nominalDimension: number;
  upperTolerance: number;
  lowerTolerance: number;
  measuredMean: number;
  processCapability: number;
  sampleSize: number;
  dataConfidence: '90%' | '95%' | '99%';
  driftDirection: 'upward' | 'downward' | 'both';
}

export const ToleranceDriftCalculatorInputSchema = z.object({
  nominalDimension: z.number().min(0).max(10000).default(100),
  upperTolerance: z.number().min(0).max(100).default(0.1),
  lowerTolerance: z.number().min(-100).max(0).default(-0.1),
  measuredMean: z.number().min(0).max(10000).default(100.05),
  processCapability: z.number().min(0).max(3).default(1.33),
  sampleSize: z.number().min(1).max(10000).default(30),
  dataConfidence: z.enum(['90%', '95%', '99%']).default('95%'),
  driftDirection: z.enum(['upward', 'downward', 'both']).default('both'),
});

export interface ToleranceDriftCalculatorOutput {
  driftRatio: number;
  breakdown: {
    drift: number;
    toleranceRange: number;
    driftRatio: number;
    driftStatus: number;
    adjustedCpk: number;
    marginOfError: number;
    driftDetected: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ToleranceDriftCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toleranceRange = ((): number => { try { const __v = input.upperTolerance - input.lowerTolerance; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.drift = ((): number => { try { const __v = input.measuredMean - input.nominalDimension; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driftRatio = ((): number => { try { const __v = Math.abs(results.drift) / (results.toleranceRange / 2); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driftStatus = ((): number => { try { const __v = results.driftRatio > 0.5 ? 'critical' : (results.driftRatio > 0.3 ? 'warning' : 'normal'); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedCpk = ((): number => { try { const __v = input.processCapability * (1 - results.driftRatio); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.confidenceZ = ((): number => { try { const __v = input.dataConfidence == '99%' ? 2.576 : (input.dataConfidence == '95%' ? 1.96 : 1.645); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginOfError = ((): number => { try { const __v = results.confidenceZ * (results.toleranceRange / 2) / Math.sqrt(input.sampleSize); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driftDetected = ((): number => { try { const __v = Math.abs(results.drift) > results.marginOfError ? true : false; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateToleranceDriftCalculator(input: ToleranceDriftCalculatorInput): ToleranceDriftCalculatorOutput {
  const results = evaluateFormulas(input);
  const driftRatio = results.driftRatio ?? 0;
  const breakdown = {
    drift: results.drift,
    toleranceRange: results.toleranceRange,
    driftRatio: results.driftRatio,
    driftStatus: results.driftStatus,
    adjustedCpk: results.adjustedCpk,
    marginOfError: results.marginOfError,
    driftDetected: results.driftDetected,
  };

  // rule: upperTolerance must be > 0
  // rule: lowerTolerance must be < 0
  // rule: nominalDimension + upperTolerance > nominalDimension + lowerTolerance
  // rule: sampleSize >= 2
  // rule: processCapability > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.5
  // threshold skipped (non-JS): 1.33

  const dataConfidenceAdjusted = (() => { try { return results.adjustedCpk; } catch { return driftRatio; } })();

  return {
    driftRatio,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical drift tracking)","Comparison with previous runs","Detailed statistical report with control charts"],
  };
}
