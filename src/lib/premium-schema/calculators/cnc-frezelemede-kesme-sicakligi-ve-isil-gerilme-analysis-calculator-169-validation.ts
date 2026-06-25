import { z } from "zod";

export const CncFrezelemedeKesmeSicakligiVeIsilGerilmeAnalysisCalculator169InputSchema = z.object({
  cuttingSpeedVc: z.number().min(0),
  feedPerToothFz: z.number().min(0),
  depthOfCutAp: z.number().min(0),
  specificHeatCapacity: z.number().min(0),
  materialDensity: z.number().min(0),
  thermalConductivity: z.number().min(0),
  toolSofteningTemp: z.number().min(0),
  ambientTemp: z.number().min(0),
});

export type CncFrezelemedeKesmeSicakligiVeIsilGerilmeAnalysisCalculator169Input = z.infer<typeof CncFrezelemedeKesmeSicakligiVeIsilGerilmeAnalysisCalculator169InputSchema>;
