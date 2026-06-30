import { z } from "zod";
import type { GeneratedToolInput, GeneratedToolInputType } from "@/lib/features/generated-tools/types";

export type SchemaInputField = Pick<
  GeneratedToolInput,
  "id" | "label" | "type" | "unit" | "default" | "min" | "max" | "options"
> & {
  readonly required?: boolean;
};

export type ValidationFieldError = {
  readonly field: string;
  readonly message: string;
};

export type BuildZodSchemaOptions = {
  /** Reject keys that are not declared in the tool schema (AI hallucination guard). */
  readonly strict?: boolean;
  /** Apply schema defaults for missing fields (UI forms). Off for public API. */
  readonly useDefaults?: boolean;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function buildNumberValidator(
  input: SchemaInputField,
  useDefaults: boolean,
): z.ZodTypeAny {
  let schema: z.ZodNumber = z.coerce.number({
    message: `${input.id} must be a finite number`,
  });

  if (isFiniteNumber(input.min)) {
    schema = schema.min(input.min);
  }
  if (isFiniteNumber(input.max)) {
    schema = schema.max(input.max);
  }
  if (
    useDefaults &&
    typeof input.default === "number" &&
    Number.isFinite(input.default)
  ) {
    return schema.default(input.default);
  }

  return schema;
}

function buildBooleanValidator(
  input: SchemaInputField,
  useDefaults: boolean,
): z.ZodTypeAny {
  let validator: z.ZodTypeAny = z.coerce.boolean();
  if (useDefaults && typeof input.default === "boolean") {
    validator = validator.default(input.default);
  }
  return validator;
}

function buildSelectValidator(
  input: SchemaInputField,
  useDefaults: boolean,
): z.ZodTypeAny {
  const options = input.options?.filter((option): option is string => typeof option === "string");
  if (!options || options.length === 0) {
    return z.string().min(1, `${input.id} must be a non-empty string`);
  }

  const tuple = options as [string, ...string[]];
  let validator: z.ZodTypeAny = z.enum(tuple, {
    message: `${input.id} must be one of: ${options.join(", ")}`,
  });

  if (useDefaults && typeof input.default === "string" && options.includes(input.default)) {
    validator = validator.default(input.default);
  }

  return validator;
}

export function findUnknownInputKeys(
  inputs: Record<string, unknown>,
  allowedIds: readonly string[],
): string[] {
  const allowed = new Set(allowedIds);
  return Object.keys(inputs).filter((key) => !allowed.has(key));
}

export function buildZodSchema(
  inputs: readonly SchemaInputField[],
  options: BuildZodSchemaOptions = {},
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const strict = options.strict ?? false;
  const useDefaults = options.useDefaults ?? true;
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const input of inputs) {
    let validator: z.ZodTypeAny;

    switch (input.type as GeneratedToolInputType) {
      case "number":
        validator = buildNumberValidator(input, useDefaults);
        break;
      case "boolean":
        validator = buildBooleanValidator(input, useDefaults);
        break;
      case "select":
        validator = buildSelectValidator(input, useDefaults);
        break;
      default:
        validator = z.unknown();
    }

    if (input.required === false) {
      validator = validator.optional();
    }

    shape[input.id] = validator;
  }

  const objectSchema = z.object(shape);
  return strict ? objectSchema.strict() : objectSchema;
}

export function formatZodValidationErrors(error: z.ZodError): ValidationFieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "inputs",
    message: issue.message,
  }));
}

export function describeExpectedInputFormat(
  inputs: readonly SchemaInputField[],
): Record<string, string> {
  return Object.fromEntries(
    inputs.map((input) => [
      input.id,
      input.type === "select" && input.options?.length
        ? `select (${input.options.join(" | ")})`
        : input.type,
    ]),
  );
}
