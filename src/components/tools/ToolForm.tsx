"use client";

import { ToolInputField } from "@/components/tools/ToolInputField";
import type { ToolInput } from "@/data/tool-schema";

interface ToolFormProps {
  inputs: ToolInput[];
  values: Record<string, number | string>;
  errors: Record<string, string>;
  onChange: (id: string, value: number | string) => void;
  onBlur: (id: string) => void;
  variant?: "underline" | "boxed";
}

export function ToolForm({
  inputs,
  values,
  errors,
  onChange,
  onBlur,
  variant = "boxed",
}: ToolFormProps) {
  return (
    <form
      className={`sc-industrial-form sc-ledger-panel sc-industrial-panel p-4 sm:p-5 sc-ledger-letterpress${variant === "underline" ? " sc-ledger-cetele-form" : ""}`}
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      {inputs.map((input) => (
        <ToolInputField
          key={input.id}
          input={input}
          value={values[input.id] ?? input.defaultValue}
          error={errors[input.id]}
          onChange={onChange}
          onBlur={onBlur}
          variant={variant}
        />
      ))}
    </form>
  );
}
