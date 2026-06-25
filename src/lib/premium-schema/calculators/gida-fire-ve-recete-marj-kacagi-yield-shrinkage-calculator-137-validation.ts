import { z } from "zod";

export const GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137InputSchema = z.object({
  rawInputKg: z.number().min(0),
  finishedOutputKg: z.number().min(0),
  spoiledWasteKg: z.number().min(0),
  rawCostPerKg: z.number().min(0),
  processingCostKg: z.number().min(0),
  theoreticalRecipeYield: z.number().min(0),
  salvageValueKg: z.number().min(0),
});

export type GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137Input = z.infer<typeof GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137InputSchema>;
