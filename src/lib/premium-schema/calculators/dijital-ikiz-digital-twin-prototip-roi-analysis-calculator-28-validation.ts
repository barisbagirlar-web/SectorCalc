import { z } from "zod";

export const DijitalIkizDigitalTwinPrototipRoiAnalysisCalculator28InputSchema = z.object({
  physProtoCost: z.number().min(0),
  physIterations: z.number().min(0),
  fieldTestCost: z.number().min(0),
  dtSoftwareLic: z.number().min(0),
  dtCloudHrs: z.number().min(0),
  cloudRate: z.number().min(0),
  sensorCapex: z.number().min(0),
  engModelingHrs: z.number().min(0),
  engRate: z.number().min(0),
  timeToMarketGain: z.number().min(0),
  dailyMarketRev: z.number().min(0),
});

export type DijitalIkizDigitalTwinPrototipRoiAnalysisCalculator28Input = z.infer<typeof DijitalIkizDigitalTwinPrototipRoiAnalysisCalculator28InputSchema>;
