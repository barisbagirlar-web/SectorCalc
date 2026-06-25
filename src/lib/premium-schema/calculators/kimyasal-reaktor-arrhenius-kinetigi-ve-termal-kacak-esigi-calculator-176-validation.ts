import { z } from "zod";

export const KimyasalReaktorArrheniusKinetigiVeTermalKacakEsigiCalculator176InputSchema = z.object({
  preExponentialA: z.number().min(0),
  activationEnergyEa: z.number().min(0),
  reactorTempC: z.number().min(0),
  reactionEnthalpyDh: z.number().min(0),
  reactantConcentration: z.number().min(0),
  jacketCoolingCapacityKw: z.number().min(0),
});

export type KimyasalReaktorArrheniusKinetigiVeTermalKacakEsigiCalculator176Input = z.infer<typeof KimyasalReaktorArrheniusKinetigiVeTermalKacakEsigiCalculator176InputSchema>;
