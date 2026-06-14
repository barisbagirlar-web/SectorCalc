// Auto-generated from taguchi-kalite-kayip-fonksiyonu-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TaguchiKaliteKayipFonksiyonuCalculatorInput {
  targetValue: number;
  actualValue: number;
  tolerance: number;
  lossAtTolerance: number;
  productionVolume: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const TaguchiKaliteKayipFonksiyonuCalculatorInputSchema = z.object({
  targetValue: z.number().min(0).default(10),
  actualValue: z.number().min(0).default(10.5),
  tolerance: z.number().min(0.001).default(1),
  lossAtTolerance: z.number().min(0).default(100),
  productionVolume: z.number().min(1).default(1000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface TaguchiKaliteKayipFonksiyonuCalculatorOutput {
  totalLoss: number;
  breakdown: {
    deviation: number;
    lossCoefficient: number;
    lossPerUnit: number;
    totalLoss: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TaguchiKaliteKayipFonksiyonuCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.deviation = ((): number => { try { const __v = input.actualValue - input.targetValue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lossCoefficient = ((): number => { try { const __v = input.lossAtTolerance / (input.tolerance * input.tolerance); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lossPerUnit = ((): number => { try { const __v = results.lossCoefficient * (results.deviation * results.deviation); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLoss = ((): number => { try { const __v = results.lossPerUnit * input.productionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.totalLoss * 1.2 : (input.dataConfidence === 'medium' ? results.totalLoss * 1.0 : results.totalLoss * 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTaguchiKaliteKayipFonksiyonuCalculator(input: TaguchiKaliteKayipFonksiyonuCalculatorInput): TaguchiKaliteKayipFonksiyonuCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalLoss = results.totalLoss ?? 0;
  const breakdown = {
    deviation: results.deviation,
    lossCoefficient: results.lossCoefficient,
    lossPerUnit: results.lossPerUnit,
    totalLoss: results.totalLoss,
  };

  // rule: tolerance > 0
  // rule: lossAtTolerance >= 0
  // rule: productionVolume >= 1
  // rule: targetValue >= 0
  // rule: actualValue >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (Math.abs(input.actualValue - input.targetValue) / input.tolerance > 1) hiddenLossDrivers.push("Kritik: Sapma toleransi asti, urun spesifikasyon disi");
  if (lossPerUnit > input.lossAtTolerance) hiddenLossDrivers.push("Uyari: Birim kayip tolerans kaybini asti");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalLoss; } })();

  return {
    totalLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (zaman serisi)","Karsilastirma (farkli senaryolar)","Detayli rapor (alt bilesenler ve grafikler)"],
  };
}
