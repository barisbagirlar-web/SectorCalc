import { z } from "zod";

export const DinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175InputSchema = z.object({
  totalDemandTon: z.number().min(0),
  vehicleCapacityTon: z.number().min(0),
  totalDistanceKm: z.number().min(0),
  fleetSizeAvailable: z.number().min(0),
  fixedCostPerVehicle: z.number().min(0),
  variableCostKm: z.number().min(0),
  timeWindowPenalty: z.number().min(0),
  totalDelayMinutes: z.number().min(0),
});

export type DinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175Input = z.infer<typeof DinamikZamanPencereliVehicleAtamaVrptwKapasiteAnalysisCalculator175InputSchema>;
