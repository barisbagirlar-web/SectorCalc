"use client";

import { SmartFormSection } from "@/components/smart-form/SmartFormSection";
import { SmartInput } from "@/components/smart-form/SmartInput";
import type { SmartFormSectionConfig } from "@/lib/features/smart-form/types";

export type SmartFormFieldsRendererProps = {
  readonly sections: readonly SmartFormSectionConfig[];
  readonly values: Record<string, number | string>;
  readonly errors: Readonly<Record<string, string>>;
  readonly onChange: (key: string, value: number | string) => void;
  readonly inputIdPrefix?: string;
  readonly collapsible?: boolean;
};

export function SmartFormFieldsRenderer({
  sections,
  values,
  errors,
  onChange,
  inputIdPrefix = "eng-smart-form",
  collapsible = false,
}: SmartFormFieldsRendererProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <SmartFormSection
          key={section.id}
          title={section.title}
          description={section.description}
          collapsible={collapsible}
          defaultExpanded={!collapsible}
          status={section.inputs.some((input) => errors[input.key]) ? "error" : "neutral"}
        >
          <div className={`grid gap-4 ${
            section.inputs.length === 1
              ? "grid-cols-1"
              : section.inputs.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : section.inputs.length === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : section.inputs.length === 4
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          }`}>
            {section.inputs.map((input) => (
              <SmartInput
                key={input.key}
                input={input}
                value={values[input.key] ?? (input.type === "select" ? "" : "")}
                error={errors[input.key]}
                onChange={onChange}
                inputIdPrefix={inputIdPrefix}
              />
            ))}
          </div>
        </SmartFormSection>
      ))}
    </div>
  );
}
