// Auto-generated from konteyner-yukleme-kapasitesi-teu-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KonteynerYuklemeKapasitesiTeuHesabiInput {
  containerLength: number;
  containerWidth: number;
  containerHeight: number;
  cargoLength: number;
  cargoWidth: number;
  cargoHeight: number;
  stackingFactor: number;
  containerType: 'standard' | 'highCube' | 'openTop' | 'flatRack';
}

export const KonteynerYuklemeKapasitesiTeuHesabiInputSchema = z.object({
  containerLength: z.number().min(0).max(20).default(12.032),
  containerWidth: z.number().min(0).max(3).default(2.352),
  containerHeight: z.number().min(0).max(3).default(2.393),
  cargoLength: z.number().min(0.01).max(12).default(1.2),
  cargoWidth: z.number().min(0.01).max(2.4).default(0.8),
  cargoHeight: z.number().min(0.01).max(2.4).default(1),
  stackingFactor: z.number().min(0.5).max(1).default(0.9),
  containerType: z.enum(['standard', 'highCube', 'openTop', 'flatRack']).default('standard'),
});

export interface KonteynerYuklemeKapasitesiTeuHesabiOutput {
  maxUnitsPerContainer: number;
  breakdown: {
    maxUnitsLength: number;
    maxUnitsWidth: number;
    maxUnitsHeight: number;
    containerVolume: number;
    cargoVolume: number;
    volumeUtilization: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KonteynerYuklemeKapasitesiTeuHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.maxUnitsLength = ((): number => { try { const __v = Math.Math.floor(input.containerLength / input.cargoLength); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maxUnitsWidth = ((): number => { try { const __v = Math.Math.floor(input.containerWidth / input.cargoWidth); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maxUnitsHeight = ((): number => { try { const __v = Math.Math.floor(input.containerHeight / input.cargoHeight); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maxUnitsPerContainer = ((): number => { try { const __v = results.maxUnitsLength * results.maxUnitsWidth * results.maxUnitsHeight * input.stackingFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalTEU = ((): number => { try { const __v = results.maxUnitsPerContainer / 1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKonteynerYuklemeKapasitesiTeuHesabi(input: KonteynerYuklemeKapasitesiTeuHesabiInput): KonteynerYuklemeKapasitesiTeuHesabiOutput {
  const results = evaluateFormulas(input);
  const maxUnitsPerContainer = results.maxUnitsPerContainer ?? 0;
  const breakdown = {
    maxUnitsLength: results.maxUnitsLength,
    maxUnitsWidth: results.maxUnitsWidth,
    maxUnitsHeight: results.maxUnitsHeight,
    containerVolume: results.containerVolume,
    cargoVolume: results.cargoVolume,
    volumeUtilization: results.volumeUtilization,
  };

  // rule: cargoLength <= containerLength
  // rule: cargoWidth <= containerWidth
  // rule: cargoHeight <= containerHeight
  // rule: stackingFactor between 0.5 and 1
  // rule: if containerType == 'highCube' then containerHeight = 2.896
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk istifleme faktoru, kapasite kaybi yuksek
  // threshold skipped (non-JS): Kargo yuksekligi konteyner yuksekligine yakin, dikkatli yukleme gerekli

  const dataConfidenceAdjusted = (() => { try { return results.maxUnitsPerContainer * (dataConfidence || 1); } catch { return maxUnitsPerContainer; } })();

  return {
    maxUnitsPerContainer,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli konteyner tipleri)","Detayli hacim kullanim raporu"],
  };
}
