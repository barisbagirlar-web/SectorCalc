// Auto-generated from ruzgar-turbini-yaklasik-uretim-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RuzgarTurbiniYaklasikUretimHesabiInput {
  ratedPower: number;
  hubHeight: number;
  rotorDiameter: number;
  averageWindSpeed: number;
  airDensity: number;
  capacityFactor: number;
  availability: number;
  hoursPerYear: number;
}

export const RuzgarTurbiniYaklasikUretimHesabiInputSchema = z.object({
  ratedPower: z.number().min(100).max(15000).default(2000),
  hubHeight: z.number().min(30).max(200).default(80),
  rotorDiameter: z.number().min(20).max(200).default(100),
  averageWindSpeed: z.number().min(3).max(25).default(7),
  airDensity: z.number().min(1).max(1.5).default(1.225),
  capacityFactor: z.number().min(10).max(60).default(30),
  availability: z.number().min(80).max(100).default(95),
  hoursPerYear: z.number().min(8000).max(8760).default(8760),
});

export interface RuzgarTurbiniYaklasikUretimHesabiOutput {
  annualEnergyNet: number;
  breakdown: {
    sweptArea: number;
    theoreticalPower: number;
    annualEnergyGross: number;
    annualEnergyNet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RuzgarTurbiniYaklasikUretimHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.sweptArea = ((): number => { try { const __v = pi * (input.rotorDiameter/2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.theoreticalPower = ((): number => { try { const __v = 0.5 * input.airDensity * results.sweptArea * input.averageWindSpeed^3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyGross = ((): number => { try { const __v = input.ratedPower * input.hoursPerYear * (input.capacityFactor/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyNet = ((): number => { try { const __v = results.annualEnergyGross * (input.availability/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primary = ((): number => { try { const __v = results.annualEnergyNet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRuzgarTurbiniYaklasikUretimHesabi(input: RuzgarTurbiniYaklasikUretimHesabiInput): RuzgarTurbiniYaklasikUretimHesabiOutput {
  const results = evaluateFormulas(input);
  const annualEnergyNet = results.annualEnergyNet ?? 0;
  const breakdown = {
    sweptArea: results.sweptArea,
    theoreticalPower: results.theoreticalPower,
    annualEnergyGross: results.annualEnergyGross,
    annualEnergyNet: results.annualEnergyNet,
  };

  // rule: rotorDiameter must be less than or equal to 2 * hubHeight (structural constraint)
  // rule: averageWindSpeed must be between cut-in and cut-out speeds (typically 3-25 m/s)
  // rule: capacityFactor must be between 0 and 100
  // rule: availability must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if capacityFactor < 20 then 'Dusuk kapasite faktoru: saha verimsiz olabilir'
  // threshold skipped (non-JS): if availability < 90 then 'Kritik: kullanilabilirlik dusuk, bakim planini gozden gecirin'

  const dataConfidenceAdjusted = (() => { try { return annualEnergyNet; } catch { return annualEnergyNet; } })();

  return {
    annualEnergyNet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis verilerle karsilastirma)","Detayli rapor (bilesen bazinda kayiplar)"],
  };
}
