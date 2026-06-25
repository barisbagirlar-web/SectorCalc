import { z } from "zod";

export const TeklifTutarlilikVeGizliSizintiAnalysisCalculator7InputSchema = z.object({
  totalQuotes: z.number().min(0),
  wonQuotes: z.number().min(0),
  quotedPart: z.number().min(0),
  marketPart: z.number().min(0),
  quotedLabor: z.number().min(0),
  flatRate: z.number().min(0),
  annualVol: z.number().min(0),
});

export type TeklifTutarlilikVeGizliSizintiAnalysisCalculator7Input = z.infer<typeof TeklifTutarlilikVeGizliSizintiAnalysisCalculator7InputSchema>;
