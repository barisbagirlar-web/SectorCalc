import { z } from "zod";

export const KaynakSogumaDurationT85VeMartenzitKirilganlikSiniriCalculator140InputSchema = z.object({
  heatInput: z.number().min(0),
  thickness: z.number().min(0),
  preheatTemp: z.number().min(0),
  jointFactor: z.number().min(0),
  criticalT85Min: z.number().min(0),
});

export type KaynakSogumaDurationT85VeMartenzitKirilganlikSiniriCalculator140Input = z.infer<typeof KaynakSogumaDurationT85VeMartenzitKirilganlikSiniriCalculator140InputSchema>;
