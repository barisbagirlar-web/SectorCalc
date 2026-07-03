"use client";

// Client wrapper that bridges GeneratedToolSchema to SuperV4Schema
// and renders UniversalIndustrialDecisionForm

import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";
import { adaptLegacyJsonToPremiumSchema } from "@/lib/features/dynamic-form-v2/legacy-to-premium-adapter";
import { UniversalIndustrialDecisionForm, buildSuperV4SchemaFromPremiumSchema } from "@/sectorcalc/pro-form";

interface GeneratedToolFormClientProps {
  schema: GeneratedToolSchema;
  slug: string;
}

export function GeneratedToolFormClient({ schema, slug }: GeneratedToolFormClientProps) {
  const premiumSchema = adaptLegacyJsonToPremiumSchema(schema, slug);
  const superV4Schema = buildSuperV4SchemaFromPremiumSchema(premiumSchema as any);
  return <UniversalIndustrialDecisionForm schema={superV4Schema} />;
}
