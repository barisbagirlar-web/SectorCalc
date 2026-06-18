"use client";

import type { GeneratedCalculatorModule } from "./types";
import { applyStandardCalculatorOverride } from "./standard-calculator-overrides";

type RawGeneratedModule = Record<string, unknown>;

/**
 * Resolve the expected calculate export name for a given slug.
 */
function resolveCalculateExport(slug: string): string {
  return `calculate_${slug.replace(/-/g, "_")}`;
}

/**
 * Resolve the expected input-schema export name for a given slug.
 */
function resolveSchemaExport(slug: string): string {
  const camel = slug
    .replace(/-/g, "_")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${camel}InputSchema`;
}

/**
 * Client-only generated calculator loader.
 *
 * Uses a direct dynamic import instead of the 269 KB server registry
 * (calculator-registry.ts), which eliminates the main‑bundle bloat from all
 * 3272 loader closures and their Webpack chunk references.
 *
 * On‑demand import produces a single small chunk per tool (~4–8 KB) that
 * is cached after the first page visit.
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

    const inputSchemaKey = resolveSchemaExport(slug);
    const calculateKey = resolveCalculateExport(slug);

    const inputSchema = mod[inputSchemaKey];
    const calculate = mod[calculateKey];

    if (!inputSchema || typeof calculate !== "function") {
      return null;
    }

    return {
      inputSchema: inputSchema as GeneratedCalculatorModule["inputSchema"],
      calculate: calculate as GeneratedCalculatorModule["calculate"],
    };
  } catch {
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
