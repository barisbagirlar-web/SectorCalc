import { z } from "zod";

export const CncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149InputSchema = z.object({
  spindleRpm: z.number().min(0),
  bearingPitchDia: z.number().min(0),
  shaftLength: z.number().min(0),
  tempDelta: z.number().min(0),
  thermalExpCoeff: z.number().min(0),
  initialPreload: z.number().min(0),
  stiffnessAxial: z.number().min(0),
});

export type CncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149Input = z.infer<typeof CncIsMiliSpindleTermalUzamaVeRulmanOnYukKaybiCalculator149InputSchema>;
