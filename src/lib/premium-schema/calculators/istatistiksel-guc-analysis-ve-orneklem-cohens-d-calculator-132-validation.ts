import { z } from "zod";

export const IstatistikselGucAnalysisVeOrneklemCohensDCalculator132InputSchema = z.object({
  meanGroup1: z.number().min(0),
  meanGroup2: z.number().min(0),
  stdDev1: z.number().min(0),
  stdDev2: z.number().min(0),
  alphaLevel: z.number().min(0),
  targetPower: z.number().min(0),
  attritionRate: z.number().min(0),
});

export type IstatistikselGucAnalysisVeOrneklemCohensDCalculator132Input = z.infer<typeof IstatistikselGucAnalysisVeOrneklemCohensDCalculator132InputSchema>;
