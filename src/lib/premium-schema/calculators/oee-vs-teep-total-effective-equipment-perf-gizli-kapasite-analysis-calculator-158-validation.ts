import { z } from "zod";

export const OeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158InputSchema = z.object({
  totalCalendarTime: z.number().min(0),
  unscheduledTime: z.number().min(0),
  plannedMaintenance: z.number().min(0),
  unplannedDowntime: z.number().min(0),
  idealCycleTime: z.number().min(0),
  totalUnitsProduced: z.number().min(0),
  goodUnits: z.number().min(0),
  capexPerNewMachine: z.number().min(0),
});

export type OeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158Input = z.infer<typeof OeeVsTeepTotalEffectiveEquipmentPerfGizliKapasiteAnalysisCalculator158InputSchema>;
