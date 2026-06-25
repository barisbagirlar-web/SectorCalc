import { z } from "zod";

export const SuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95InputSchema = z.object({
  blueW: z.number().min(0),
  greenW: z.number().min(0),
  greyW: z.number().min(0),
  prodVol: z.number().min(0),
  benchmark: z.number().min(0),
});

export type SuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95Input = z.infer<typeof SuAyakIziBluegreengreyDesarjVeStresAnalysisCalculator95InputSchema>;
