"use client";

import { DynamicToolForm, type DynamicToolFormProps } from "@/components/tools/DynamicToolForm";

export type UniversalDynamicToolTier = "auto" | "free" | "premium";

export type UniversalDynamicToolFormProps = DynamicToolFormProps & {
  readonly tier?: UniversalDynamicToolTier;
};

export function UniversalDynamicToolForm({
  tier = "auto",
  layout = "auto",
  schema,
  slug,
  ...props
}: UniversalDynamicToolFormProps) {
  const resolvedTier =
    tier === "auto" ? (schema.premiumRequired === true ? "premium" : "free") : tier;

  return (
    <section
      className="sc-universal-dtf-shell"
      data-tool-slug={slug}
      data-tool-tier={resolvedTier}
      data-schema-driven="true"
      data-formula-engine="existing-runtime"
    >
      <DynamicToolForm
        {...props}
        slug={slug}
        schema={schema}
        layout={layout}
      />
    </section>
  );
}
