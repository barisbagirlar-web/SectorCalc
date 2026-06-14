// Auto-generated from matkap-kilavuz-delik-capi-tablosu-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MatkapKilavuzDelikCapiTablosuInput {
  threadSize: 'M3' | 'M4' | 'M5' | 'M6' | 'M8' | 'M10' | 'M12' | 'M16' | 'M20' | 'M24';
  threadPitch: number;
  materialType: 'Celik' | 'Paslanmaz Celik' | 'Aluminyum' | 'Pirinc' | 'Dokme Demir' | 'Plastik';
  toleranceClass: '4H' | '5H' | '6H' | '7H';
  drillType: 'Standart HSS' | 'Kobalt HSS' | 'Karbur' | 'TiN Kaplamali';
  coating: 'Kaplamasiz' | 'TiN' | 'TiCN' | 'TiAlN';
  holeDepth: number;
  threadEngagement: number;
}

export const MatkapKilavuzDelikCapiTablosuInputSchema = z.object({
  threadSize: z.enum(['M3', 'M4', 'M5', 'M6', 'M8', 'M10', 'M12', 'M16', 'M20', 'M24']).default('M6'),
  threadPitch: z.number().min(0.25).max(6).default(1),
  materialType: z.enum(['Celik', 'Paslanmaz Celik', 'Aluminyum', 'Pirinc', 'Dokme Demir', 'Plastik']).default('Celik'),
  toleranceClass: z.enum(['4H', '5H', '6H', '7H']).default('6H'),
  drillType: z.enum(['Standart HSS', 'Kobalt HSS', 'Karbur', 'TiN Kaplamali']).default('Standart HSS'),
  coating: z.enum(['Kaplamasiz', 'TiN', 'TiCN', 'TiAlN']).default('Kaplamasiz'),
  holeDepth: z.number().min(1).max(500).default(20),
  threadEngagement: z.number().min(50).max(100).default(75),
});

export interface MatkapKilavuzDelikCapiTablosuOutput {
  recommendedDrillDiameter: number;
  breakdown: {
    basicTapDrillSize: number;
    engagementFactor: number;
    adjustedDrillSize: number;
    toleranceAdjustment: number;
    materialAdjustment: number;
    coatingAdjustment: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MatkapKilavuzDelikCapiTablosuInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.nominalDiameter = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.pitch = ((): number => { try { const __v = input.threadPitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.basicTapDrillSize = ((): number => { try { const __v = results.nominalDiameter - results.pitch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.engagementFactor = ((): number => { try { const __v = input.threadEngagement / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedDrillSize = ((): number => { try { const __v = results.basicTapDrillSize + (0.5 * results.pitch * (1 - results.engagementFactor)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalDrillSize = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toleranceAdjustment = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialAdjustment = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coatingAdjustment = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.recommendedDrillDiameter = ((): number => { try { const __v = results.finalDrillSize + results.toleranceAdjustment + results.materialAdjustment + results.coatingAdjustment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMatkapKilavuzDelikCapiTablosu(input: MatkapKilavuzDelikCapiTablosuInput): MatkapKilavuzDelikCapiTablosuOutput {
  const results = evaluateFormulas(input);
  const recommendedDrillDiameter = results.recommendedDrillDiameter ?? 0;
  const breakdown = {
    basicTapDrillSize: results.basicTapDrillSize,
    engagementFactor: results.engagementFactor,
    adjustedDrillSize: results.adjustedDrillSize,
    toleranceAdjustment: results.toleranceAdjustment,
    materialAdjustment: results.materialAdjustment,
    coatingAdjustment: results.coatingAdjustment,
  };

  // rule: threadPitch must be between 0.25 and 6.0 mm
  // rule: holeDepth must be positive
  // rule: threadEngagement must be between 50 and 100
  // rule: If materialType is 'Plastik', threadEngagement should be <= 70 to avoid cracking
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if threadEngagement > 90: 'Yuksek dis tutma orani, kirilma riski artabilir'
  // threshold skipped (non-JS): if holeDepth > 100: 'Derin delik, talas tahliyesi zor, ozel matkap gerekebilir'

  const dataConfidenceAdjusted = (() => { try { return recommendedDrillDiameter; } catch { return recommendedDrillDiameter; } })();

  return {
    recommendedDrillDiameter,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis hesaplamalar)","Karsilastirma (farkli dis boyutlari)","Detayli tolerans raporu"],
  };
}
