import { z } from "zod";

export const MilkRunVehicleRotalamaVrpLojistikOptimizasyonuCalculator55InputSchema = z.object({
  currentDist: z.number().min(0),
  optimizedDist: z.number().min(0),
  avgSpeed: z.number().min(0),
  fuelConsumption: z.number().min(0),
  fuelPrice: z.number().min(0),
  driverRate: z.number().min(0),
  stopsCount: z.number().min(0),
  stopTimeMin: z.number().min(0),
});

export type MilkRunVehicleRotalamaVrpLojistikOptimizasyonuCalculator55Input = z.infer<typeof MilkRunVehicleRotalamaVrpLojistikOptimizasyonuCalculator55InputSchema>;
