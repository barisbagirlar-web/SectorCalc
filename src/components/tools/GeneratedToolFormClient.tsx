"use client";

import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import { UniversalIndustrialDecisionForm, generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form";

interface GeneratedToolFormClientProps {
  schema: GeneratedToolSchema;
  slug: string;
}

export function GeneratedToolFormClient({ schema, slug }: GeneratedToolFormClientProps) {
  const superV4Schema = generatedToolSchemaToSuperV4Schema(schema, slug);
  return <UniversalIndustrialDecisionForm schema={superV4Schema} />;
}
