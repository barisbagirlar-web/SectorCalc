import { z } from "zod";

export const BuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92InputSchema = z.object({
  orificeD: z.number().min(0),
  lineP: z.number().min(0),
  backP: z.number().min(0),
  cd: z.number().min(0),
  steamEnthalpy: z.number().min(0),
  opHours: z.number().min(0),
  steamCost: z.number().min(0),
});

export type BuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92Input = z.infer<typeof BuharKapaniSteamTrapTermodinamikLossAnalysisCalculator92InputSchema>;
