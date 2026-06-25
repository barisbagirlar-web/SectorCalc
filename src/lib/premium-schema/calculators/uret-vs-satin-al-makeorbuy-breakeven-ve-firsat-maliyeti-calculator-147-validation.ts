import { z } from "zod";

export const UretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147InputSchema = z.object({
  supplierPrice: z.number().min(0),
  supplierOrderCost: z.number().min(0),
  inhouseFixedCapex: z.number().min(0),
  inhouseVarCost: z.number().min(0),
  annualVolume: z.number().min(0),
  lostMarginOpportunity: z.number().min(0),
});

export type UretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147Input = z.infer<typeof UretVsSatinAlMakeorbuyBreakevenVeFirsatMaliyetiCalculator147InputSchema>;
