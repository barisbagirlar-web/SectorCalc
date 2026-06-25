import { z } from "zod";

export const BoruHatlarindaSuKocuAkustikSonumlemeVeKelepceStatikYukuCalculator182InputSchema = z.object({
  joukowskyPressureBar: z.number().min(0),
  pipeOuterDia: z.number().min(0),
  pipeWallThickness: z.number().min(0),
  clampSpacingM: z.number().min(0),
  pipeYieldStrength: z.number().min(0),
});

export type BoruHatlarindaSuKocuAkustikSonumlemeVeKelepceStatikYukuCalculator182Input = z.infer<typeof BoruHatlarindaSuKocuAkustikSonumlemeVeKelepceStatikYukuCalculator182InputSchema>;
