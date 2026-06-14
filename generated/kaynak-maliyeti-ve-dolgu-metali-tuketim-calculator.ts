// Auto-generated from kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KaynakMaliyetiVeDolguMetaliTuketimCalculatorInput {
  weldingProcess: 'SMAW' | 'GMAW' | 'FCAW' | 'GTAW' | 'SAW';
  jointType: 'Butt' | 'Fillet' | 'Lap' | 'Corner' | 'Edge';
  plateThickness: number;
  weldLength: number;
  weldCrossSectionArea: number;
  fillerMetalDensity: number;
  fillerMetalCostPerKg: number;
  laborCostPerHour: number;
  weldingSpeed: number;
  depositionEfficiency: number;
  overheadCostPerHour: number;
  dataConfidence: number;
}

export const KaynakMaliyetiVeDolguMetaliTuketimCalculatorInputSchema = z.object({
  weldingProcess: z.enum(['SMAW', 'GMAW', 'FCAW', 'GTAW', 'SAW']).default('SMAW'),
  jointType: z.enum(['Butt', 'Fillet', 'Lap', 'Corner', 'Edge']).default('Butt'),
  plateThickness: z.number().min(1).max(100).default(10),
  weldLength: z.number().min(0.1).max(100).default(1),
  weldCrossSectionArea: z.number().min(1).max(1000).default(50),
  fillerMetalDensity: z.number().min(2).max(20).default(7.85),
  fillerMetalCostPerKg: z.number().min(0.1).max(100).default(5),
  laborCostPerHour: z.number().min(0).max(200).default(30),
  weldingSpeed: z.number().min(10).max(2000).default(300),
  depositionEfficiency: z.number().min(10).max(100).default(80),
  overheadCostPerHour: z.number().min(0).max(100).default(15),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface KaynakMaliyetiVeDolguMetaliTuketimCalculatorOutput {
  totalCost: number;
  breakdown: {
    fillerMetalCost: number;
    laborCost: number;
    overheadCost: number;
    fillerMetalConsumption: number;
    weldingTime: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.fillerMetalVolume = ((): number => { try { const __v = input.weldCrossSectionArea * input.weldLength * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fillerMetalWeight = ((): number => { try { const __v = results.fillerMetalVolume * input.fillerMetalDensity / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fillerMetalConsumption = ((): number => { try { const __v = results.fillerMetalWeight / (input.depositionEfficiency / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fillerMetalCost = ((): number => { try { const __v = results.fillerMetalConsumption * input.fillerMetalCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.weldingTime = ((): number => { try { const __v = input.weldLength * 1000 / input.weldingSpeed; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.weldingTime * input.laborCostPerHour / 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.weldingTime * input.overheadCostPerHour / 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.fillerMetalCost + results.laborCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerMeter = ((): number => { try { const __v = results.totalCost / input.weldLength; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKaynakMaliyetiVeDolguMetaliTuketimCalculator(input: KaynakMaliyetiVeDolguMetaliTuketimCalculatorInput): KaynakMaliyetiVeDolguMetaliTuketimCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    fillerMetalCost: results.fillerMetalCost,
    laborCost: results.laborCost,
    overheadCost: results.overheadCost,
    fillerMetalConsumption: results.fillerMetalConsumption,
    weldingTime: results.weldingTime,
  };

  // rule: plateThickness >= 1
  // rule: weldLength >= 0.1
  // rule: weldCrossSectionArea >= 1
  // rule: fillerMetalDensity >= 2
  // rule: fillerMetalCostPerKg >= 0.1
  // rule: laborCostPerHour >= 0
  // rule: weldingSpeed >= 10
  // rule: depositionEfficiency >= 10 && depositionEfficiency <= 100
  // rule: overheadCostPerHour >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk biriktirme verimliligi, yuksek dolgu metal tuketimine isaret eder. Proses veya parametreler gozden gecirilmelidir.
  // threshold skipped (non-JS): Iscilik maliyeti yuksek; otomasyon veya proses iyilestirme dusunulebilir.
  // threshold skipped (non-JS): Kaynak hizi cok dusuk; verimlilik dusuk olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli prosesler)","Detayli maliyet dokumu"],
  };
}
