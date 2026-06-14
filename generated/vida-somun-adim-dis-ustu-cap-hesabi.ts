// Auto-generated from vida-somun-adim-dis-ustu-cap-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface VidaSomunAdimDisUstuCapHesabiInput {
  nominalDiameter: number;
  pitch: number;
  threadClass: '4g' | '6g' | '6e' | '6h' | '8g';
  threadType: 'metric' | 'unified' | 'whitworth';
}

export const VidaSomunAdimDisUstuCapHesabiInputSchema = z.object({
  nominalDiameter: z.number().min(1).max(100).default(10),
  pitch: z.number().min(0.25).max(6).default(1.5),
  threadClass: z.enum(['4g', '6g', '6e', '6h', '8g']).default('6g'),
  threadType: z.enum(['metric', 'unified', 'whitworth']).default('metric'),
});

export interface VidaSomunAdimDisUstuCapHesabiOutput {
  pitchDiameter: number;
  breakdown: {
    majorDiameter: number;
    minorDiameter: number;
    threadHeight: number;
    rootRadius: number;
    crestFlat: number;
    rootFlat: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: VidaSomunAdimDisUstuCapHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.majorDiameter = ((): number => { try { const __v = input.nominalDiameter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.pitchDiameter = ((): number => { try { const __v = input.nominalDiameter - 0.6495 * input.pitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.minorDiameter = ((): number => { try { const __v = input.nominalDiameter - 1.0825 * input.pitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.threadHeight = ((): number => { try { const __v = 0.5413 * input.pitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.rootRadius = ((): number => { try { const __v = 0.1443 * input.pitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.crestFlat = ((): number => { try { const __v = 0.125 * input.pitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.rootFlat = ((): number => { try { const __v = 0.25 * input.pitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateVidaSomunAdimDisUstuCapHesabi(input: VidaSomunAdimDisUstuCapHesabiInput): VidaSomunAdimDisUstuCapHesabiOutput {
  const results = evaluateFormulas(input);
  const pitchDiameter = results.pitchDiameter ?? 0;
  const breakdown = {
    majorDiameter: results.majorDiameter,
    minorDiameter: results.minorDiameter,
    threadHeight: results.threadHeight,
    rootRadius: results.rootRadius,
    crestFlat: results.crestFlat,
    rootFlat: results.rootFlat,
  };

  // rule: pitch must be less than nominalDiameter
  // rule: if threadType='metric' then pitch must be a standard metric pitch (0.25,0.5,0.75,1,1.25,1.5,2,2.5,3,4,5,6)
  // rule: if threadType='unified' then pitch must be in inches (converted to mm)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if pitch/nominalDiameter > 0.2 then 'High pitch ratio: possible thread strength issue'

  const dataConfidenceAdjusted = (() => { try { return results.pitchDiameter; } catch { return pitchDiameter; } })();

  return {
    pitchDiameter,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export of thread dimensions","CSV export of calculation results","Trend analysis of thread dimensions over multiple inputs","Comparison with standard thread tables"],
  };
}
