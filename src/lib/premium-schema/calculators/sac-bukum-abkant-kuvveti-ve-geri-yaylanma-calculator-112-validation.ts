import { z } from "zod";

export const SacBukumAbkantKuvvetiVeGeriYaylanmaCalculator112InputSchema = z.object({
  thickness: z.number().min(0),
  bendLength: z.number().min(0),
  uts: z.number().min(0),
  vOpening: z.number().min(0),
  kFactor: z.number().min(0),
  pressCapacity: z.number().min(0),
});

export type SacBukumAbkantKuvvetiVeGeriYaylanmaCalculator112Input = z.infer<typeof SacBukumAbkantKuvvetiVeGeriYaylanmaCalculator112InputSchema>;
