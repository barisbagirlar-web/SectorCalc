// Auto-generated from boya-kaplama-sarfiyati-m-basina-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoyaKaplamaSarfiyatiMBasinaHesabiInput {
  coverageRate: number;
  surfaceArea: number;
  numberOfCoats: number;
  wasteFactor: number;
  applicationMethod: 'spray' | 'brush' | 'roller' | 'dip';
  paintDensity: number;
  paintCostPerLiter: number;
  laborCostPerHour: number;
  laborProductivity: number;
  dataConfidence: number;
}

export const BoyaKaplamaSarfiyatiMBasinaHesabiInputSchema = z.object({
  coverageRate: z.number().min(1).max(50).default(10),
  surfaceArea: z.number().min(0.1).max(10000).default(100),
  numberOfCoats: z.number().min(1).max(10).default(2),
  wasteFactor: z.number().min(0).max(50).default(10),
  applicationMethod: z.enum(['spray', 'brush', 'roller', 'dip']).default('spray'),
  paintDensity: z.number().min(0.8).max(2).default(1.3),
  paintCostPerLiter: z.number().min(1).max(1000).default(50),
  laborCostPerHour: z.number().min(0).max(500).default(30),
  laborProductivity: z.number().min(1).max(100).default(20),
  dataConfidence: z.number().min(50).max(100).default(90),
});

export interface BoyaKaplamaSarfiyatiMBasinaHesabiOutput {
  costPerSquareMeter: number;
  breakdown: {
    theoreticalPaintVolume: number;
    actualPaintVolume: number;
    paintWeight: number;
    paintCost: number;
    laborHours: number;
    laborCost: number;
    totalCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoyaKaplamaSarfiyatiMBasinaHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.theoreticalPaintVolume = (() => { try { return input.surfaceArea * input.numberOfCoats / input.coverageRate; } catch { return 0; } })();
  results.actualPaintVolume = (() => { try { return results.theoreticalPaintVolume * (1 + input.wasteFactor / 100); } catch { return 0; } })();
  results.paintWeight = (() => { try { return results.actualPaintVolume * input.paintDensity; } catch { return 0; } })();
  results.paintCost = (() => { try { return results.actualPaintVolume * input.paintCostPerLiter; } catch { return 0; } })();
  results.laborHours = (() => { try { return input.surfaceArea * input.numberOfCoats / input.laborProductivity; } catch { return 0; } })();
  results.laborCost = (() => { try { return results.laborHours * input.laborCostPerHour; } catch { return 0; } })();
  results.totalCost = (() => { try { return results.paintCost + results.laborCost; } catch { return 0; } })();
  results.costPerSquareMeter = (() => { try { return results.totalCost / input.surfaceArea; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = (() => { try { return results.costPerSquareMeter * (1 + (100 - input.dataConfidence) / 100); } catch { return 0; } })();
  return results;
}

export function calculateBoyaKaplamaSarfiyatiMBasinaHesabi(input: BoyaKaplamaSarfiyatiMBasinaHesabiInput): BoyaKaplamaSarfiyatiMBasinaHesabiOutput {
  const results = evaluateFormulas(input);
  const costPerSquareMeter = results.costPerSquareMeter ?? 0;
  const breakdown = {
    theoreticalPaintVolume: results.theoreticalPaintVolume,
    actualPaintVolume: results.actualPaintVolume,
    paintWeight: results.paintWeight,
    paintCost: results.paintCost,
    laborHours: results.laborHours,
    laborCost: results.laborCost,
    totalCost: results.totalCost,
  };

  // rule: coverageRate > 0
  // rule: surfaceArea > 0
  // rule: numberOfCoats >= 1
  // rule: wasteFactor >= 0 && wasteFactor <= 50
  // rule: paintDensity > 0
  // rule: paintCostPerLiter > 0
  // rule: laborCostPerHour >= 0
  // rule: laborProductivity > 0
  // rule: dataConfidence >= 50 && dataConfidence <= 100
  // rule: if applicationMethod == 'spray' then wasteFactor >= 10 else wasteFactor >= 5
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek atik orani, uygulama yontemini gozden gecirin.
  // threshold skipped (non-JS): Dusuk verimlilik, egitim veya ekipman iyilestirmesi gerekebilir.
  // threshold skipped (non-JS): Yuksek boya maliyeti, alternatif tedarikciler degerlendirilmeli.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return costPerSquareMeter; } })();

  return {
    costPerSquareMeter,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis hesaplamalar)","Karsilastirma (farkli senaryolar)","Detayli maliyet dokumu raporu"],
  };
}
