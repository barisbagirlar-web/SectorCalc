import { z } from "zod";

export const Iec60890ElektrikPanoIklimlendirmeKapasitesiCalculator50InputSchema = z.object({
  width: z.number().min(0),
  height: z.number().min(0),
  depth: z.number().min(0),
  internalPower: z.number().min(0),
  tOut: z.number().min(0),
  tIn: z.number().min(0),
  mountingType: z.number().min(0),
});

export type Iec60890ElektrikPanoIklimlendirmeKapasitesiCalculator50Input = z.infer<typeof Iec60890ElektrikPanoIklimlendirmeKapasitesiCalculator50InputSchema>;
