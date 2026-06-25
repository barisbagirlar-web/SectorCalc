import { z } from "zod";

export const AqlSamplingHipergeometrikDuzeltmeliCalculator3InputSchema = z.object({
  lotSize: z.number().min(0),
  sampleSize: z.number().min(0),
  acceptNum: z.number().min(0),
  aqlPct: z.number().min(0),
  ltpdPct: z.number().min(0),
  destructTest: z.number().min(0),
  unitCost: z.number().min(0),
  escapeCost: z.number().min(0),
  inspectorErr: z.number().min(0),
});

export type AqlSamplingHipergeometrikDuzeltmeliCalculator3Input = z.infer<typeof AqlSamplingHipergeometrikDuzeltmeliCalculator3InputSchema>;
