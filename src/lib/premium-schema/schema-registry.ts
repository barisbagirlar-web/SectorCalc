import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import { THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA } from "@/lib/premium-schema/schemas/3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator";
import { THREE_B_PRINTING_BATCH_NESTING_SCHEMA } from "@/lib/premium-schema/schemas/3b-baski-parti-optimizasyonu-ve-yuvalama-calculator";
import { THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA } from "@/lib/premium-schema/schemas/3b-baski-vs-talasli-imalat-basabas-noktasi-calculator";
import { FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator";
import { SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/7-israf-muda-avcisi-parasal-karsilik-calculator";

/** Premium 152 batch 1 — schema-backed calculators. */
export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA,
  FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA,
  THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA,
  THREE_B_PRINTING_BATCH_NESTING_SCHEMA,
  THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA,
];

export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {
  "7-israf-muda-avcisi-parasal-karsilik-calculator":
    "7-israf-muda-avcisi-parasal-karsilik-calculator",
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator":
    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator":
    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator":
    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator":
    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator",
};

export function listPremiumSchemaIds(): readonly string[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((schema) => schema.id);
}

export function getPremiumCalculatorSchema(slug: string): PremiumCalculatorSchema | undefined {
  const normalized = slug.trim();
  return PREMIUM_CALCULATOR_SCHEMAS.find(
    (schema) => schema.id === normalized || schema.legacyPaidSlug === normalized,
  );
}

export function getPremiumSchemaForPaidSlug(paidSlug: string): PremiumCalculatorSchema | undefined {
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[paidSlug.trim()];
  if (!schemaId) {
    return undefined;
  }
  return getPremiumCalculatorSchema(schemaId);
}
