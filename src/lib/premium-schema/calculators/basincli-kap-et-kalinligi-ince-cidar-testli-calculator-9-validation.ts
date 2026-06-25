import { z } from "zod";

export const BasincliKapEtKalinligiInceCidarTestliCalculator9InputSchema = z.object({
  p: z.number().min(0),
  ri: z.number().min(0),
  head: z.number().min(0),
  e: z.number().min(0),
  ca: z.number().min(0),
});

export type BasincliKapEtKalinligiInceCidarTestliCalculator9Input = z.infer<typeof BasincliKapEtKalinligiInceCidarTestliCalculator9InputSchema>;
