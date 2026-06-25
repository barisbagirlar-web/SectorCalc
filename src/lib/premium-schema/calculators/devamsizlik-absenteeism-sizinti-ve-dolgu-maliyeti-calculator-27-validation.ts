import { z } from "zod";

export const DevamsizlikAbsenteeismSizintiVeDolguMaliyetiCalculator27InputSchema = z.object({
  absentHrs: z.number().min(0),
  regRate: z.number().min(0),
  burdenPct: z.number().min(0),
  otFillPct: z.number().min(0),
  otMultiplier: z.number().min(0),
  tempFillPct: z.number().min(0),
  tempRate: z.number().min(0),
  outputPerHr: z.number().min(0),
  contribMargin: z.number().min(0),
});

export type DevamsizlikAbsenteeismSizintiVeDolguMaliyetiCalculator27Input = z.infer<typeof DevamsizlikAbsenteeismSizintiVeDolguMaliyetiCalculator27InputSchema>;
