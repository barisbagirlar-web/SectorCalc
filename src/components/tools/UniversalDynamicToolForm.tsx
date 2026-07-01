"use client";

import { useMemo } from "react";
import { DynamicToolForm, type DynamicToolFormProps, type DynamicToolFormLayout } from "@/components/tools/DynamicToolForm";
import { buildZodSchema } from "@/lib/core/validation/calculator-validator-schema";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import type { z } from "zod";

export type UniversalDynamicToolTier = "auto" | "free" | "premium";

/**
 * UniversalDynamicToolForm accepts all DynamicToolFormProps but makes
 * `zodSchema` and `onSubmit` optional — when omitted it builds the zod
 * schema from `schema.inputs` and provides a no-op onSubmit so the form
 * handles calculation internally.
 */
export type UniversalDynamicToolFormProps = Omit<
  DynamicToolFormProps,
  "zodSchema" | "onSubmit"
> & {
  readonly zodSchema?: z.ZodTypeAny;
  readonly onSubmit?: (values: Record<string, unknown>) => void;
  readonly tier?: UniversalDynamicToolTier;
};

export function UniversalDynamicToolForm({
  tier = "auto",
  layout = "auto",
  schema,
  slug,
  zodSchema: zodSchemaProp,
  onSubmit: onSubmitProp,
  ...props
}: UniversalDynamicToolFormProps) {
  const resolvedTier =
    tier === "auto" ? (schema.premiumRequired === true ? "premium" : "free") : tier;

  const resolvedLayout: DynamicToolFormLayout =
    layout === "standard" ? "standard" : resolvedTier === "free" ? "standard" : "premium";

  const derivedZodSchema = useMemo(
    () => buildZodSchema(schema.inputs as never, { strict: false, useDefaults: true }),
    [schema.inputs],
  );

  const zodSchema = zodSchemaProp ?? derivedZodSchema;
  const onSubmit = onSubmitProp ?? (() => undefined);

  return (
    <section
      className="sc-universal-dtf-shell"
      data-tool-slug={slug}
      data-tool-tier={resolvedTier}
      data-universal-layout={resolvedLayout}
      data-schema-driven="true"
      data-formula-engine="existing-runtime"
    >
      <DynamicToolForm
        {...props}
        slug={slug}
        schema={schema}
        layout={resolvedLayout}
        zodSchema={zodSchema}
        onSubmit={onSubmit}
      />
    </section>
  );
}
