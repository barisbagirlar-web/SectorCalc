// Auto-generated from fotokopi-yazici-toner-sayfa-maliyeti-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FotokopiYaziciTonerSayfaMaliyetiInput {
  tonerPrice: number;
  tonerYield: number;
  paperCostPerPage: number;
  electricityCostPerKwh: number;
  printerPowerConsumption: number;
  printSpeed: number;
  maintenanceCostPerYear: number;
  totalPagesPerYear: number;
  printerLifespan: number;
  printerPurchasePrice: number;
  colorPrintRatio: number;
  colorTonerPrice: number;
  colorTonerYield: number;
}

export const FotokopiYaziciTonerSayfaMaliyetiInputSchema = z.object({
  tonerPrice: z.number().min(0).default(500),
  tonerYield: z.number().min(1).default(2000),
  paperCostPerPage: z.number().min(0).default(0.05),
  electricityCostPerKwh: z.number().min(0).default(1.5),
  printerPowerConsumption: z.number().min(0).default(500),
  printSpeed: z.number().min(1).default(20),
  maintenanceCostPerYear: z.number().min(0).default(200),
  totalPagesPerYear: z.number().min(1).default(10000),
  printerLifespan: z.number().min(1).default(5),
  printerPurchasePrice: z.number().min(0).default(3000),
  colorPrintRatio: z.number().min(0).max(100).default(20),
  colorTonerPrice: z.number().min(0).default(800),
  colorTonerYield: z.number().min(1).default(1500),
});

export interface FotokopiYaziciTonerSayfaMaliyetiOutput {
  totalCostPerPage: number;
  breakdown: {
    tonerCostPerPage: number;
    paperCostPerPage: number;
    electricityCostPerPage: number;
    maintenanceCostPerPage: number;
    depreciationCostPerPage: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FotokopiYaziciTonerSayfaMaliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.tonerCostPerPage = ((): number => { try { const __v = input.tonerPrice / input.tonerYield; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.colorTonerCostPerPage = ((): number => { try { const __v = input.colorTonerPrice / input.colorTonerYield; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weightedTonerCostPerPage = ((): number => { try { const __v = results.tonerCostPerPage * (1 - input.colorPrintRatio/100) + results.colorTonerCostPerPage * (input.colorPrintRatio/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.electricityCostPerPage = ((): number => { try { const __v = (input.printerPowerConsumption / 1000) * (1 / (input.printSpeed * 60)) * input.electricityCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceCostPerPage = ((): number => { try { const __v = input.maintenanceCostPerYear / input.totalPagesPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.depreciationCostPerPage = ((): number => { try { const __v = (input.printerPurchasePrice / input.printerLifespan) / input.totalPagesPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPage = ((): number => { try { const __v = results.weightedTonerCostPerPage + input.paperCostPerPage + results.electricityCostPerPage + results.maintenanceCostPerPage + results.depreciationCostPerPage; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualTotalCost = ((): number => { try { const __v = results.totalCostPerPage * input.totalPagesPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFotokopiYaziciTonerSayfaMaliyeti(input: FotokopiYaziciTonerSayfaMaliyetiInput): FotokopiYaziciTonerSayfaMaliyetiOutput {
  const results = evaluateFormulas(input);
  const totalCostPerPage = results.totalCostPerPage ?? 0;
  const breakdown = {
    tonerCostPerPage: results.tonerCostPerPage,
    paperCostPerPage: results.paperCostPerPage,
    electricityCostPerPage: results.electricityCostPerPage,
    maintenanceCostPerPage: results.maintenanceCostPerPage,
    depreciationCostPerPage: results.depreciationCostPerPage,
  };

  // rule: tonerPrice >= 0
  // rule: tonerYield > 0
  // rule: paperCostPerPage >= 0
  // rule: electricityCostPerKwh >= 0
  // rule: printerPowerConsumption >= 0
  // rule: printSpeed > 0
  // rule: maintenanceCostPerYear >= 0
  // rule: totalPagesPerYear > 0
  // rule: printerLifespan > 0
  // rule: printerPurchasePrice >= 0
  // rule: colorPrintRatio >= 0 and colorPrintRatio <= 100
  // rule: colorTonerPrice >= 0
  // rule: colorTonerYield > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 0.10 TL/sayfa -> 'Toner maliyeti yuksek, alternatif toner degerlendirilmeli.'
  // threshold skipped (non-JS): > 0.50 TL/sayfa -> 'Toplam sayfa maliyeti yuksek, verimlilik artirilmali.'

  const dataConfidenceAdjusted = (() => { try { return results.totalCostPerPage * (1 + (1 - dataConfidence/100)); } catch { return totalCostPerPage; } })();

  return {
    totalCostPerPage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV Export","Trend Analizi","Karsilastirma (Farkli Yazici/Toner)","Detayli Rapor"],
  };
}
