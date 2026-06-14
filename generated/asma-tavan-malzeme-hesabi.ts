// Auto-generated from asma-tavan-malzeme-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AsmaTavanMalzemeHesabiInput {
  areaLength: number;
  areaWidth: number;
  panelType: 'standard' | 'acoustic' | 'moistureResistant';
  gridType: 'exposed' | 'concealed';
  panelWasteFactor: number;
  gridWasteFactor: number;
  unitPanelPrice: number;
  unitGridPrice: number;
  laborCostPerM2: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AsmaTavanMalzemeHesabiInputSchema = z.object({
  areaLength: z.number().min(0.1).max(100).default(10),
  areaWidth: z.number().min(0.1).max(100).default(8),
  panelType: z.enum(['standard', 'acoustic', 'moistureResistant']).default('standard'),
  gridType: z.enum(['exposed', 'concealed']).default('exposed'),
  panelWasteFactor: z.number().min(0).max(20).default(5),
  gridWasteFactor: z.number().min(0).max(15).default(3),
  unitPanelPrice: z.number().min(1).max(100).default(15),
  unitGridPrice: z.number().min(1).max(50).default(8),
  laborCostPerM2: z.number().min(0).max(50).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AsmaTavanMalzemeHesabiOutput {
  totalCost: number;
  breakdown: {
    panelCost: number;
    gridCost: number;
    laborCost: number;
    costPerM2: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AsmaTavanMalzemeHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalArea = input.areaLength * input.areaWidth;
  results.panelAreaNeeded = results.totalArea * (1 + input.panelWasteFactor / 100);
  results.gridAreaNeeded = results.totalArea * (1 + input.gridWasteFactor / 100);
  results.panelCost = results.panelAreaNeeded * input.unitPanelPrice;
  results.gridCost = results.gridAreaNeeded * input.unitGridPrice;
  results.laborCost = results.totalArea * input.laborCostPerM2;
  results.totalCost = results.panelCost + results.gridCost + results.laborCost;
  results.costPerM2 = results.totalCost / results.totalArea;
  results.dataConfidenceAdjusted = input.dataConfidence === 'low' ? results.totalCost * 1.15 : input.dataConfidence === 'medium' ? results.totalCost * 1.05 : results.totalCost;
  return results;
}

export function calculateAsmaTavanMalzemeHesabi(input: AsmaTavanMalzemeHesabiInput): AsmaTavanMalzemeHesabiOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost;
  const breakdown = {
    panelCost: results.panelCost,
    gridCost: results.gridCost,
    laborCost: results.laborCost,
    costPerM2: results.costPerM2,
  };

  // rule: areaLength > 0
  // rule: areaWidth > 0
  // rule: panelWasteFactor >= 0 && panelWasteFactor <= 20
  // rule: gridWasteFactor >= 0 && gridWasteFactor <= 15
  // rule: unitPanelPrice > 0
  // rule: unitGridPrice > 0
  // rule: laborCostPerM2 >= 0
  // rule: if panelType === 'acoustic' then unitPanelPrice >= 20
  // rule: if panelType === 'moistureResistant' then unitPanelPrice >= 25
  // threshold panelWasteFactor > 10: Yüksek panel fire oranı, maliyeti artırabilir.
  // threshold gridWasteFactor > 10: Yüksek ızgara fire oranı, maliyeti artırabilir.
  // threshold laborCostPerM2 > 30: İşçilik maliyeti ortalamanın üzerinde.
  const hiddenLossDrivers: string[] = ["panelWasteFactor > 10 ? 'Yüksek panel fire oranı' : null","gridWasteFactor > 10 ? 'Yüksek ızgara fire oranı' : null"];
  const suggestedActions: string[] = ["panelWasteFactor > 10 ? 'Panel fire oranını düşürmek için kesim planlamasını optimize edin.' : null","gridWasteFactor > 10 ? 'Izgara fire oranını düşürmek için modüler planlama yapın.' : null","laborCostPerM2 > 30 ? 'İşçilik maliyetini düşürmek için alternatif montaj yöntemleri değerlendirin.' : null"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF raporu","CSV export","Detaylı malzeme listesi","Trend analizi (geçmiş projelerle karşılaştırma)","Karşılaştırmalı fiyat teklifi"],
  };
}
