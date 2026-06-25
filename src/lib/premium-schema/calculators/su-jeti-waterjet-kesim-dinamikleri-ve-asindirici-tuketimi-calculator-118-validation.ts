import { z } from "zod";

export const SuJetiWaterjetKesimDinamikleriVeAsindiriciTuketimiCalculator118InputSchema = z.object({
  pressureBar: z.number().min(0),
  orificeDia: z.number().min(0),
  cdFactor: z.number().min(0),
  abrasiveRate: z.number().min(0),
  materialMachinability: z.number().min(0),
  thickness: z.number().min(0),
  abrasivePrice: z.number().min(0),
});

export type SuJetiWaterjetKesimDinamikleriVeAsindiriciTuketimiCalculator118Input = z.infer<typeof SuJetiWaterjetKesimDinamikleriVeAsindiriciTuketimiCalculator118InputSchema>;
