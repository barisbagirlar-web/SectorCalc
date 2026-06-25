import { z } from "zod";

export const DeneyTasarimiDoeTamFaktoriyelVeAnovaAnalysisCalculator79InputSchema = z.object({
  factorCount: z.number().min(0),
  replicates: z.number().min(0),
  centerPoints: z.number().min(0),
  costPerRun: z.number().min(0),
  responseValues: z.number().min(0),
  alphaLevel: z.number().min(0),
});

export type DeneyTasarimiDoeTamFaktoriyelVeAnovaAnalysisCalculator79Input = z.infer<typeof DeneyTasarimiDoeTamFaktoriyelVeAnovaAnalysisCalculator79InputSchema>;
