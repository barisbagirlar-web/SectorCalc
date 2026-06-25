import { z } from "zod";

export const SuKocuDarbesiWaterHammerJoukowskySokBasinciCalculator142InputSchema = z.object({
  fluidDensity: z.number().min(0),
  bulkModulusK: z.number().min(0),
  pipeE: z.number().min(0),
  pipeDiaD: z.number().min(0),
  pipeThicknessT: z.number().min(0),
  fluidVelocityV: z.number().min(0),
  pipeLengthL: z.number().min(0),
  valveCloseTimeTc: z.number().min(0),
  staticPressure: z.number().min(0),
});

export type SuKocuDarbesiWaterHammerJoukowskySokBasinciCalculator142Input = z.infer<typeof SuKocuDarbesiWaterHammerJoukowskySokBasinciCalculator142InputSchema>;
