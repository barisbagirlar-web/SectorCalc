import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import type { GeneratedToolInputType } from "@/lib/generated-tools/types";
import { getAllTools } from "@/lib/tools/all-tools-data";
import {
  buildZodSchema,
  describeExpectedInputFormat,
  findUnknownInputKeys,
  formatZodValidationErrors,
  type BuildZodSchemaOptions,
  type SchemaInputField,
  type ValidationFieldError,
} from "@/lib/validation/calculator-validator-schema";

export type { SchemaInputField, ValidationFieldError, BuildZodSchemaOptions };
export {
  buildZodSchema,
  describeExpectedInputFormat,
  findUnknownInputKeys,
  formatZodValidationErrors,
};

export type ToolValidationSchema = {
  readonly toolName: string;
  readonly inputs: readonly SchemaInputField[];
};

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");
const validatorCache = new Map<string, z.ZodObject<Record<string, z.ZodTypeAny>>>();

const API_VALIDATOR_OPTIONS: BuildZodSchemaOptions = {
  strict: true,
  useDefaults: false,
};

function validatorCacheKey(slug: string, options?: BuildZodSchemaOptions): string {
  if (options?.strict && options.useDefaults === false) {
    return `${slug}:api`;
  }
  return slug;
}

function buildValidatorForSchema(
  schema: ToolValidationSchema,
  options?: BuildZodSchemaOptions,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  return buildZodSchema(schema.inputs, options);
}

function readToolValidationSchema(slug: string): ToolValidationSchema | null {
  const schemaPath = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const inputs = Array.isArray(record.inputs) ? record.inputs : [];
    const normalizedInputs = inputs
      .map((entry): SchemaInputField | null => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          return null;
        }
        const input = entry as Record<string, unknown>;
        const id = typeof input.id === "string" ? input.id.trim() : "";
        const type = typeof input.type === "string" ? input.type.trim() : "";
        if (!id || !type) {
          return null;
        }

        return {
          id,
          label: typeof input.label === "string" ? input.label : id,
          type: type as GeneratedToolInputType,
          unit: typeof input.unit === "string" ? input.unit : "",
          default: input.default as SchemaInputField["default"],
          min: typeof input.min === "number" ? input.min : null,
          max: typeof input.max === "number" ? input.max : null,
          options: Array.isArray(input.options)
            ? input.options.filter((option): option is string => typeof option === "string")
            : undefined,
          required: input.required === false ? false : undefined,
        };
      })
      .filter((entry): entry is SchemaInputField => entry !== null);

    return {
      toolName:
        (typeof record.toolName === "string" && record.toolName) ||
        (typeof record.slug === "string" && record.slug) ||
        slug,
      inputs: normalizedInputs,
    };
  } catch {
    return null;
  }
}

export function getValidatorForTool(
  slug: string,
  options?: BuildZodSchemaOptions,
): z.ZodObject<Record<string, z.ZodTypeAny>> | null {
  const cacheKey = validatorCacheKey(slug, options);
  const cached = validatorCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const schema = readToolValidationSchema(slug);
  if (!schema || schema.inputs.length === 0) {
    return null;
  }

  const validator = buildValidatorForSchema(schema, options);
  validatorCache.set(cacheKey, validator);
  return validator;
}

/** Strict validator for /api-public — no defaults, rejects unknown keys. */
export function getApiValidatorForTool(
  slug: string,
): z.ZodObject<Record<string, z.ZodTypeAny>> | null {
  return getValidatorForTool(slug, API_VALIDATOR_OPTIONS);
}

export function getToolValidationSchema(slug: string): ToolValidationSchema | null {
  return readToolValidationSchema(slug);
}

export function isKnownCalculatorSlug(slug: string): boolean {
  if (readToolValidationSchema(slug)) {
    return true;
  }

  return getAllTools("en").some((tool) => tool.slug === slug);
}
