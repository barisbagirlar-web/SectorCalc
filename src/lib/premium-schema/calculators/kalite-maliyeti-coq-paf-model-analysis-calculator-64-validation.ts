import { z } from "zod";

export const KaliteMaliyetiCoqPafModelAnalysisCalculator64InputSchema = z.object({
  preventionCost: z.number().min(0),
  appraisalCost: z.number().min(0),
  internalFailure: z.number().min(0),
  externalFailure: z.number().min(0),
  totalSales: z.number().min(0),
});

export type KaliteMaliyetiCoqPafModelAnalysisCalculator64Input = z.infer<typeof KaliteMaliyetiCoqPafModelAnalysisCalculator64InputSchema>;
