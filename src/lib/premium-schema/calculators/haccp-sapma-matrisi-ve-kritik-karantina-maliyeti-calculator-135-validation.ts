import { z } from "zod";

export const HaccpSapmaMatrisiVeKritikKarantinaMaliyetiCalculator135InputSchema = z.object({
  quarantineVolKg: z.number().min(0),
  holdingDays: z.number().min(0),
  storageCostPerKgDay: z.number().min(0),
  labTestQty: z.number().min(0),
  labTestCost: z.number().min(0),
  rawMaterialCost: z.number().min(0),
  reworkVolKg: z.number().min(0),
  reworkCostKg: z.number().min(0),
  disposalVolKg: z.number().min(0),
  disposalCostKg: z.number().min(0),
  regulatoryFine: z.number().min(0),
  severity110: z.number().min(0),
  occurrence110: z.number().min(0),
  detection110: z.number().min(0),
});

export type HaccpSapmaMatrisiVeKritikKarantinaMaliyetiCalculator135Input = z.infer<typeof HaccpSapmaMatrisiVeKritikKarantinaMaliyetiCalculator135InputSchema>;
