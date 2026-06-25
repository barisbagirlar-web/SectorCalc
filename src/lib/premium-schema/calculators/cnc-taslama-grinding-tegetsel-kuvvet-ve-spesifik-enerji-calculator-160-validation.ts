import { z } from "zod";

export const CncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160InputSchema = z.object({
  wheelSpeedMS: z.number().min(0),
  workSpeedMMin: z.number().min(0),
  depthOfCutMm: z.number().min(0),
  widthOfGrindingMm: z.number().min(0),
  specificEnergyJMm3: z.number().min(0),
  spindleKw: z.number().min(0),
});

export type CncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160Input = z.infer<typeof CncTaslamaGrindingTegetselKuvvetVeSpesifikEnerjiCalculator160InputSchema>;
