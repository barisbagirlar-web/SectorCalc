import { z } from "zod";

export const HidrolikSilindirTonajHizVeMotorGucuCalculator39InputSchema = z.object({
  boreDia: z.number().min(0),
  rodDia: z.number().min(0),
  sysPressure: z.number().min(0),
  strokeLength: z.number().min(0),
  cylinderQty: z.number().min(0),
  pumpFlow: z.number().min(0),
  volEff: z.number().min(0),
  mechEff: z.number().min(0),
  frictionCoeff: z.number().min(0),
});

export type HidrolikSilindirTonajHizVeMotorGucuCalculator39Input = z.infer<typeof HidrolikSilindirTonajHizVeMotorGucuCalculator39InputSchema>;
