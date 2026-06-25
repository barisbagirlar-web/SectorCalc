import { z } from "zod";

export const DowntimeDurationDowntimeDerinCostAnalysisCalculator5InputSchema = z.object({
  mttrResp: z.number().min(0),
  mttrDiag: z.number().min(0),
  mttrRep: z.number().min(0),
  directWorkers: z.number().min(0),
  indirectWorkers: z.number().min(0),
  laborRate: z.number().min(0),
  lineCap: z.number().min(0),
  unitMargin: z.number().min(0),
  idlePower: z.number().min(0),
  elecRate: z.number().min(0),
  rampupTime: z.number().min(0),
  rampupScrap: z.number().min(0),
  unitCogs: z.number().min(0),
  waitingTrucks: z.number().min(0),
  demurrage: z.number().min(0),
  slaProb: z.number().min(0),
  slaPenalty: z.number().min(0),
});

export type DowntimeDurationDowntimeDerinCostAnalysisCalculator5Input = z.infer<typeof DowntimeDurationDowntimeDerinCostAnalysisCalculator5InputSchema>;
