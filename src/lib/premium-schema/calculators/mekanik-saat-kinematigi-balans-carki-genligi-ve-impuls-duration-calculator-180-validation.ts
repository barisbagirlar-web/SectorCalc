import { z } from "zod";

export const MekanikSaatKinematigiBalansCarkiGenligiVeImpulsDurationCalculator180InputSchema = z.object({
  amplitudeDeg: z.number().min(0),
  rateErrorSec: z.number().min(0),
  liftAngleDeg: z.number().min(0),
  frequencyVph: z.number().min(0),
  balanceInertia: z.number().min(0),
});

export type MekanikSaatKinematigiBalansCarkiGenligiVeImpulsDurationCalculator180Input = z.infer<typeof MekanikSaatKinematigiBalansCarkiGenligiVeImpulsDurationCalculator180InputSchema>;
