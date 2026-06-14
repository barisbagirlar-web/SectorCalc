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
  results.tonerCostPerPage = (() => { try { return input.tonerPrice / input.tonerYield; } catch { return 0; } })();
  results.colorTonerCostPerPage = (() => { try { return input.colorTonerPrice / input.colorTonerYield; } catch { return 0; } })();
  results.weightedTonerCostPerPage = (() => { try { return results.tonerCostPerPage * (1 - input.colorPrintRatio/100) + results.colorTonerCostPerPage * (input.colorPrintRatio/100); } catch { return 0; } })();
  results.electricityCostPerPage = (() => { try { return (input.printerPowerConsumption / 1000) * (1 / (input.printSpeed * 60)) * input.electricityCostPerKwh; } catch { return 0; } })();
  results.maintenanceCostPerPage = (() => { try { return input.maintenanceCostPerYear / input.totalPagesPerYear; } catch { return 0; } })();
  results.depreciationCostPerPage = (() => { try { return (input.printerPurchasePrice / input.printerLifespan) / input.totalPagesPerYear; } catch { return 0; } })();
  results.totalCostPerPage = (() => { try { return results.weightedTonerCostPerPage + input.paperCostPerPage + results.electricityCostPerPage + results.maintenanceCostPerPage + results.depreciationCostPerPage; } catch { return 0; } })();
  results.annualTotalCost = (() => { try { return results.totalCostPerPage * input.totalPagesPerYear; } catch { return 0; } })();
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
