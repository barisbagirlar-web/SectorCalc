// Auto-generated from boru-agirlik-hesaplama-celik-paslanmaz-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoruAgirlikHesaplamaCelikPaslanmazInput {
  materialType: 'carbon-steel' | 'stainless-steel-304' | 'stainless-steel-316';
  outerDiameter: number;
  wallThickness: number;
  length: number;
  quantity: number;
}

export const BoruAgirlikHesaplamaCelikPaslanmazInputSchema = z.object({
  materialType: z.enum(['carbon-steel', 'stainless-steel-304', 'stainless-steel-316']).default('carbon-steel'),
  outerDiameter: z.number().min(1).max(2000).default(50),
  wallThickness: z.number().min(0.5).max(100).default(5),
  length: z.number().min(0.1).max(50).default(6),
  quantity: z.number().min(1).max(10000).default(1),
});

export interface BoruAgirlikHesaplamaCelikPaslanmazOutput {
  totalWeight: number;
  breakdown: {
    weightPerPipe: number;
    volumePerPipe: number;
    crossSectionArea: number;
    density: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoruAgirlikHesaplamaCelikPaslanmazInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.density = input.materialType === 'carbon-steel' ? 7850 : input.materialType === 'stainless-steel-304' ? 7930 : 7980;
  results.innerDiameter = input.outerDiameter - 2 * input.wallThickness;
  results.crossSectionArea = Math.PI / 4 * (input.outerDiameter * input.outerDiameter - results.innerDiameter * results.innerDiameter) / 1e6;
  results.volumePerPipe = results.crossSectionArea * input.length;
  results.weightPerPipe = results.volumePerPipe * results.density;
  results.totalWeight = results.weightPerPipe * input.quantity;
  return results;
}

export function calculateBoruAgirlikHesaplamaCelikPaslanmaz(input: BoruAgirlikHesaplamaCelikPaslanmazInput): BoruAgirlikHesaplamaCelikPaslanmazOutput {
  const results = evaluateFormulas(input);
  const totalWeight = results.totalWeight;
  const breakdown = {
    weightPerPipe: results.weightPerPipe,
    volumePerPipe: results.volumePerPipe,
    crossSectionArea: results.crossSectionArea,
    density: results.density,
  };

  // rule: outerDiameter > 0
  // rule: wallThickness > 0
  // rule: wallThickness < outerDiameter / 2
  // rule: length > 0
  // rule: quantity >= 1
  // threshold wallThickness: wallThickness < 2 ? 'Düşük et kalınlığı, basınç dayanımını azaltabilir.' : null
  // threshold outerDiameter: outerDiameter > 500 ? 'Büyük çaplı borular özel taşıma gerektirebilir.' : null
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted = results.totalWeight;

  return {
    totalWeight,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF raporu","CSV dışa aktarım","Farklı malzeme karşılaştırması","Birim dönüştürme (kg/lb)"],
  };
}
