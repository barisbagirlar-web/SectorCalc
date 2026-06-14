// Auto-generated from alti-sigma-dpmo-sigma-seviyesi-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AltiSigmaDpmoSigmaSeviyesiCeviriciInput {
  defects: number;
  units: number;
  opportunitiesPerUnit: number;
  sigmaShift: number;
}

export const AltiSigmaDpmoSigmaSeviyesiCeviriciInputSchema = z.object({
  defects: z.number().min(0).default(0),
  units: z.number().min(1).default(1),
  opportunitiesPerUnit: z.number().min(1).default(1),
  sigmaShift: z.number().min(0).max(2).default(1.5),
});

export interface AltiSigmaDpmoSigmaSeviyesiCeviriciOutput {
  sigmaLevel: number;
  breakdown: {
    dpmo: number;
    totalOpportunities: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AltiSigmaDpmoSigmaSeviyesiCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalOpportunities = ((): number => { try { const __v = input.units * input.opportunitiesPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dpmo = ((): number => { try { const __v = (input.defects / results.totalOpportunities) * 1000000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sigmaLevel = ((): number => { try { const __v = normsinv(1 - (results.dpmo / 1000000)) + input.sigmaShift; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateAltiSigmaDpmoSigmaSeviyesiCevirici(input: AltiSigmaDpmoSigmaSeviyesiCeviriciInput): AltiSigmaDpmoSigmaSeviyesiCeviriciOutput {
  const results = evaluateFormulas(input);
  const sigmaLevel = results.sigmaLevel ?? 0;
  const breakdown = {
    dpmo: results.dpmo,
    totalOpportunities: results.totalOpportunities,
  };

  // rule: defects >= 0
  // rule: units >= 1
  // rule: opportunitiesPerUnit >= 1
  // rule: sigmaShift >= 0 and sigmaShift <= 2
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Hata sayisi toplam firsattan fazla olamaz.
  // threshold skipped (non-JS): DPMO cok yuksek, surec iyilestirme acil.

  const dataConfidenceAdjusted = (() => { try { return results.sigmaLevel; } catch { return sigmaLevel; } })();

  return {
    sigmaLevel,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
