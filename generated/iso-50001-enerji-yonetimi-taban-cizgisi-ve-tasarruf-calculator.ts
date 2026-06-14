// Auto-generated from iso-50001-enerji-yonetimi-taban-cizgisi-ve-tasarruf-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInput {
  baselineEnergyConsumption: number;
  energyPrice: number;
  productionVolume: number;
  energyReductionTarget: number;
  dataConfidence: 'low' | 'medium' | 'high';
  energySource: 'electricity' | 'natural_gas' | 'steam' | 'other';
}

export const Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInputSchema = z.object({
  baselineEnergyConsumption: z.number().min(0).default(1000000),
  energyPrice: z.number().min(0).default(1.5),
  productionVolume: z.number().min(0).default(100000),
  energyReductionTarget: z.number().min(0).max(100).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  energySource: z.enum(['electricity', 'natural_gas', 'steam', 'other']).default('electricity'),
});

export interface Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorOutput {
  costSavings: number;
  breakdown: {
    energyCostBaseline: number;
    energyIntensityBaseline: number;
    targetEnergyConsumption: number;
    energySavings: number;
    costSavings: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.energyCostBaseline = ((): number => { try { const __v = input.baselineEnergyConsumption * input.energyPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyIntensityBaseline = ((): number => { try { const __v = input.baselineEnergyConsumption / input.productionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.targetEnergyConsumption = ((): number => { try { const __v = input.baselineEnergyConsumption * (1 - input.energyReductionTarget / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energySavings = ((): number => { try { const __v = input.baselineEnergyConsumption - results.targetEnergyConsumption; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costSavings = ((): number => { try { const __v = results.energySavings * input.energyPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedSavings = ((): number => { try { const __v = results.costSavings * (input.dataConfidence == 'high' ? 1.0 : (input.dataConfidence == 'medium' ? 0.85 : 0.7)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculator(input: Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorInput): Iso50001EnerjiYonetimiTabanCizgisiVeTasarrufCalculatorOutput {
  const results = evaluateFormulas(input);
  const costSavings = results.costSavings ?? 0;
  const breakdown = {
    energyCostBaseline: results.energyCostBaseline,
    energyIntensityBaseline: results.energyIntensityBaseline,
    targetEnergyConsumption: results.targetEnergyConsumption,
    energySavings: results.energySavings,
    costSavings: results.costSavings,
  };

  // rule: baselineEnergyConsumption > 0
  // rule: energyPrice > 0
  // rule: productionVolume > 0
  // rule: energyReductionTarget >= 0 && energyReductionTarget <= 100
  // rule: if (energySource == 'electricity') then energyPrice > 0.1
  // rule: if (dataConfidence == 'low') then baselineEnergyConsumption > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek tasarruf hedefi, fizibilite calismasi onerilir.
  // threshold skipped (non-JS): Buyuk olcekli tesis, detayli enerji etudu gerekebilir.
  // threshold skipped (non-JS): Yuksek enerji maliyeti, tasarruf potansiyeli yuksek.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedSavings; } catch { return costSavings; } })();

  return {
    costSavings,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis verilerle karsilastirma)","Detayli enerji etudu raporu","Benchmark karsilastirmasi"],
  };
}
