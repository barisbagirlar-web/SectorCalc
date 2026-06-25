import { z } from "zod";

export const TemaIsiEsanjoruBoruDemetiDogalFrekansAnalysisCalculator171InputSchema = z.object({
  tubeOuterDia: z.number().min(0),
  tubeWallThickness: z.number().min(0),
  supportSpanLength: z.number().min(0),
  materialModulusE: z.number().min(0),
  materialDensity: z.number().min(0),
  fluidInsideDensity: z.number().min(0),
  supportConditionFactor: z.number().min(0),
});

export type TemaIsiEsanjoruBoruDemetiDogalFrekansAnalysisCalculator171Input = z.infer<typeof TemaIsiEsanjoruBoruDemetiDogalFrekansAnalysisCalculator171InputSchema>;
