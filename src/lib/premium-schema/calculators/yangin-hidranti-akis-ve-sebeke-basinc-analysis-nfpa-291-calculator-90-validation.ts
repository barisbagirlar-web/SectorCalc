import { z } from "zod";

export const YanginHidrantiAkisVeSebekeBasincAnalysisNfpa291Calculator90InputSchema = z.object({
  hydrantDia: z.number().min(0),
  pitotP: z.number().min(0),
  staticP: z.number().min(0),
  residualP: z.number().min(0),
  cd: z.number().min(0),
  requiredFlow: z.number().min(0),
});

export type YanginHidrantiAkisVeSebekeBasincAnalysisNfpa291Calculator90Input = z.infer<typeof YanginHidrantiAkisVeSebekeBasincAnalysisNfpa291Calculator90InputSchema>;
