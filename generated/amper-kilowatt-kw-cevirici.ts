// Auto-generated from amper-kilowatt-kw-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AmperKilowattKwCeviriciInput {
  current: number;
  voltage: number;
  powerFactor: number;
  phaseType: 'single' | 'three';
  efficiency: number;
}

export const AmperKilowattKwCeviriciInputSchema = z.object({
  current: z.number().min(0).max(10000).default(0),
  voltage: z.number().min(0).max(100000).default(230),
  powerFactor: z.number().min(0).max(1).default(0.85),
  phaseType: z.enum(['single', 'three']).default('single'),
  efficiency: z.number().min(0).max(100).default(100),
});

export interface AmperKilowattKwCeviriciOutput {
  outputPower: number;
  breakdown: {
    apparentPower: number;
    activePower: number;
    activePowerKW: number;
    inputPower: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AmperKilowattKwCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.apparentPower = (() => { try { return 0; } catch { return 0; } })();
  results.activePower = (() => { try { return results.apparentPower * input.powerFactor; } catch { return 0; } })();
  results.activePowerKW = (() => { try { return results.activePower / 1000; } catch { return 0; } })();
  results.inputPower = (() => { try { return results.activePowerKW / (input.efficiency / 100); } catch { return 0; } })();
  results.outputPower = (() => { try { return results.activePowerKW; } catch { return 0; } })();
  return results;
}

export function calculateAmperKilowattKwCevirici(input: AmperKilowattKwCeviriciInput): AmperKilowattKwCeviriciOutput {
  const results = evaluateFormulas(input);
  const outputPower = results.outputPower ?? 0;
  const breakdown = {
    apparentPower: results.apparentPower,
    activePower: results.activePower,
    activePowerKW: results.activePowerKW,
    inputPower: results.inputPower,
  };

  // rule: current >= 0
  // rule: voltage > 0
  // rule: powerFactor > 0 and powerFactor <= 1
  // rule: efficiency > 0 and efficiency <= 100
  // rule: if phaseType == 'three' then voltage must be line-to-line voltage
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk guc faktoru uyarisi: Reaktif guc cezasi riski, kompanzasyon onerilir.
  // threshold skipped (non-JS): Dusuk verim uyarisi: Enerji kaybi yuksek, motor degisimi dusunulmeli.

  const dataConfidenceAdjusted = (() => { try { return results.outputPower * (dataConfidence || 1); } catch { return outputPower; } })();

  return {
    outputPower,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Karsilastirma (farkli senaryolar)","Detayli rapor (guc kalitesi, harmonik analizi)"],
  };
}
