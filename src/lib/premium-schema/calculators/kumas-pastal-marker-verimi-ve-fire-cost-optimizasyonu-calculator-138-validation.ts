import { z } from "zod";

export const KumasPastalMarkerVerimiVeFireCostOptimizasyonuCalculator138InputSchema = z.object({
  fabricUsableWidth: z.number().min(0),
  markerLength: z.number().min(0),
  patternNetArea: z.number().min(0),
  fabricLayers: z.number().min(0),
  fabricPriceMeter: z.number().min(0),
  endWasteMargin: z.number().min(0),
  annualCuts: z.number().min(0),
});

export type KumasPastalMarkerVerimiVeFireCostOptimizasyonuCalculator138Input = z.infer<typeof KumasPastalMarkerVerimiVeFireCostOptimizasyonuCalculator138InputSchema>;
