import type { GeneratedCalculatorModule } from "@/lib/generated-tools/types";

export const CALCULATOR_LOADERS: Readonly<Record<string, () => Promise<GeneratedCalculatorModule>>> =
  {};

export const GENERATED_CALCULATOR_SLUGS = Object.freeze(
  Object.keys(CALCULATOR_LOADERS).sort((left, right) => left.localeCompare(right)),
) as readonly string[];

export async function loadGeneratedCalculator(
  _slug: string,
): Promise<GeneratedCalculatorModule | null> {
  return null;
}
