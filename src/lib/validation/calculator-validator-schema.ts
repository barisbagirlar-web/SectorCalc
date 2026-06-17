import { z } from "zod";
import type { GeneratedToolInput, GeneratedToolInputType } from "@/lib/generated-tools/types";

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

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function buildNumberValidator(input: SchemaInputField): z.ZodTypeAny {
  let schema: z.ZodNumber = z.coerce.number({
    message: `${input.id} must be a finite number`,
  });

  if (isFiniteNumber(input.min)) {
    schema = schema.min(input.min);
  }
  if (isFiniteNumber(input.max)) {
    schema = schema.max(input.max);
  }
  if (typeof input.default === "number" && Number.isFinite(input.default)) {
    return schema.default(input.default);
  }

  return schema;
}

function buildBooleanValidator(input: SchemaInputField): z.ZodTypeAny {
  let validator: z.ZodTypeAny = z.coerce.boolean();
  if (typeof input.default === "boolean") {
    validator = validator.default(input.default);
  }
  return validator;
}

function buildSelectValidator(input: SchemaInputField): z.ZodTypeAny {
  const options = input.options?.filter((option): option is string => typeof option === "string");
  if (!options || options.length === 0) {
    return z.string().min(1, `${input.id} must be a non-empty string`);
  }

  const tuple = options as [string, ...string[]];
  let validator: z.ZodTypeAny = z.enum(tuple, {
    message: `${input.id} must be one of: ${options.join(", ")}`,
  });

  if (typeof input.default === "string" && options.includes(input.default)) {
    validator = validator.default(input.default);
  }

  return validator;
}

export function buildZodSchema(
  inputs: readonly SchemaInputField[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const input of inputs) {
    let validator: z.ZodTypeAny;

    switch (input.type as GeneratedToolInputType) {
      case "number":
        validator = buildNumberValidator(input);
        break;
      case "boolean":
        validator = buildBooleanValidator(input);
        break;
      case "select":
        validator = buildSelectValidator(input);
        break;
      default:
        validator = z.unknown();
    }

    if (input.required === false) {
      validator = validator.optional();
    }

    shape[input.id] = validator;
  }

  return z.object(shape);
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
