import type { RegionalSmartFormInputExtension } from "@/lib/regional/types";
import { buildRegionalSmartFormExtension, resolveRegionalCalculationContext } from "@/lib/regional/regional-engine";
import { isRegionalEngineCode } from "@/lib/regional/regions";

export function resolveSmartFormRegionalMetadata(options: { readonly fieldKey: string; readonly dimension: string; readonly fieldType: "number" | "currency" | "percent"; readonly locale?: string; readonly regionCode?: string; readonly toolSlug?: string }): RegionalSmartFormInputExtension {
  if (!options.locale) return {};
  const regionCode = options.regionCode && isRegionalEngineCode(options.regionCode) ? options.regionCode : undefined;
  const context = resolveRegionalCalculationContext({ locale: options.locale, regionCode, toolSlug: options.toolSlug });
  return buildRegionalSmartFormExtension({ fieldKey: options.fieldKey, dimension: options.dimension, context, fieldType: options.fieldType });
}
