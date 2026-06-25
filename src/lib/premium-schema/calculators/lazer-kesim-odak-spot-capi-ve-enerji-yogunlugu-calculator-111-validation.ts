import { z } from "zod";

export const LazerKesimOdakSpotCapiVeEnerjiYogunluguCalculator111InputSchema = z.object({
  laserPower: z.number().min(0),
  wavelength: z.number().min(0),
  beamQualityM2: z.number().min(0),
  focalLength: z.number().min(0),
  inputBeamDia: z.number().min(0),
  feedRate: z.number().min(0),
});

export type LazerKesimOdakSpotCapiVeEnerjiYogunluguCalculator111Input = z.infer<typeof LazerKesimOdakSpotCapiVeEnerjiYogunluguCalculator111InputSchema>;
