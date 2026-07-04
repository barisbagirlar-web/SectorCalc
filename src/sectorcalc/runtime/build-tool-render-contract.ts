import "server-only";

import {
  formatDisplayKey,
  getDisplayCategoryLabel,
  getDisplayOperationLabel,
  getDisplayToolName,
  isRawCategoryKeyLike,
} from "./display-labels";
import { hasTurkishToken } from "@/sectorcalc/governance/forbidden-locale-token-detector";

export type ToolSource =
  | "free_v531"
  | "pro_v531"
  | "industrial_free"
  | "legacy_generated"
  | "generated_free";

export type AccessTier = "FREE" | "PRO";

export type ToolRenderContract = {
  toolKey: string;
  slug: string;
  toolName: string;
  categoryLabel: string;
  operationLabel: string;
  source: ToolSource;
  accessTier: AccessTier;
  route: string;
  schemaVersion: string;
  formulaVersion: string;
  schemaForForm: Record<string, unknown>;
};

type BuildInput = {
  source: ToolSource;
  accessTier: AccessTier;
  slug: string;
  route: string;
  schema: unknown;
};

type BuildResult =
  | { ok: true; contract: ToolRenderContract }
  | {
      ok: false;
      reason: string;
      detail: string;
      slug: string;
      source: ToolSource;
    };

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function readArray(obj: Record<string, unknown>, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = obj[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function stringifyPublicSurface(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return "";
  }
}

function ensureNoActiveTurkish(schema: Record<string, unknown>): string | null {
  const serialized = stringifyPublicSurface(schema);
  const result = hasTurkishToken(serialized);
  if (result) {
    return `Turkish token detected in active public schema: ${result}`;
  }
  return null;
}

function makeSafeV531LikeSchema(input: {
  schema: Record<string, unknown>;
  slug: string;
  toolKey: string;
  toolName: string;
  categoryLabel: string;
  operationLabel: string;
}): Record<string, unknown> {
  const { schema, slug, toolKey, toolName, categoryLabel, operationLabel } = input;

  const inputs = readArray(schema, ["inputs", "fields", "parameters"]);
  const outputs = readArray(schema, ["outputs", "results", "result_fields"]);

  return {
    ...schema,

    tool_key: toolKey,
    toolKey,
    slug,

    tool_name: toolName,
    toolName,

    category: categoryLabel,
    category_label: categoryLabel,

    primary_operation: operationLabel,

    inputs,
    normalized_inputs: readArray(schema, ["normalized_inputs", "normalizedInputs"]),
    outputs,

    form_runtime_binding:
      asRecord(schema.form_runtime_binding) ??
      asRecord(schema.formRuntimeBinding) ??
      {
        renderer: "UniversalIndustrialDecisionForm",
        client_formula_execution: "FORBIDDEN",
        server_execution_required: true,
        execute_response_contract: {
          redaction_status: "PUBLIC_SAFE_REDACTED",
        },
      },

    ui_contract:
      asRecord(schema.ui_contract) ??
      asRecord(schema.uiContract) ??
      {
        target_renderer: "UniversalIndustrialDecisionForm",
      },

    metadata:
      asRecord(schema.metadata) ??
      {
        schema_version: "legacy-generated-normalized",
        formula_version: "legacy-generated",
      },
  };
}

export function buildToolRenderContract(input: BuildInput): BuildResult {
  const schema = asRecord(input.schema);

  if (!schema) {
    return {
      ok: false,
      reason: "SCHEMA_NOT_OBJECT",
      detail: "Resolved schema is not an object.",
      slug: input.slug,
      source: input.source,
    };
  }

  const turkishProblem = ensureNoActiveTurkish(schema);
  if (turkishProblem) {
    return {
      ok: false,
      reason: "ACTIVE_SCHEMA_TURKISH_BLOCKED",
      detail: turkishProblem,
      slug: input.slug,
      source: input.source,
    };
  }

  const schemaToolKey = readString(schema, [
    "tool_key",
    "toolKey",
    "slug",
    "id",
  ]);

  const toolKey = schemaToolKey || input.slug;

  if (toolKey !== input.slug) {
    return {
      ok: false,
      reason: "TOOL_IDENTITY_MISMATCH",
      detail: `Route slug "${input.slug}" does not match schema tool key "${toolKey}".`,
      slug: input.slug,
      source: input.source,
    };
  }

  const toolName = getDisplayToolName(schema, input.slug);
  const categoryLabel = getDisplayCategoryLabel(schema);
  const operationLabel = getDisplayOperationLabel(schema);

  if (!toolName || toolName === input.slug) {
    return {
      ok: false,
      reason: "TOOL_NAME_INVALID",
      detail: "Tool name is missing or resolves to raw slug.",
      slug: input.slug,
      source: input.source,
    };
  }

  if (!categoryLabel || isRawCategoryKeyLike(categoryLabel)) {
    return {
      ok: false,
      reason: "CATEGORY_LABEL_INVALID",
      detail: `Category label is missing or raw: ${categoryLabel}`,
      slug: input.slug,
      source: input.source,
    };
  }

  const schemaVersion =
    readString(schema, ["schema_version", "schemaVersion"]) ||
    readString(asRecord(schema.metadata) ?? {}, ["schema_version", "schemaVersion"]) ||
    "unknown";

  const formulaVersion =
    readString(schema, ["formula_version", "formulaVersion"]) ||
    readString(asRecord(schema.metadata) ?? {}, ["formula_version", "formulaVersion"]) ||
    "unknown";

  const schemaForForm = makeSafeV531LikeSchema({
    schema,
    slug: input.slug,
    toolKey,
    toolName,
    categoryLabel,
    operationLabel,
  });

  const inputs = readArray(schemaForForm, ["inputs"]);
  const outputs = readArray(schemaForForm, ["outputs"]);

  if (!Array.isArray(inputs)) {
    return {
      ok: false,
      reason: "INPUTS_INVALID",
      detail: "inputs must be an array.",
      slug: input.slug,
      source: input.source,
    };
  }

  if (!Array.isArray(outputs)) {
    return {
      ok: false,
      reason: "OUTPUTS_INVALID",
      detail: "outputs must be an array.",
      slug: input.slug,
      source: input.source,
    };
  }

  return {
    ok: true,
    contract: {
      toolKey,
      slug: input.slug,
      toolName: formatDisplayKey(toolName),
      categoryLabel,
      operationLabel,
      source: input.source,
      accessTier: input.accessTier,
      route: input.route,
      schemaVersion,
      formulaVersion,
      schemaForForm,
    },
  };
}
