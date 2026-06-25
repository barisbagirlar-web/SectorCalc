import { z } from "zod";

export const HsmTalasInceltmeChipThinningVeIlerlemeKompanzasyonuCalculator139InputSchema = z.object({
  toolDia: z.number().min(0),
  radialDoc: z.number().min(0),
  baseFz: z.number().min(0),
  flutes: z.number().min(0),
  spindleRpm: z.number().min(0),
});

export type HsmTalasInceltmeChipThinningVeIlerlemeKompanzasyonuCalculator139Input = z.infer<typeof HsmTalasInceltmeChipThinningVeIlerlemeKompanzasyonuCalculator139InputSchema>;
