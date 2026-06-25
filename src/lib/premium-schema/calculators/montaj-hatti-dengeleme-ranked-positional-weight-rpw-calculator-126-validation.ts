import { z } from "zod";

export const MontajHattiDengelemeRankedPositionalWeightRpwCalculator126InputSchema = z.object({
  taskTimes: z.number().min(0),
  precedenceMatrix: z.number().min(0),
  taktTime: z.number().min(0),
  actualStations: z.number().min(0),
});

export type MontajHattiDengelemeRankedPositionalWeightRpwCalculator126Input = z.infer<typeof MontajHattiDengelemeRankedPositionalWeightRpwCalculator126InputSchema>;
