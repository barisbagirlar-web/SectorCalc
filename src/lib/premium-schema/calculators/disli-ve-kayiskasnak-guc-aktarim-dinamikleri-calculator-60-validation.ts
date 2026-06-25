import { z } from "zod";

export const DisliVeKayiskasnakGucAktarimDinamikleriCalculator60InputSchema = z.object({
  powerKw: z.number().min(0),
  rpmDrive: z.number().min(0),
  moduleMm: z.number().min(0),
  teethDrive: z.number().min(0),
  faceWidth: z.number().min(0),
  lewisY: z.number().min(0),
  allowableStress: z.number().min(0),
  frictionMu: z.number().min(0),
  wrapAngleDeg: z.number().min(0),
});

export type DisliVeKayiskasnakGucAktarimDinamikleriCalculator60Input = z.infer<typeof DisliVeKayiskasnakGucAktarimDinamikleriCalculator60InputSchema>;
