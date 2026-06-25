import { z } from "zod";

export const BulutApiAsimKisitlamaThrottlingVeSlaMaliyetleriCalculator18InputSchema = z.object({
  totalReqs: z.number().min(0),
  includedReqs: z.number().min(0),
  overageRate: z.number().min(0),
  throttleRate: z.number().min(0),
  retryCost: z.number().min(0),
  egressGb: z.number().min(0),
  egressRate: z.number().min(0),
  slaTarget: z.number().min(0),
  actualUptime: z.number().min(0),
  monthlyFee: z.number().min(0),
});

export type BulutApiAsimKisitlamaThrottlingVeSlaMaliyetleriCalculator18Input = z.infer<typeof BulutApiAsimKisitlamaThrottlingVeSlaMaliyetleriCalculator18InputSchema>;
