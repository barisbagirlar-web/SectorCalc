import { z } from "zod";

export const KaizenFinansalEtkiVeSurdurulebilirlikRoiCalculator63InputSchema = z.object({
  baselineCost: z.number().min(0),
  actualCost: z.number().min(0),
  timeSavedMin: z.number().min(0),
  laborRate: z.number().min(0),
  conversionFactor: z.number().min(0),
  annualVolume: z.number().min(0),
  implementationCost: z.number().min(0),
  month1Savings: z.number().min(0),
  month6Savings: z.number().min(0),
});

export type KaizenFinansalEtkiVeSurdurulebilirlikRoiCalculator63Input = z.infer<typeof KaizenFinansalEtkiVeSurdurulebilirlikRoiCalculator63InputSchema>;
