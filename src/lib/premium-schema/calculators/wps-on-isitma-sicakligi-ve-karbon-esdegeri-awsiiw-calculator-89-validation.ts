import { z } from "zod";

export const WpsOnIsitmaSicakligiVeKarbonEsdegeriAwsiiwCalculator89InputSchema = z.object({
  cPct: z.number().min(0),
  mnPct: z.number().min(0),
  crPct: z.number().min(0),
  moPct: z.number().min(0),
  vPct: z.number().min(0),
  niPct: z.number().min(0),
  cuPct: z.number().min(0),
  thickness: z.number().min(0),
  hydrogenLevel: z.number().min(0),
});

export type WpsOnIsitmaSicakligiVeKarbonEsdegeriAwsiiwCalculator89Input = z.infer<typeof WpsOnIsitmaSicakligiVeKarbonEsdegeriAwsiiwCalculator89InputSchema>;
