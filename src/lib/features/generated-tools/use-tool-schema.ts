"use client";

import { useEffect, useMemo, useState } from "react";
import type { z } from "zod";
import { loadClientCalculatorWithOverride } from "@/lib/features/generated-tools/client-calculator-loader";
import type { GeneratedCalculatorModule, GeneratedToolResult, GeneratedToolSchema } from "@/lib/features/generated-tools/types";

export type UseToolSchemaState = {
  readonly loading: boolean;
  readonly error: string | null;
  readonly calculator: GeneratedCalculatorModule | null;
  readonly zodSchema: z.ZodTypeAny | null;
  readonly trustStatus: string | null;
};

export function useToolSchema(slug: string, _schema: GeneratedToolSchema): UseToolSchemaState {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculator, setCalculator] = useState<GeneratedCalculatorModule | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Client-side only: direct dynamic import bypasses the 269KB server registry.
    // The server registry (calculator-registry.ts) is used only for SSG/ISR.
    loadClientCalculatorWithOverride(slug)
      .then((mod) => {
        if (cancelled) return;
        if (!mod) {
          setCalculator(null);
          setError("Calculator module not found.");
          return;
        }
        setCalculator(mod);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load calculator.";
        setError(message);
        setCalculator(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const zodSchema = useMemo(() => calculator?.inputSchema ?? null, [calculator]);

  return {
    loading,
    error,
    calculator,
    zodSchema,
    trustStatus: calculator?.trustStatus ?? null,
  };
}

export function runGeneratedToolCalculation(
  calculator: GeneratedCalculatorModule,
  input: Record<string, unknown>,
): GeneratedToolResult {
  return calculator.calculate(input);
}
