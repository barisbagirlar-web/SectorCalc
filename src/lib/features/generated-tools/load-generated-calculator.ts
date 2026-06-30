import { loadGeneratedCalculator as loadBaseCalculator } from "@/lib/features/generated-tools/calculator-registry";
import { applyStandardCalculatorOverride } from "@/lib/features/generated-tools/standard-calculator-overrides";
import type { GeneratedCalculatorModule } from "@/lib/features/generated-tools/types";

export async function loadGeneratedCalculator(
  slug: string,
): Promise<GeneratedCalculatorModule | null> {
  const calculatorModule = await loadBaseCalculator(slug);
  if (!calculatorModule) {
    return null;
  }
  return applyStandardCalculatorOverride(slug, calculatorModule);
}
