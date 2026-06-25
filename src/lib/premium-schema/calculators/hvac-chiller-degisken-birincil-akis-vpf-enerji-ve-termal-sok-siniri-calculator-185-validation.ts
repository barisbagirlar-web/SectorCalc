import { z } from "zod";

export const HvacChillerDegiskenBirincilAkisVpfEnerjiVeTermalSokSiniriCalculator185InputSchema = z.object({
  minFlowGpm: z.number().min(0),
  maxFlowGpm: z.number().min(0),
  currentFlowGpm: z.number().min(0),
  flowChangeRatePct: z.number().min(0),
  evapVolumeLiters: z.number().min(0),
  pumpPowerKw: z.number().min(0),
});

export type HvacChillerDegiskenBirincilAkisVpfEnerjiVeTermalSokSiniriCalculator185Input = z.infer<typeof HvacChillerDegiskenBirincilAkisVpfEnerjiVeTermalSokSiniriCalculator185InputSchema>;
