import { z } from "zod";

export const KaynakIsiGirdisiHeatInputVeSogumaHiziKontroluCalculator110InputSchema = z.object({
  arcVoltage: z.number().min(0),
  arcCurrent: z.number().min(0),
  travelSpeed: z.number().min(0),
  thermalEfficiency: z.number().min(0),
  plateThickness: z.number().min(0),
  maxHeatInput: z.number().min(0),
});

export type KaynakIsiGirdisiHeatInputVeSogumaHiziKontroluCalculator110Input = z.infer<typeof KaynakIsiGirdisiHeatInputVeSogumaHiziKontroluCalculator110InputSchema>;
