import { z } from "zod";

export const SmedMatrisiVeEoqEnvanterOptimizasyonuCalculator25InputSchema = z.object({
  internalSetupMin: z.number().min(0),
  externalSetupMin: z.number().min(0),
  conversionRate: z.number().min(0),
  changeoversYr: z.number().min(0),
  machineRate: z.number().min(0),
  annualDemand: z.number().min(0),
  holdingCostUnit: z.number().min(0),
});

export type SmedMatrisiVeEoqEnvanterOptimizasyonuCalculator25Input = z.infer<typeof SmedMatrisiVeEoqEnvanterOptimizasyonuCalculator25InputSchema>;
