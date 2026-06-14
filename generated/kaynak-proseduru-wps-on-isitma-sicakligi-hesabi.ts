// Auto-generated from kaynak-proseduru-wps-on-isitma-sicakligi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KaynakProseduruWpsOnIsitmaSicakligiHesabiInput {
  baseMetalThickness: number;
  carbonEquivalent: number;
  hydrogenLevel: 'low' | 'medium' | 'high';
  heatInput: number;
  restraintDegree: 'low' | 'medium' | 'high';
  ambientTemperature: number;
}

export const KaynakProseduruWpsOnIsitmaSicakligiHesabiInputSchema = z.object({
  baseMetalThickness: z.number().min(1).max(200).default(10),
  carbonEquivalent: z.number().min(0.1).max(1).default(0.4),
  hydrogenLevel: z.enum(['low', 'medium', 'high']).default('low'),
  heatInput: z.number().min(0.5).max(5).default(1.5),
  restraintDegree: z.enum(['low', 'medium', 'high']).default('low'),
  ambientTemperature: z.number().min(-20).max(50).default(20),
});

export interface KaynakProseduruWpsOnIsitmaSicakligiHesabiOutput {
  preheatTemperature: number;
  breakdown: {
    basePreheat: number;
    hydrogenFactor: number;
    heatInputFactor: number;
    restraintFactor: number;
    ambientFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KaynakProseduruWpsOnIsitmaSicakligiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.basePreheat = ((): number => { try { const __v = 50 + (input.carbonEquivalent * 100) + (input.baseMetalThickness * 0.5); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hydrogenFactor = ((): number => { try { const __v = input.hydrogenLevel === 'low' ? 0 : (input.hydrogenLevel === 'medium' ? 20 : 40); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatInputFactor = ((): number => { try { const __v = input.heatInput < 1.0 ? 30 : (input.heatInput < 2.0 ? 0 : -20); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.restraintFactor = ((): number => { try { const __v = input.restraintDegree === 'low' ? 0 : (input.restraintDegree === 'medium' ? 15 : 30); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ambientFactor = ((): number => { try { const __v = input.ambientTemperature < 10 ? (10 - input.ambientTemperature) * 2 : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.preheatTemperature = ((): number => { try { const __v = results.basePreheat + results.hydrogenFactor + results.heatInputFactor + results.restraintFactor + results.ambientFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKaynakProseduruWpsOnIsitmaSicakligiHesabi(input: KaynakProseduruWpsOnIsitmaSicakligiHesabiInput): KaynakProseduruWpsOnIsitmaSicakligiHesabiOutput {
  const results = evaluateFormulas(input);
  const preheatTemperature = results.preheatTemperature ?? 0;
  const breakdown = {
    basePreheat: results.basePreheat,
    hydrogenFactor: results.hydrogenFactor,
    heatInputFactor: results.heatInputFactor,
    restraintFactor: results.restraintFactor,
    ambientFactor: results.ambientFactor,
  };

  // rule: baseMetalThickness must be between 1 and 200 mm
  // rule: carbonEquivalent must be between 0.1 and 1.0 %
  // rule: heatInput must be between 0.5 and 5.0 kJ/mm
  // rule: ambientTemperature must be between -20 and 50 °C
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If preheatTemperature > 250, warning: 'High preheat temperature may cause metallurgical issues.'
  // threshold skipped (non-JS): If carbonEquivalent > 0.45, warning: 'High carbon equivalent increases cracking risk.'

  const dataConfidenceAdjusted = (() => { try { return results.preheatTemperature * (1 - 0.1 * (1 - dataConfidence)); } catch { return preheatTemperature; } })();

  return {
    preheatTemperature,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Standards","Detailed Report"],
  };
}
