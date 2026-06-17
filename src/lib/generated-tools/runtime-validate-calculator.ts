import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { generatedCalculateExport } from "@/lib/generated-tools/export-names";

export type RuntimeValidationStatus = "PASS" | "FAIL";

export type RuntimeValidationResult = {
  readonly status: RuntimeValidationStatus;
  readonly error?: string;
};

type SchemaInput = Readonly<{
  readonly id?: unknown;
  readonly type?: unknown;
  readonly default?: unknown;
  readonly options?: unknown;
}>;

export function buildTestInputFromSchema(schema: Record<string, unknown>): Record<string, unknown> {
  const inputs = Array.isArray(schema.inputs) ? (schema.inputs as SchemaInput[]) : [];
  const testInput: Record<string, unknown> = {};

  for (const input of inputs) {
    const id = typeof input.id === "string" ? input.id.trim() : "";
    if (!id) {
      continue;
    }

    const type = typeof input.type === "string" ? input.type : "number";
    if (type === "number") {
      const defaultValue = input.default;
      testInput[id] =
        typeof defaultValue === "number" && Number.isFinite(defaultValue) ? defaultValue : 1;
      continue;
    }

    if (type === "boolean") {
      testInput[id] = typeof input.default === "boolean" ? input.default : false;
      continue;
    }

    if (type === "select") {
      const options = input.options;
      if (Array.isArray(options) && options.length > 0) {
        const first = options[0];
        testInput[id] = typeof first === "string" ? first : String(first);
      } else {
        testInput[id] = typeof input.default === "string" ? input.default : "";
      }
      continue;
    }

    testInput[id] = input.default ?? "";
  }

  return testInput;
}

export function validateCalculatorRuntimeResult(result: unknown): RuntimeValidationResult {
  if (result === undefined || result === null) {
    return { status: "FAIL", error: "Result is undefined or null" };
  }

  if (typeof result === "number") {
    return Number.isFinite(result)
      ? { status: "PASS" }
      : { status: "FAIL", error: "Result is NaN or Infinity" };
  }

  if (typeof result !== "object") {
    return { status: "FAIL", error: `Unexpected result type: ${typeof result}` };
  }

  const record = result as Record<string, unknown>;
  const primary = record.totalWasteCost ?? record.primary;
  if (primary === undefined) {
    return { status: "FAIL", error: "Primary output (totalWasteCost) is missing" };
  }

  if (typeof primary === "number" && !Number.isFinite(primary)) {
    return { status: "FAIL", error: "Primary output is NaN or Infinity" };
  }

  return { status: "PASS" };
}

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
    const schemaPath = path.join(process.cwd(), "generated/schemas", `${slug}-schema.json`);
    if (!fs.existsSync(schemaPath)) {
      return { status: "FAIL", error: "Schema file not found" };
    }
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
  }

  const testInput = buildTestInputFromSchema(schema);

  try {
    const moduleUrl = pathToFileURL(modulePath).href;
    const mod = (await import(moduleUrl)) as Record<string, unknown>;
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
