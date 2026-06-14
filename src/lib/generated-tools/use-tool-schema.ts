"use client";

import { useEffect, useMemo, useState } from "react";
import type { z } from "zod";
import { loadGeneratedCalculator } from "@/lib/generated-tools/calculator-registry";
import type {
  GeneratedCalculatorModule,
  GeneratedToolResult,
  GeneratedToolSchema,
} from "@/lib/generated-tools/types";

export type UseToolSchemaState = {
  readonly loading: boolean;
  readonly error: string | null;
  readonly calculator: GeneratedCalculatorModule | null;
  readonly zodSchema: z.ZodTypeAny | null;
};

export function useToolSchema(slug: string, _schema: GeneratedToolSchema): UseToolSchemaState {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculator, setCalculator] = useState<GeneratedCalculatorModule | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void loadGeneratedCalculator(slug)
      .then((mod) => {
        if (cancelled) {
          return;
        }
        if (!mod) {
          setCalculator(null);
          setError("Calculator module not found.");
          return;
        }
        setCalculator(mod);
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        const message = err instanceof Error ? err.message : "Failed to load calculator.";
        setError(message);
        setCalculator(null);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
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
  };
}

export function runGeneratedToolCalculation(
  calculator: GeneratedCalculatorModule,
  input: Record<string, unknown>,
): GeneratedToolResult {
  return calculator.calculate(input);
}
