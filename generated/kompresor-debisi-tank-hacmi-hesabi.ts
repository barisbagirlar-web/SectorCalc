// Auto-generated from kompresor-debisi-tank-hacmi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KompresorDebisiTankHacmiHesabiInput {
  compressorFlowRate: number;
  tankVolume: number;
  maxPressure: number;
  minPressure: number;
  usagePattern: 'continuous' | 'intermittent' | 'peak';
  airDemand: number;
  compressorCycleTime: number;
}

export const KompresorDebisiTankHacmiHesabiInputSchema = z.object({
  compressorFlowRate: z.number().min(0.1).max(1000).default(10),
  tankVolume: z.number().min(0.01).max(100).default(1),
  maxPressure: z.number().min(1).max(20).default(8),
  minPressure: z.number().min(0.5).max(19).default(6),
  usagePattern: z.enum(['continuous', 'intermittent', 'peak']).default('continuous'),
  airDemand: z.number().min(0.1).max(1000).default(8),
  compressorCycleTime: z.number().min(1).max(60).default(10),
});

export interface KompresorDebisiTankHacmiHesabiOutput {
  requiredTankVolume: number;
  breakdown: {
    availableAirTime: number;
    cycleFrequency: number;
    tankUtilization: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KompresorDebisiTankHacmiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.requiredTankVolume = ((): number => { try { const __v = ((input.compressorFlowRate - input.airDemand) * input.compressorCycleTime) / (input.maxPressure - input.minPressure); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.availableAirTime = ((): number => { try { const __v = (input.tankVolume * (input.maxPressure - input.minPressure)) / input.airDemand; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cycleFrequency = ((): number => { try { const __v = 60 / input.compressorCycleTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tankUtilization = ((): number => { try { const __v = input.airDemand / input.compressorFlowRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKompresorDebisiTankHacmiHesabi(input: KompresorDebisiTankHacmiHesabiInput): KompresorDebisiTankHacmiHesabiOutput {
  const results = evaluateFormulas(input);
  const requiredTankVolume = results.requiredTankVolume ?? 0;
  const breakdown = {
    availableAirTime: results.availableAirTime,
    cycleFrequency: results.cycleFrequency,
    tankUtilization: results.tankUtilization,
  };

  // rule: compressorFlowRate > 0
  // rule: tankVolume > 0
  // rule: maxPressure > minPressure
  // rule: airDemand < compressorFlowRate
  // rule: compressorCycleTime > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if tankVolume < (compressorFlowRate - airDemand) * compressorCycleTime / (maxPressure - minPressure) then 'Tank hacmi yetersiz, sik devreye girme riski'
  // threshold skipped (non-JS): if airDemand > 0.9 * compressorFlowRate then 'Kritik: Hava talebi kompresor kapasitesine cok yakin'

  const dataConfidenceAdjusted = (() => { try { return results.requiredTankVolume * 1.1; } catch { return requiredTankVolume; } })();

  return {
    requiredTankVolume,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma modulu","Detayli rapor"],
  };
}
