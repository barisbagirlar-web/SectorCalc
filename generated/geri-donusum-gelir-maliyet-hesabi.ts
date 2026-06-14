// Auto-generated from geri-donusum-gelir-maliyet-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface GeriDonusumGelirMaliyetHesabiInput {
  materialType: 'plastik' | 'kagit' | 'cam' | 'metal' | 'elektronik';
  monthlyInputQuantity: number;
  recoveryRate: number;
  sellingPricePerTon: number;
  processingCostPerTon: number;
  transportCostPerTon: number;
  laborCostPerMonth: number;
  energyCostPerTon: number;
  maintenanceCostPerMonth: number;
  overheadCostPerMonth: number;
  dataConfidence: number;
}

export const GeriDonusumGelirMaliyetHesabiInputSchema = z.object({
  materialType: z.enum(['plastik', 'kagit', 'cam', 'metal', 'elektronik']).default('plastik'),
  monthlyInputQuantity: z.number().min(0).max(100000).default(100),
  recoveryRate: z.number().min(0).max(100).default(85),
  sellingPricePerTon: z.number().min(0).max(10000).default(200),
  processingCostPerTon: z.number().min(0).max(5000).default(150),
  transportCostPerTon: z.number().min(0).max(500).default(30),
  laborCostPerMonth: z.number().min(0).max(1000000).default(10000),
  energyCostPerTon: z.number().min(0).max(500).default(20),
  maintenanceCostPerMonth: z.number().min(0).max(500000).default(5000),
  overheadCostPerMonth: z.number().min(0).max(500000).default(8000),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface GeriDonusumGelirMaliyetHesabiOutput {
  netProfit: number;
  breakdown: {
    revenue: number;
    totalVariableCost: number;
    totalFixedCost: number;
    totalCost: number;
    profitMargin: number;
    breakEvenQuantity: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: GeriDonusumGelirMaliyetHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.recoveredQuantity = ((): number => { try { const __v = input.monthlyInputQuantity * (input.recoveryRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.revenue = ((): number => { try { const __v = results.recoveredQuantity * input.sellingPricePerTon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalProcessingCost = ((): number => { try { const __v = input.monthlyInputQuantity * input.processingCostPerTon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalTransportCost = ((): number => { try { const __v = input.monthlyInputQuantity * input.transportCostPerTon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalEnergyCost = ((): number => { try { const __v = input.monthlyInputQuantity * input.energyCostPerTon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalVariableCost = ((): number => { try { const __v = results.totalProcessingCost + results.totalTransportCost + results.totalEnergyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFixedCost = ((): number => { try { const __v = input.laborCostPerMonth + input.maintenanceCostPerMonth + input.overheadCostPerMonth; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalVariableCost + results.totalFixedCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfit = ((): number => { try { const __v = results.revenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = (results.netProfit / results.revenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.breakEvenQuantity = ((): number => { try { const __v = results.totalFixedCost / (input.sellingPricePerTon - (input.processingCostPerTon + input.transportCostPerTon + input.energyCostPerTon)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedProfit = ((): number => { try { const __v = results.netProfit * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateGeriDonusumGelirMaliyetHesabi(input: GeriDonusumGelirMaliyetHesabiInput): GeriDonusumGelirMaliyetHesabiOutput {
  const results = evaluateFormulas(input);
  const netProfit = results.netProfit ?? 0;
  const breakdown = {
    revenue: results.revenue,
    totalVariableCost: results.totalVariableCost,
    totalFixedCost: results.totalFixedCost,
    totalCost: results.totalCost,
    profitMargin: results.profitMargin,
    breakEvenQuantity: results.breakEvenQuantity,
  };

  // rule: monthlyInputQuantity > 0
  // rule: recoveryRate >= 0 && recoveryRate <= 100
  // rule: sellingPricePerTon >= 0
  // rule: processingCostPerTon >= 0
  // rule: transportCostPerTon >= 0
  // rule: laborCostPerMonth >= 0
  // rule: energyCostPerTon >= 0
  // rule: maintenanceCostPerMonth >= 0
  // rule: overheadCostPerMonth >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk geri kazanim orani: surec iyilestirme gerekli
  // threshold skipped (non-JS): Negatif marj: satis fiyati isleme maliyetini karsilamiyor
  // threshold skipped (non-JS): Dusuk girdi hacmi: olcek ekonomisi saglanamiyor

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedProfit; } catch { return netProfit; } })();

  return {
    netProfit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri indirme","Trend analizi (zaman serisi)","Karsilastirma (farkli senaryolar)","Detayli maliyet kirilimi raporu"],
  };
}
