import { z } from "zod";

export const OtomotivTamirGeriDonusComebackDerinAnalysisCalculator6InputSchema = z.object({
  totalRo: z.number().min(0),
  comebackRo: z.number().min(0),
  avgDiagTime: z.number().min(0),
  avgRepairTime: z.number().min(0),
  laborRate: z.number().min(0),
  bayOppCost: z.number().min(0),
  wastedParts: z.number().min(0),
  warrantyClaim: z.number().min(0),
  churnProb: z.number().min(0),
  customerLtv: z.number().min(0),
});

export type OtomotivTamirGeriDonusComebackDerinAnalysisCalculator6Input = z.infer<typeof OtomotivTamirGeriDonusComebackDerinAnalysisCalculator6InputSchema>;
