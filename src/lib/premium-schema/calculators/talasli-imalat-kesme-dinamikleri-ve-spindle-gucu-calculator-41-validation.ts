import { z } from "zod";

export const TalasliImalatKesmeDinamikleriVeSpindleGucuCalculator41InputSchema = z.object({
  toolDia: z.number().min(0),
  flutes: z.number().min(0),
  vc: z.number().min(0),
  fz: z.number().min(0),
  ap: z.number().min(0),
  ae: z.number().min(0),
  kc1: z.number().min(0),
  mc: z.number().min(0),
  spindleEff: z.number().min(0),
  maxSpindleKw: z.number().min(0),
});

export type TalasliImalatKesmeDinamikleriVeSpindleGucuCalculator41Input = z.infer<typeof TalasliImalatKesmeDinamikleriVeSpindleGucuCalculator41InputSchema>;
