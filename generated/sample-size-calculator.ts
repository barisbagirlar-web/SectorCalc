// Auto-generated from sample-size-calculator-schema.json
import * as z from 'zod';

export interface Sample_size_calculatorInput {
  confidenceLevel: string;
  marginOfError: number;
  populationSize: number;
  expectedProportion: number;
  standardDeviation: number;
  effectSize: number;
  samplingMethod: string;
  useFiniteCorrection: boolean;
}

export const Sample_size_calculatorInputSchema = z.object({
  confidenceLevel: z.enum(['90', '95', '99']).default('95'),
  marginOfError: z.number().min(1).max(20).default(5),
  populationSize: z.number().min(1).max(10000000).default(10000),
  expectedProportion: z.number().min(0.1).max(50).default(5),
  standardDeviation: z.number().min(0.01).max(100).default(1),
  effectSize: z.number().min(0.01).max(10).default(0.5),
  samplingMethod: z.enum(['simpleRandom', 'stratified', 'cluster', 'systematic']).default('simpleRandom'),
  useFiniteCorrection: z.boolean().default(true),
});

function evaluateAllFormulas(input: Sample_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.confidenceLevel == '90') ? (1.645) : (((input.confidenceLevel == '95') ? (1.96) : (2.576)))); results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  try { const v = ((input.samplingMethod == 'simpleRandom') ? (1.0) : (((input.samplingMethod == 'stratified') ? (0.9) : (((input.samplingMethod == 'cluster') ? (1.5) : (1.2)))))); results["designEffect"] = Number.isFinite(v) ? v : 0; } catch { results["designEffect"] = 0; }
  try { const v = Math.ceil(((results["zScore"] ?? 0)**2 * (input.expectedProportion/100) * (1 - input.expectedProportion/100)) / ((input.marginOfError/100)**2)); results["sampleSizeInfinite"] = Number.isFinite(v) ? v : 0; } catch { results["sampleSizeInfinite"] = 0; }
  try { const v = ((input.useFiniteCorrection) ? (Math.ceil((results["sampleSizeInfinite"] ?? 0) / (1 + ((results["sampleSizeInfinite"] ?? 0) - 1) / input.populationSize))) : ((results["sampleSizeInfinite"] ?? 0))); results["sampleSizeFinite"] = Number.isFinite(v) ? v : 0; } catch { results["sampleSizeFinite"] = 0; }
  try { const v = Math.ceil(((results["zScore"] ?? 0)**2 * input.standardDeviation**2) / input.effectSize**2); results["sampleSizeVariables"] = Number.isFinite(v) ? v : 0; } catch { results["sampleSizeVariables"] = 0; }
  try { const v = Math.ceil(Math.max((results["sampleSizeFinite"] ?? 0), (results["sampleSizeVariables"] ?? 0)) * (results["designEffect"] ?? 0)); results["finalSampleSize"] = Number.isFinite(v) ? v : 0; } catch { results["finalSampleSize"] = 0; }
  try { const v = Math.min(input.confidenceLevel, 100 * (1 - (input.populationSize - (results["finalSampleSize"] ?? 0)) / input.populationSize)); results["dataConfidenceAdjusted"] = Number.isFinite(v) ? v : 0; } catch { results["dataConfidenceAdjusted"] = 0; }
  return results;
}


export function calculateSample_size_calculator(input: Sample_size_calculatorInput): Sample_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    description: values["description"] ?? 0,
    components: values["components"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Process Variation","Very Low Expected Defect Rate","Cluster Sampling Inefficiency"];
  const suggestedActions: string[] = ["Reduce Confidence Level","Increase Margin of Error","Switch to Stratified Sampling","Reduce Process Variation"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-lot aggregation","Historical data import"],
  };
}


export interface Sample_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; description: number; components: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
