import { z } from "zod";

export const LojistikRotaSapmasiDriftVeYakitIsrafiCalculator76InputSchema = z.object({
  plannedDist: z.number().min(0),
  actualDist: z.number().min(0),
  avgSpeed: z.number().min(0),
  fuelConsumption: z.number().min(0),
  fuelPrice: z.number().min(0),
  idleTimeMins: z.number().min(0),
  idleFuelRate: z.number().min(0),
  driverWage: z.number().min(0),
  missedDrops: z.number().min(0),
  costPerMissedDrop: z.number().min(0),
});

export type LojistikRotaSapmasiDriftVeYakitIsrafiCalculator76Input = z.infer<typeof LojistikRotaSapmasiDriftVeYakitIsrafiCalculator76InputSchema>;
