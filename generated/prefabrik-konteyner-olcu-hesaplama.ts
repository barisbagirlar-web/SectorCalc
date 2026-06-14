// Auto-generated from prefabrik-konteyner-olcu-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PrefabrikKonteynerOlcuHesaplamaInput {
  containerLength: number;
  containerWidth: number;
  containerHeight: number;
  wallThickness: number;
  materialType: 'steel' | 'aluminum' | 'composite';
  hasInsulation: boolean;
  doorType: 'single' | 'double' | 'roll-up';
  windowCount: number;
  floorType: 'plywood' | 'steel' | 'composite';
}

export const PrefabrikKonteynerOlcuHesaplamaInputSchema = z.object({
  containerLength: z.number().min(2).max(15).default(6),
  containerWidth: z.number().min(2).max(3).default(2.4),
  containerHeight: z.number().min(2.4).max(3).default(2.6),
  wallThickness: z.number().min(30).max(100).default(50),
  materialType: z.enum(['steel', 'aluminum', 'composite']).default('steel'),
  hasInsulation: z.boolean().default(true),
  doorType: z.enum(['single', 'double', 'roll-up']).default('single'),
  windowCount: z.number().min(0).max(4).default(0),
  floorType: z.enum(['plywood', 'steel', 'composite']).default('plywood'),
});

export interface PrefabrikKonteynerOlcuHesaplamaOutput {
  internalVolume: number;
  breakdown: {
    internalLength: number;
    internalWidth: number;
    internalHeight: number;
    floorArea: number;
    wallArea: number;
    doorOpeningWidth: number;
    windowArea: number;
    usableWallArea: number;
    totalWeight: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PrefabrikKonteynerOlcuHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.internalLength = ((): number => { try { const __v = input.containerLength - 2 * (input.wallThickness / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.internalWidth = ((): number => { try { const __v = input.containerWidth - 2 * (input.wallThickness / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.internalHeight = ((): number => { try { const __v = input.containerHeight - (input.hasInsulation ? 0.1 : 0) - (input.wallThickness / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.internalVolume = ((): number => { try { const __v = results.internalLength * results.internalWidth * results.internalHeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.floorArea = ((): number => { try { const __v = results.internalLength * results.internalWidth; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wallArea = ((): number => { try { const __v = 2 * (results.internalLength + results.internalWidth) * results.internalHeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.doorOpeningWidth = ((): number => { try { const __v = input.doorType == 'single' ? 0.9 : (input.doorType == 'double' ? 1.8 : 2.4); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.windowArea = ((): number => { try { const __v = input.windowCount * 0.5; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.usableWallArea = ((): number => { try { const __v = results.wallArea - results.doorOpeningWidth * results.internalHeight - results.windowArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWeight = ((): number => { try { const __v = input.materialType == 'steel' ? 2000 : (input.materialType == 'aluminum' ? 1000 : 1500) + (input.hasInsulation ? 200 : 0) + input.floorType == 'steel' ? 300 : 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePrefabrikKonteynerOlcuHesaplama(input: PrefabrikKonteynerOlcuHesaplamaInput): PrefabrikKonteynerOlcuHesaplamaOutput {
  const results = evaluateFormulas(input);
  const internalVolume = results.internalVolume ?? 0;
  const breakdown = {
    internalLength: results.internalLength,
    internalWidth: results.internalWidth,
    internalHeight: results.internalHeight,
    floorArea: results.floorArea,
    wallArea: results.wallArea,
    doorOpeningWidth: results.doorOpeningWidth,
    windowArea: results.windowArea,
    usableWallArea: results.usableWallArea,
    totalWeight: results.totalWeight,
  };

  // rule: containerLength >= 2 && containerLength <= 15
  // rule: containerWidth >= 2 && containerWidth <= 3
  // rule: containerHeight >= 2.4 && containerHeight <= 3
  // rule: wallThickness >= 30 && wallThickness <= 100
  // rule: windowCount >= 0 && windowCount <= 4
  // rule: if (hasInsulation == false) then wallThickness >= 30 else wallThickness >= 50
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if internalVolume < 10 then 'Small container' else if internalVolume < 30 then 'Medium container' else 'Large container'
  // threshold skipped (non-JS): if wallThickness > 80 then 'Heavy insulation'

  const dataConfidenceAdjusted = (() => { try { return results.internalVolume * (1 - 0.05); } catch { return internalVolume; } })();

  return {
    internalVolume,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Standard Containers","Detailed Report with Material List"],
  };
}
