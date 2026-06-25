import { z } from "zod";

export const CmmProbStylusBukulmeVeOlcumBelirsizligiIso10360Calculator114InputSchema = z.object({
  stylusLength: z.number().min(0),
  stylusDia: z.number().min(0),
  materialE: z.number().min(0),
  triggerForce: z.number().min(0),
  tempVariation: z.number().min(0),
  expansionCoeff: z.number().min(0),
  partTolerance: z.number().min(0),
});

export type CmmProbStylusBukulmeVeOlcumBelirsizligiIso10360Calculator114Input = z.infer<typeof CmmProbStylusBukulmeVeOlcumBelirsizligiIso10360Calculator114InputSchema>;
