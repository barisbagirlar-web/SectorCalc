import { z } from "zod";

export const SandvikUyumluMaksimumTalasKalinligiHexVeKienzleKuvvetDengesiCalculator189InputSchema = z.object({
  toolDiameterDc: z.number().min(0),
  radialCutAe: z.number().min(0),
  feedPerToothFz: z.number().min(0),
  kc11BaseForce: z.number().min(0),
  mcChipExponent: z.number().min(0),
  axialCutAp: z.number().min(0),
  spindleRpm: z.number().min(0),
  flutesZ: z.number().min(0),
});

export type SandvikUyumluMaksimumTalasKalinligiHexVeKienzleKuvvetDengesiCalculator189Input = z.infer<typeof SandvikUyumluMaksimumTalasKalinligiHexVeKienzleKuvvetDengesiCalculator189InputSchema>;
