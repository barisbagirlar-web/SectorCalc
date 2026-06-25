import { z } from "zod";

export const TocDarbogazKapasiteArtisiRoiAnalysisCalculator24InputSchema = z.object({
  taktTimeMin: z.number().min(0),
  bottleneckCtMin: z.number().min(0),
  targetCtMin: z.number().min(0),
  availableTimeMin: z.number().min(0),
  unitContribMargin: z.number().min(0),
  upgradeCapex: z.number().min(0),
  wacc: z.number().min(0),
  lifeYears: z.number().min(0),
});

export type TocDarbogazKapasiteArtisiRoiAnalysisCalculator24Input = z.infer<typeof TocDarbogazKapasiteArtisiRoiAnalysisCalculator24InputSchema>;
