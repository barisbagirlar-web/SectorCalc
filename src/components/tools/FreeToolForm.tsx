"use client";

import { DynamicToolFormWrapper } from "@/lib/features/dynamic-form-v2";
import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";

// Re-export types consumed by FreeTrafficToolPage (ts-nocheck)
export type PremiumInputDef = {
  key: string;
  label: string;
  unit: string;
  type: string;
  required: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: readonly string[];
};

export type PremiumResultRow = {
  label: string;
  value: string;
  unit?: string;
  severity?: "ok" | "warn" | "crit";
};

export type FreeToolFormProps = {
  readonly slug: string;
  readonly schema: GeneratedToolSchema;
  readonly toolTitle?: string;
  readonly primaryOutputKey?: string;
  readonly onSubmit?: (values: Record<string, unknown>) => void;
  readonly result?: unknown;
  readonly loading?: boolean;
  readonly disabled?: boolean;
};

export function FreeToolForm({ slug, schema }: FreeToolFormProps) {
  // If schema is available, use DynamicToolFormWrapper
  if (schema) {
    return <DynamicToolFormWrapper schema={schema} slug={slug} showMasthead={false} />;
  }
  // Fallback for FreeTrafficToolPage (which uses @ts-nocheck with different props)
  return (
    <div className="sc-premium-dtf-container" data-testid="free-tool-form" data-tool-slug={slug}>
      Fallback form - schema not provided.
    </div>
  );
}
