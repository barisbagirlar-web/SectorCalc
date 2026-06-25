import { z } from "zod";

export const IleriSeviyeParetoVeKokNedenFinansmaniCalculator84InputSchema = z.object({
  defectCodes: z.number().min(0),
  defectFrequencies: z.number().min(0),
  costPerDefect: z.number().min(0),
  analysisMonths: z.number().min(0),
});

export type IleriSeviyeParetoVeKokNedenFinansmaniCalculator84Input = z.infer<typeof IleriSeviyeParetoVeKokNedenFinansmaniCalculator84InputSchema>;
