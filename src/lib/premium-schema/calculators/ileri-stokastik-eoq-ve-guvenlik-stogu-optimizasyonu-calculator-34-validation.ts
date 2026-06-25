import { z } from "zod";

export const IleriStokastikEoqVeGuvenlikStoguOptimizasyonuCalculator34InputSchema = z.object({
  annualDemand: z.number().min(0),
  orderCost: z.number().min(0),
  holdingCostUnit: z.number().min(0),
  leadTimeDays: z.number().min(0),
  stdDevDemandDaily: z.number().min(0),
  stdDevLtDays: z.number().min(0),
  serviceLevelZ: z.number().min(0),
});

export type IleriStokastikEoqVeGuvenlikStoguOptimizasyonuCalculator34Input = z.infer<typeof IleriStokastikEoqVeGuvenlikStoguOptimizasyonuCalculator34InputSchema>;
