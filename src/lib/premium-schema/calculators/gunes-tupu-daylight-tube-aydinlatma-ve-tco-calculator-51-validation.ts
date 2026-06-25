import { z } from "zod";

export const GunesTupuDaylightTubeAydinlatmaVeTcoCalculator51InputSchema = z.object({
  roomArea: z.number().min(0),
  targetLux: z.number().min(0),
  tubeOutputLm: z.number().min(0),
  tunnelLen: z.number().min(0),
  roofPitch: z.number().min(0),
  currentLightingKw: z.number().min(0),
  daylightHours: z.number().min(0),
  elecRate: z.number().min(0),
  installedCostPerTube: z.number().min(0),
});

export type GunesTupuDaylightTubeAydinlatmaVeTcoCalculator51Input = z.infer<typeof GunesTupuDaylightTubeAydinlatmaVeTcoCalculator51InputSchema>;
