import { z } from "zod";

export const SuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165InputSchema = z.object({
  pipeLengthM: z.number().min(0),
  pipeDiaM: z.number().min(0),
  flowVelocityMS: z.number().min(0),
  waveCelerityMS: z.number().min(0),
  staticPressureM: z.number().min(0),
  maxAllowableHeadM: z.number().min(0),
});

export type SuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165Input = z.infer<typeof SuKocuSonumlemeTankiSurgeTankHacimBoyutlandirmaCalculator165InputSchema>;
