// Auto-generated from irsaliye-fatura-adedi-basina-sevkiyat-maliyeti-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IrsaliyeFaturaAdediBasinaSevkiyatMaliyetiInput {
  totalShipmentCost: number;
  invoiceCount: number;
  waybillCount: number;
  dataConfidence: number;
}

export const IrsaliyeFaturaAdediBasinaSevkiyatMaliyetiInputSchema = z.object({
  totalShipmentCost: z.number().min(0).default(0),
  invoiceCount: z.number().min(1).default(1),
  waybillCount: z.number().min(1).default(1),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface IrsaliyeFaturaAdediBasinaSevkiyatMaliyetiOutput {
  costPerDocument: number;
  breakdown: {
    totalShipmentCost: number;
    totalDocuments: number;
    costPerDocument: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IrsaliyeFaturaAdediBasinaSevkiyatMaliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.costPerDocument = ((): number => { try { const __v = input.totalShipmentCost / (input.invoiceCount + input.waybillCount); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedCostPerDocument = ((): number => { try { const __v = results.costPerDocument * (100 / input.dataConfidence); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIrsaliyeFaturaAdediBasinaSevkiyatMaliyeti(input: IrsaliyeFaturaAdediBasinaSevkiyatMaliyetiInput): IrsaliyeFaturaAdediBasinaSevkiyatMaliyetiOutput {
  const results = evaluateFormulas(input);
  const costPerDocument = results.costPerDocument ?? 0;
  const breakdown = {
    totalShipmentCost: results.totalShipmentCost,
    totalDocuments: results.totalDocuments,
    costPerDocument: results.costPerDocument,
  };

  // rule: totalShipmentCost >= 0
  // rule: invoiceCount >= 1
  // rule: waybillCount >= 1
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (costPerDocument > 1000) hiddenLossDrivers.push("costPerDocument");

  const dataConfidenceAdjusted = (() => { try { return results.adjustedCostPerDocument; } catch { return costPerDocument; } })();

  return {
    costPerDocument,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
