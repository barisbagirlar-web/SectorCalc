import { z } from "zod";

export const DumanTahliyeKapagiShevBoyutlandirmaEn121015Calculator47InputSchema = z.object({
  roofArea: z.number().min(0),
  ceilingHeight: z.number().min(0),
  smokeDepth: z.number().min(0),
  fireArea: z.number().min(0),
  inletArea: z.number().min(0),
  cvFactor: z.number().min(0),
  tAmbient: z.number().min(0),
});

export type DumanTahliyeKapagiShevBoyutlandirmaEn121015Calculator47Input = z.infer<typeof DumanTahliyeKapagiShevBoyutlandirmaEn121015Calculator47InputSchema>;
