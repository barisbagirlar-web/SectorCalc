/** Runtime-only calculation standard passed from form to generated calculators. */
export const CALCULATION_STANDARD_KEY = "_standard" as const;

export function withCalculationStandard(
  values: Record<string, unknown>,
  standard: string | undefined,
): Record<string, unknown> {
  if (!standard) {
    return values;
  }
  return { ...values, [CALCULATION_STANDARD_KEY]: standard };
}
