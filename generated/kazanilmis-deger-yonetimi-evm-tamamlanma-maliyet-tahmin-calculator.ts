// Auto-generated from kazanilmis-deger-yonetimi-evm-tamamlanma-maliyet-tahmin-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInput {
  bac: number;
  ac: number;
  ev: number;
  pv: number;
  cpi: number;
  spi: number;
  etcMethod: 'typical' | 'atypical' | 'custom';
  etcCustom: number;
}

export const KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInputSchema = z.object({
  bac: z.number().min(0).default(100000),
  ac: z.number().min(0).default(50000),
  ev: z.number().min(0).default(40000),
  pv: z.number().min(0).default(60000),
  cpi: z.number().min(0).default(0.8),
  spi: z.number().min(0).default(0.67),
  etcMethod: z.enum(['typical', 'atypical', 'custom']).default('typical'),
  etcCustom: z.number().min(0).default(0),
});

export interface KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorOutput {
  eac: number;
  breakdown: {
    etc: number;
    vac: number;
    tcpi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.eac = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.etc = ((): number => { try { const __v = results.eac - input.ac; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.vac = ((): number => { try { const __v = input.bac - results.eac; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tcpi = ((): number => { try { const __v = (input.bac - input.ev) / (input.bac - input.ac); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculator(input: KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorInput): KazanilmisDegerYonetimiEvmTamamlanmaMaliyetTahminCalculatorOutput {
  const results = evaluateFormulas(input);
  const eac = results.eac ?? 0;
  const breakdown = {
    etc: results.etc,
    vac: results.vac,
    tcpi: results.tcpi,
  };

  // rule: bac > 0
  // rule: ac >= 0
  // rule: ev >= 0
  // rule: pv >= 0
  // rule: cpi > 0
  // rule: spi > 0
  // rule: if etcMethod == 'custom' then etcCustom > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kritik: CPI < 0.8, maliyet asimi riski yuksek.
  // threshold skipped (non-JS): Kritik: SPI < 0.8, takvim gecikmesi riski yuksek.
  // threshold skipped (non-JS): Uyari: CPI < 1.0, maliyet asimi var.
  // threshold skipped (non-JS): Uyari: SPI < 1.0, takvim gecikmesi var.

  const dataConfidenceAdjusted = (() => { try { return results.eac; } catch { return eac; } })();

  return {
    eac,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Baseline","Detailed Report"],
  };
}
