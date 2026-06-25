import { z } from "zod";

export const LittleYasasiWipThCtVeDarbogazAnalysisCalculator54InputSchema = z.object({
  knownVariable: z.number().min(0),
  throughput: z.number().min(0),
  cycleTime: z.number().min(0),
  bottleneckTh: z.number().min(0),
});

export type LittleYasasiWipThCtVeDarbogazAnalysisCalculator54Input = z.infer<typeof LittleYasasiWipThCtVeDarbogazAnalysisCalculator54InputSchema>;
