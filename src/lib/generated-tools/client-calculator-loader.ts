"use client";

import type { GeneratedCalculatorModule, GeneratedToolResult } from "./types";
import { applyStandardCalculatorOverride } from "./standard-calculator-overrides";
import { wrapWithTrustTrace } from "./trust-trace-wrapper";
import {
  generatedCalculateExport,
  generatedInputSchemaExport,
} from "./export-names";
import { createRuntimeFormulaGuard } from "./runtime-formula-guard";

type RawGeneratedModule = Record<string, unknown>;

/**
 * Client-only generated calculator loader.
 *
 * Uses a direct dynamic import instead of the 269 KB server registry
 * (calculator-registry.ts), which eliminates the main‑bundle bloat from all
 * 3272 loader closures and their Webpack chunk references.
 *
 * On‑demand import produces a single small chunk per tool (~4–8 KB) that
 * is cached after the first page visit.
 *
 * Every calculation result is automatically wrapped with a Trust Trace
 * verification hash for public result integrity verification.
 *
 * Export name resolution MUST use generatedCalculateExport / generatedInputSchemaExport
 * from export-names.ts — the same functions the code generator uses.
 * Do NOT reimplement slug-to-export-name logic here.
 */
export async function loadClientCalculator(
  slug: string,
): Promise<GeneratedCalculatorModule | null> {
  try {
    const mod = (await import(
      /* webpackChunkName: "calc-[request]" */
      /* webpackInclude: /\.ts$/ */
      `@generated/${slug}`
    )) as RawGeneratedModule;

    const inputSchemaKey = generatedInputSchemaExport(slug);
    const calculateKey = generatedCalculateExport(slug);

    const inputSchema = mod[inputSchemaKey];
    const calculate = mod[calculateKey];

    if (!inputSchema || typeof calculate !== "function") {
      return null;
    }

    // Wrap calculate: runtime guard (dev only) + Trust Trace (always)
    let guardedCalculate: (input: Record<string, unknown>) => GeneratedToolResult;

    if (process.env.NODE_ENV !== "production") {
      const schemaJson = (await import(
        /* webpackChunkName: "schema-[request]" */
        `@generated/schemas/${slug}-schema.json`
      )) as {
        inputs: Array<{ id: string }>;
        formulas: Record<string, string>;
      };

      const guard = createRuntimeFormulaGuard(
        slug,
        schemaJson.formulas,
        schemaJson.inputs.map((i) => i.id),
      );

      guardedCalculate = guard.wrapCalculate(
        calculate as (input: Record<string, unknown>) => unknown,
        slug,
      ) as (input: Record<string, unknown>) => GeneratedToolResult;
    } else {
      guardedCalculate = calculate as (input: Record<string, unknown>) => GeneratedToolResult;
    }

    const wrappedCalculate = (
      input: Record<string, unknown>,
    ): GeneratedToolResult => {
      const rawResult = guardedCalculate(input);
      return wrapWithTrustTrace(rawResult);
    };

    return {
      inputSchema: inputSchema as GeneratedCalculatorModule["inputSchema"],
      calculate: wrappedCalculate as GeneratedCalculatorModule["calculate"],
    };
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[CalculatorLoader] Dynamic import failed:`, e);
    }
    return null;
  }
}

/**
 * Client-side calculator loader with override support.
 * Mirrors the server-side loadGeneratedCalculator chain without the 269KB registry.
 */
export async function loadClientCalculatorWithOverride(
  slug: string,
): Promise<GeneratedCalculatorModule | null> {
  const mod = await loadClientCalculator(slug);
  if (!mod) return null;
  return applyStandardCalculatorOverride(slug, mod);
}
