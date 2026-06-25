import { z } from "zod";

export const KurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187InputSchema = z.object({
  purchaseMultiple: z.number().min(0),
  ebitdaY0: z.number().min(0),
  leverageRatio: z.number().min(0),
  interestRateDebt: z.number().min(0),
  exitMultipleY5: z.number().min(0),
  ebitdaCagr: z.number().min(0),
});

export type KurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187Input = z.infer<typeof KurumsalFinansKaldiracliSatinAlimLboBorcOdemeVeIrrMatrisiCalculator187InputSchema>;
