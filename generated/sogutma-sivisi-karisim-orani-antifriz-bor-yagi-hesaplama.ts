// Auto-generated from sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInput {
  coolantType: 'antifriz' | 'bor yagi';
  desiredTemperature: number;
  systemVolume: number;
  currentConcentration: number;
  targetConcentration: number;
}

export const SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInputSchema = z.object({
  coolantType: z.enum(['antifriz', 'bor yagi']).default('antifriz'),
  desiredTemperature: z.number().min(-50).max(0).default(-20),
  systemVolume: z.number().min(1).max(1000).default(10),
  currentConcentration: z.number().min(0).max(100).default(0),
  targetConcentration: z.number().min(0).max(100).default(50),
});

export interface SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaOutput {
  requiredAdditiveVolume: number;
  breakdown: {
    requiredAdditiveVolume: number;
    waterVolume: number;
    finalConcentration: number;
    freezingPoint: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.requiredAdditiveVolume = ((): number => { try { const __v = input.systemVolume * (input.targetConcentration - input.currentConcentration) / (100 - input.currentConcentration); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.waterVolume = ((): number => { try { const __v = input.systemVolume - results.requiredAdditiveVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalConcentration = ((): number => { try { const __v = input.targetConcentration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.freezingPoint = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama(input: SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaInput): SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const requiredAdditiveVolume = results.requiredAdditiveVolume ?? 0;
  const breakdown = {
    requiredAdditiveVolume: results.requiredAdditiveVolume,
    waterVolume: results.waterVolume,
    finalConcentration: results.finalConcentration,
    freezingPoint: results.freezingPoint,
  };

  // rule: desiredTemperature must be between -50 and 0
  // rule: systemVolume must be positive
  // rule: currentConcentration must be between 0 and 100
  // rule: targetConcentration must be between 0 and 100
  // rule: if coolantType == 'antifriz' then targetConcentration <= 70 (asiri konsantrasyon donma noktasini yukseltebilir)
  // rule: if coolantType == 'bor yagi' then targetConcentration <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kritik: Antifriz konsantrasyonu %70'in uzerinde donma korumasi azalir.
  // threshold skipped (non-JS): Uyari: Cok dusuk sicaklik, ozel sogutma sivisi gerekebilir.

  const dataConfidenceAdjusted = (() => { try { return results.requiredAdditiveVolume * (1 - 0.1); } catch { return requiredAdditiveVolume; } })();

  return {
    requiredAdditiveVolume,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma modulu","Detayli rapor"],
  };
}
