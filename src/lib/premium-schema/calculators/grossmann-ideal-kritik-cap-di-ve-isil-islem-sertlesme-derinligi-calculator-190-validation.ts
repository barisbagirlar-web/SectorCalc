import { z } from "zod";

export const GrossmannIdealKritikCapDiVeIsilIslemSertlesmeDerinligiCalculator190InputSchema = z.object({
  carbonPct: z.number().min(0),
  grainSizeAstm: z.number().min(0),
  manganesePct: z.number().min(0),
  chromiumPct: z.number().min(0),
  molybdenumPct: z.number().min(0),
  nickelPct: z.number().min(0),
  quenchIntensityH: z.number().min(0),
});

export type GrossmannIdealKritikCapDiVeIsilIslemSertlesmeDerinligiCalculator190Input = z.infer<typeof GrossmannIdealKritikCapDiVeIsilIslemSertlesmeDerinligiCalculator190InputSchema>;
