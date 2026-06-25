import { z } from "zod";

export const AltiSigmaProjectPrioritizerDinamikRtyCalculator2InputSchema = z.object({
  processSteps: z.number().min(0),
  opsPerStep: z.number().min(0),
  defectsPerStep: z.number().min(0),
  annualVolume: z.number().min(0),
  internalFailCost: z.number().min(0),
  externalFailCost: z.number().min(0),
  appraisalCost: z.number().min(0),
  capex: z.number().min(0),
  blackBeltHours: z.number().min(0),
  beltRate: z.number().min(0),
  wacc: z.number().min(0),
  projectLife: z.number().min(0),
  targetSigma: z.number().min(0),
});

export type AltiSigmaProjectPrioritizerDinamikRtyCalculator2Input = z.infer<typeof AltiSigmaProjectPrioritizerDinamikRtyCalculator2InputSchema>;
