// Auto-generated from kaynak-dikis-hacmi-maliyeti-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KaynakDikisHacmiMaliyetiHesabiInput {
  weldLength: number;
  weldThroatThickness: number;
  weldType: 'fillet' | 'butt' | 'groove';
  weldWidth: number;
  weldReinforcement: number;
  materialDensity: number;
  materialCostPerKg: number;
  laborCostPerHour: number;
  weldingSpeed: number;
  overheadRate: number;
  dataConfidence: number;
}

export const KaynakDikisHacmiMaliyetiHesabiInputSchema = z.object({
  weldLength: z.number().min(1).max(100000).default(1000),
  weldThroatThickness: z.number().min(1).max(50).default(5),
  weldType: z.enum(['fillet', 'butt', 'groove']).default('fillet'),
  weldWidth: z.number().min(1).max(100).default(10),
  weldReinforcement: z.number().min(0).max(10).default(2),
  materialDensity: z.number().min(1000).max(20000).default(7850),
  materialCostPerKg: z.number().min(0.1).max(100).default(2.5),
  laborCostPerHour: z.number().min(5).max(200).default(30),
  weldingSpeed: z.number().min(10).max(2000).default(300),
  overheadRate: z.number().min(0).max(100).default(20),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface KaynakDikisHacmiMaliyetiHesabiOutput {
  totalCost: number;
  breakdown: {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    weldVolume: number;
    weldMass: number;
    costPerMeter: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KaynakDikisHacmiMaliyetiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.weldVolume = ((): number => { try { const __v = input.weldLength * (input.weldType == 'fillet' ? (input.weldThroatThickness * input.weldThroatThickness / 2) : (input.weldThroatThickness * input.weldWidth)) + (input.weldReinforcement * input.weldWidth * 0.5); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weldMass = ((): number => { try { const __v = results.weldVolume * input.materialDensity / 1e9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.weldMass * input.materialCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weldingTimeHours = ((): number => { try { const __v = input.weldLength / input.weldingSpeed / 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.weldingTimeHours * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.laborCost * input.overheadRate / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.materialCost + results.laborCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerMeter = ((): number => { try { const __v = results.totalCost / (input.weldLength / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100 * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKaynakDikisHacmiMaliyetiHesabi(input: KaynakDikisHacmiMaliyetiHesabiInput): KaynakDikisHacmiMaliyetiHesabiOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    laborCost: results.laborCost,
    overheadCost: results.overheadCost,
    weldVolume: results.weldVolume,
    weldMass: results.weldMass,
    costPerMeter: results.costPerMeter,
  };

  // rule: weldLength > 0
  // rule: weldThroatThickness > 0
  // rule: materialDensity > 0
  // rule: materialCostPerKg > 0
  // rule: laborCostPerHour > 0
  // rule: weldingSpeed > 0
  // rule: overheadRate >= 0
  // rule: dataConfidence >= 50 && dataConfidence <= 100
  // rule: if weldType == 'fillet' then weldWidth == null or weldWidth == 0
  // rule: if weldType == 'butt' or weldType == 'groove' then weldWidth > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): KRITIK: Kaynak bogaz kalinligi cok yuksek, asiri malzeme kullanimi.
  // threshold skipped (non-JS): UYARI: Kaynak hizi cok dusuk, iscilik maliyeti artacak.
  // threshold skipped (non-JS): UYARI: Malzeme maliyeti yuksek, alternatif malzeme dusunulmeli.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli rapor"],
  };
}
