import { z } from "zod";

export const KarbonAyakIziLojistikScope3EmisyonVeCbamVergiEtkisiCalculator156InputSchema = z.object({
  shipmentWeight: z.number().min(0),
  distRoad: z.number().min(0),
  distSea: z.number().min(0),
  distAir: z.number().min(0),
  efRoad: z.number().min(0),
  efSea: z.number().min(0),
  efAir: z.number().min(0),
  euEtsCarbonPrice: z.number().min(0),
  productValue: z.number().min(0),
});

export type KarbonAyakIziLojistikScope3EmisyonVeCbamVergiEtkisiCalculator156Input = z.infer<typeof KarbonAyakIziLojistikScope3EmisyonVeCbamVergiEtkisiCalculator156InputSchema>;
