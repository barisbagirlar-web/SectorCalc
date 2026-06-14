import type { GeneratedToolI18nText, GeneratedToolSchema } from "@/lib/generated-tools/types";
import {
  GENERATED_TOOL_I18N_LOCALES,
  normalizeGeneratedI18nText,
} from "@/lib/generated-tools/resolve-i18n-text";

export function isGeneratedI18nComplete(i18n: GeneratedToolI18nText | undefined): boolean {
  if (!i18n) {
    return false;
  }

  return GENERATED_TOOL_I18N_LOCALES.every((locale) => Boolean(i18n[locale]?.trim()));
}

export function inputNeedsI18nBackfill(input: GeneratedToolSchema["inputs"][number]): boolean {
  return (
    !isGeneratedI18nComplete(input.label_i18n) ||
    !isGeneratedI18nComplete(input.businessContext_i18n)
  );
}

export function schemaNeedsI18nBackfill(schema: GeneratedToolSchema): boolean {
  return schema.inputs.some(inputNeedsI18nBackfill);
}

export function countInputsNeedingI18nBackfill(schema: GeneratedToolSchema): number {
  return schema.inputs.filter(inputNeedsI18nBackfill).length;
}

export type SchemaI18nBackfillPatch = {
  readonly id: string;
  readonly label_i18n: GeneratedToolI18nText;
  readonly businessContext_i18n: GeneratedToolI18nText;
};

export function mergeSchemaI18nBackfill(
  schema: GeneratedToolSchema,
  patches: readonly SchemaI18nBackfillPatch[],
): GeneratedToolSchema {
  const patchById = new Map(patches.map((patch) => [patch.id, patch]));

  return {
    ...schema,
    inputs: schema.inputs.map((input) => {
      const patch = patchById.get(input.id);
      if (!patch) {
        return {
          ...input,
          label_i18n: normalizeGeneratedI18nText(input.label_i18n, input.label),
          businessContext_i18n: normalizeGeneratedI18nText(
            input.businessContext_i18n,
            input.businessContext,
          ),
        };
      }

      return {
        ...input,
        label_i18n: normalizeGeneratedI18nText(patch.label_i18n, input.label),
        businessContext_i18n: normalizeGeneratedI18nText(
          patch.businessContext_i18n,
          input.businessContext,
        ),
      };
    }),
  };
}

export function buildSchemaI18nBackfillPayload(
  schema: GeneratedToolSchema,
  options: { readonly force?: boolean } = {},
): {
  readonly toolName: string;
  readonly inputs: readonly {
    readonly id: string;
    readonly label: string;
    readonly businessContext: string;
  }[];
} {
  const pendingInputs = options.force
    ? schema.inputs
    : schema.inputs.filter(inputNeedsI18nBackfill);

  return {
    toolName: schema.toolName,
    inputs: pendingInputs.map((input) => ({
      id: input.id,
      label: input.label.trim(),
      businessContext: input.businessContext.trim(),
    })),
  };
}
