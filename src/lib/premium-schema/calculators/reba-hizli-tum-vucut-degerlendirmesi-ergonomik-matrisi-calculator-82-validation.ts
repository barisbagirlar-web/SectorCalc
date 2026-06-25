import { z } from "zod";

export const RebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82InputSchema = z.object({
  trunkScore: z.number().min(0),
  neckScore: z.number().min(0),
  legsScore: z.number().min(0),
  upperArmScore: z.number().min(0),
  lowerArmScore: z.number().min(0),
  wristScore: z.number().min(0),
  loadForceScore: z.number().min(0),
  couplingScore: z.number().min(0),
  activityScore: z.number().min(0),
});

export type RebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82Input = z.infer<typeof RebaHizliTumVucutDegerlendirmesiErgonomikMatrisiCalculator82InputSchema>;
