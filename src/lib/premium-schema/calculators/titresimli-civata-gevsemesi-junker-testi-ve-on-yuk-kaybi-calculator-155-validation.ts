import { z } from "zod";

export const TitresimliCivataGevsemesiJunkerTestiVeOnYukKaybiCalculator155InputSchema = z.object({
  boltDia: z.number().min(0),
  initialPreload: z.number().min(0),
  transverseDisplacement: z.number().min(0),
  vibrationCycles: z.number().min(0),
  frictionThread: z.number().min(0),
  frictionHead: z.number().min(0),
  antiLooseningFactor: z.number().min(0),
});

export type TitresimliCivataGevsemesiJunkerTestiVeOnYukKaybiCalculator155Input = z.infer<typeof TitresimliCivataGevsemesiJunkerTestiVeOnYukKaybiCalculator155InputSchema>;
