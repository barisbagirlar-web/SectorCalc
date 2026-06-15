import { loadGeneratedCalculator as loadBaseCalculator } from "@/lib/generated-tools/calculator-registry";
import { applyStandardCalculatorOverride } from "@/lib/generated-tools/standard-calculator-overrides";
import type { GeneratedCalculatorModule } from "@/lib/generated-tools/types";

export async function loadGeneratedCalculator(
  slug: string,
): Promise<GeneratedCalculatorModule | null> {
  const module = await loadBaseCalculator(slug);
  if (!module) {
    return null;
  }
  return applyStandardCalculatorOverride(slug, module);
}
