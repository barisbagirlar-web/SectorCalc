import { z } from "zod";

export const HidrolikAkumulatorAzotOnDolumVeEnerjiKapasitesiCalculator170InputSchema = z.object({
  maxSysPressure: z.number().min(0),
  minSysPressure: z.number().min(0),
  gasPrechargeP0: z.number().min(0),
  requiredStoredVol: z.number().min(0),
  polytropicExponent: z.number().min(0),
});

export type HidrolikAkumulatorAzotOnDolumVeEnerjiKapasitesiCalculator170Input = z.infer<typeof HidrolikAkumulatorAzotOnDolumVeEnerjiKapasitesiCalculator170InputSchema>;
