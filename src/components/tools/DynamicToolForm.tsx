"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import type { z } from "zod";
import { DynamicToolFormField } from "@/components/tools/DynamicToolFormField";
import { buildGeneratedInputGroups } from "@/lib/generated-tools/input-groups";
import {
  buildInitialSelectedUnits,
  convertGeneratedFormValues,
} from "@/lib/generated-tools/unit-conversion";
import type { GeneratedToolInput, GeneratedToolSchema } from "@/lib/generated-tools/types";

export type DynamicToolFormProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly zodSchema: z.ZodTypeAny;
  readonly calculateLabel?: string;
  readonly onSubmit: (values: Record<string, unknown>) => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
};

function buildDefaultValues(
  schema: GeneratedToolSchema,
  zodSchema: z.ZodTypeAny,
): FieldValues {
  const parsed = zodSchema.safeParse({});
  if (parsed.success) {
    return parsed.data as Record<string, unknown>;
  }

  const fallback: FieldValues = {};
  for (const input of schema.inputs) {
    if (input.default !== undefined) {
      fallback[input.id] = input.default;
    } else if (input.type === "boolean") {
      fallback[input.id] = false;
    } else if (input.type === "select" && input.options?.[0]) {
      fallback[input.id] = input.options[0];
    } else {
      fallback[input.id] = "";
    }
  }
  return fallback;
}

export function DynamicToolForm({
  slug,
  schema,
  zodSchema,
  calculateLabel,
  onSubmit,
  disabled = false,
  loading = false,
}: DynamicToolFormProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool");
  const tGroups = useTranslations("generatedTool.inputGroups");
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});

  const defaultValues = useMemo(
    () => buildDefaultValues(schema, zodSchema),
    [schema, zodSchema],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    // zod v4 schema types differ from @hookform/resolvers expectations
    resolver: zodResolver(zodSchema as never),
    defaultValues,
    mode: "onBlur",
  });

  const inputById = useMemo(() => {
    const map = new Map<string, GeneratedToolInput>();
    for (const input of schema.inputs) {
      map.set(input.id, input);
    }
    return map;
  }, [schema.inputs]);

  const groups = useMemo(() => buildGeneratedInputGroups(schema.inputs), [schema.inputs]);

  useEffect(() => {
    setSelectedUnits(buildInitialSelectedUnits(schema.inputs, locale));
  }, [schema.inputs, locale]);

  const handleUnitChange = (inputId: string, unit: string) => {
    setSelectedUnits((current) => ({ ...current, [inputId]: unit }));
  };

  const handleFormSubmit: SubmitHandler<FieldValues> = (values) => {
    const converted = convertGeneratedFormValues(
      schema.inputs,
      values as Record<string, unknown>,
      selectedUnits,
    );
    onSubmit(converted);
  };

  const resolveGroupTitle = (groupId: string): string => {
    if (tGroups.has(groupId)) {
      return tGroups(groupId);
    }
    return tGroups("general");
  };

  const submitLabel = loading
    ? t("calculating")
    : (calculateLabel ?? t("calculate"));

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      noValidate
      data-calculation-form="true"
      data-testid="dynamic-tool-form"
      data-tool-slug={slug}
    >
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`${slug}-group-${group.id}`}>
          <h3
            id={`${slug}-group-${group.id}`}
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-body-charcoal"
          >
            {resolveGroupTitle(group.id)}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {group.inputIds.map((inputId) => {
              const input = inputById.get(inputId);
              if (!input) {
                return null;
              }
              return (
                <DynamicToolFormField
                  key={input.id}
                  slug={slug}
                  input={input}
                  control={control}
                  errors={errors}
                  inputIdPrefix={`generated-${slug}`}
                  selectedUnit={selectedUnits[input.id]}
                  onUnitChange={(unit) => handleUnitChange(input.id, unit)}
                />
              );
            })}
          </div>
        </section>
      ))}

      <div className="sc-industrial-form-actions">
        <button
          type="submit"
          disabled={disabled || loading}
          className="sc-ledger-cta-primary sc-cta-primary min-h-[44px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
