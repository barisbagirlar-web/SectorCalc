import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import {
  buildTestInputFromSchema,
  validateCalculatorRuntimeResult,
} from "@/lib/features/generated-tools/runtime-validate-calculator";
import type { RuntimeValidationResult } from "@/lib/features/generated-tools/runtime-validate-calculator";
import { generatedCalculateExport } from "@/lib/features/generated-tools/export-names";

export type { RuntimeValidationResult };

/**
 * Loads a generated calculator module at runtime using createRequire.
 * Intentionally separated from runtime-validate-calculator.ts
 * to keep createRequire away from the API route's import chain
 * (webpack cannot statically trace dynamic require arguments).
 * Only scripts and audit tools should import this module.
 */
export async function runtimeValidateCalculator(
  slug: string,
  options?: {
    readonly generatedDir?: string;
    readonly schema?: Record<string, unknown>;
  },
): Promise<RuntimeValidationResult> {
  const generatedDir = options?.generatedDir ?? path.join(process.cwd(), "generated");
  const modulePath = path.join(generatedDir, `${slug}.ts`);

  if (!fs.existsSync(modulePath)) {
    return { status: "FAIL", error: "Generated file not found" };
  }

  let schema = options?.schema;
  if (!schema) {
    const firstChar = slug.charAt(0).toLowerCase();
    const dirName = /[a-z0-9]/.test(firstChar) ? firstChar : 'other';
    const schemaPath = path.join(process.cwd(), "generated/schemas", dirName, `${slug}-schema.json`);
    if (!fs.existsSync(schemaPath)) {
      return { status: "FAIL", error: "Schema file not found" };
    }
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
  }

  const testInput = buildTestInputFromSchema(schema);

  try {
    const requireFn = createRequire(modulePath);
    const mod = requireFn(modulePath) as Record<string, unknown>;
    const calculateKey = generatedCalculateExport(slug);
    const calculateFn = mod[calculateKey] ?? mod.calculate;

    if (typeof calculateFn !== "function") {
      return { status: "FAIL", error: `Calculate function not found (${calculateKey})` };
    }

    const result = calculateFn(testInput);
    return validateCalculatorRuntimeResult(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "FAIL", error: message || "Runtime error" };
  }
}
