import { z } from "zod";

export const DinamikKanbanKartiVeWipTamponBoyutlandirmaCalculator53InputSchema = z.object({
  dailyDemand: z.number().min(0),
  waitTime: z.number().min(0),
  processTime: z.number().min(0),
  transportTime: z.number().min(0),
  containerCap: z.number().min(0),
  safetyFactor: z.number().min(0),
});

export type DinamikKanbanKartiVeWipTamponBoyutlandirmaCalculator53Input = z.infer<typeof DinamikKanbanKartiVeWipTamponBoyutlandirmaCalculator53InputSchema>;
