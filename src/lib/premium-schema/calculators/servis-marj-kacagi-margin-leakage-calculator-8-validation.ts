import { z } from "zod";

export const ServisMarjKacagiMarginLeakageCalculator8InputSchema = z.object({
  totalRev: z.number().min(0),
  partsRev: z.number().min(0),
  partsCogs: z.number().min(0),
  shrinkage: z.number().min(0),
  discounts: z.number().min(0),
  billedHrs: z.number().min(0),
  paidHrs: z.number().min(0),
  opex: z.number().min(0),
  targetMargin: z.number().min(0),
});

export type ServisMarjKacagiMarginLeakageCalculator8Input = z.infer<typeof ServisMarjKacagiMarginLeakageCalculator8InputSchema>;
