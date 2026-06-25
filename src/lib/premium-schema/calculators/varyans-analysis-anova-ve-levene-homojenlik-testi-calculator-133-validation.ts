import { z } from "zod";

export const VaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133InputSchema = z.object({
  numGroupsK: z.number().min(0),
  totalN: z.number().min(0),
  sumSqBetweenSsb: z.number().min(0),
  sumSqWithinSsw: z.number().min(0),
  levenePValue: z.number().min(0),
  alphaLevel: z.number().min(0),
});

export type VaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133Input = z.infer<typeof VaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133InputSchema>;
