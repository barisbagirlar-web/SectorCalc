import { z } from "zod";

export const KaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65InputSchema = z.object({
  weldType: z.number().min(0),
  rootGap: z.number().min(0),
  grooveAngle: z.number().min(0),
  weldLength: z.number().min(0),
  reinforcement: z.number().min(0),
  density: z.number().min(0),
  depEfficiency: z.number().min(0),
});

export type KaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65Input = z.infer<typeof KaynakHacmiVeDolguMalzemesiIhtiyaciCalculator65InputSchema>;
