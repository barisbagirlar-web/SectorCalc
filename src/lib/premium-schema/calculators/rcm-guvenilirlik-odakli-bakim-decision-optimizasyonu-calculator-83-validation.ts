import { z } from "zod";

export const RcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83InputSchema = z.object({
  failureRateYr: z.number().min(0),
  costPerFailure: z.number().min(0),
  pmIntervalMo: z.number().min(0),
  costPerPm: z.number().min(0),
  cbmSensorCapex: z.number().min(0),
  costPerCbmIntervention: z.number().min(0),
  cbmDetectionRate: z.number().min(0),
});

export type RcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83Input = z.infer<typeof RcmGuvenilirlikOdakliBakimDecisionOptimizasyonuCalculator83InputSchema>;
