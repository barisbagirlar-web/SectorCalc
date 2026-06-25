import { z } from "zod";

export const BulutIsrafCloudWasteFinopsDedektoruCalculator19InputSchema = z.object({
  vcMMin: z.number().min(0),
  fzMmTooth: z.number().min(0),
  toolDiaMm: z.number().min(0),
  flutesZ: z.number().min(0),
  cutLengthMm: z.number().min(0),
  rapidDistMm: z.number().min(0),
  rapidVelMmMin: z.number().min(0),
  toolChanges: z.number().min(0),
  tcTimeSec: z.number().min(0),
  loadUnloadMin: z.number().min(0),
});

export type BulutIsrafCloudWasteFinopsDedektoruCalculator19Input = z.infer<typeof BulutIsrafCloudWasteFinopsDedektoruCalculator19InputSchema>;
