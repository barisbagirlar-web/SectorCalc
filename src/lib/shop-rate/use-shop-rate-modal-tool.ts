"use client";

import { useEffect, useState } from "react";
import { loadGeneratedCalculator } from "@/lib/generated-tools/calculator-registry";
import type { GeneratedCalculatorModule, GeneratedToolSchema } from "@/lib/generated-tools/types";
import { SHOP_RATE_MODAL_CALCULATOR } from "@/lib/shop-rate/modal-calculator";
import {
  SHOP_RATE_MODAL_SLUG,
  SHOP_RATE_SCHEMA_PUBLIC_PATH,
} from "@/lib/shop-rate/types";
import type { z } from "zod";
import shopRateSchemaFallback from "../../../generated/schemas/shop-rate-hourly-cost-calculator-schema.json";

export type UseShopRateModalToolState = {
  readonly schema: GeneratedToolSchema | null;
  readonly calculator: GeneratedCalculatorModule | null;
  readonly zodSchema: z.ZodTypeAny | null;
  readonly loading: boolean;
  readonly error: string | null;
};

const INITIAL_STATE: UseShopRateModalToolState = {
  schema: null,
  calculator: null,
  zodSchema: null,
  loading: false,
  error: null,
};

async function loadShopRateSchema(): Promise<GeneratedToolSchema> {
  try {
    const response = await fetch(SHOP_RATE_SCHEMA_PUBLIC_PATH, { cache: "no-store" });
    if (response.ok) {
      return (await response.json()) as GeneratedToolSchema;
    }
  } catch {
    // Fall back to bundled schema when public fetch is unavailable.
  }

  return shopRateSchemaFallback as GeneratedToolSchema;
}

async function resolveShopRateCalculator(): Promise<GeneratedCalculatorModule> {
  const generated = await loadGeneratedCalculator(SHOP_RATE_MODAL_SLUG);
  return generated ?? SHOP_RATE_MODAL_CALCULATOR;
}

export function useShopRateModalTool(isOpen: boolean): UseShopRateModalToolState {
  const [state, setState] = useState<UseShopRateModalToolState>(INITIAL_STATE);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    async function loadTool() {
      setState({
        schema: null,
        calculator: null,
        zodSchema: null,
        loading: true,
        error: null,
      });

      try {
        const [schema, calculator] = await Promise.all([
          loadShopRateSchema(),
          resolveShopRateCalculator(),
        ]);

        if (cancelled) {
          return;
        }

        setState({
          schema,
          calculator,
          zodSchema: calculator.inputSchema,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Shop rate calculator could not be loaded.";
        setState({
          schema: null,
          calculator: null,
          zodSchema: null,
          loading: false,
          error: message,
        });
      }
    }

    void loadTool();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  return state;
}
