import type { PremiumCalculatorSchema, PremiumInputSchema, PremiumOutputSchema, PremiumThresholdSchema, PremiumReportTemplate, SectorAssumptionPack } from "@/lib/features/premium-schema/premium-calculator-schema";
import type { GeneratedToolSchema, GeneratedToolInput } from "@/lib/features/generated-tools/types";

export function adaptLegacyJsonToPremiumSchema(legacy: GeneratedToolSchema, slug: string): PremiumCalculatorSchema {
  // Extract formulas
  const legacyFormulas: Record<string, string> = {};
  if (legacy.formulas) {
    for (const [k, v] of Object.entries(legacy.formulas)) {
      if (typeof v === "string") {
        legacyFormulas[k] = v;
      }
    }
  }

  // Map inputs
  const inputs: PremiumInputSchema[] = legacy.inputs.map((inp: GeneratedToolInput) => {
    let type: "number" | "select" | "slider" | "boolean" = "number";
    if (inp.type === "boolean") type = "boolean";
    else if (inp.type === "select") type = "select";

    const options = inp.options?.map(opt => ({
      value: typeof opt === 'string' ? opt : (opt as any).value,
      label: typeof opt === 'string' ? opt : ((opt as any).label || (opt as any).value)
    }));

    return {
      id: inp.id,
      label: inp.label,
      label_i18n: inp.label_i18n,
      type,
      unit: inp.unit || "",
      placeholder: (inp as any).placeholder,
      group: inp.group,
      required: true,
      smartDefault: inp.default,
      array: (inp as any).array,
      options,
      validation: {
        min: typeof inp.min === 'number' ? inp.min : undefined,
        max: typeof inp.max === 'number' ? inp.max : undefined,
      },
      helper: inp.businessContext,
      helper_i18n: inp.businessContext_i18n,
    };
  });

  // Map outputs
  const outputs: PremiumOutputSchema[] = [];
  const primaryKey = typeof legacy.outputs?.primary === 'string' ? legacy.outputs.primary : "result";

  if (legacy.outputs && legacy.outputs.breakdown) {
    for (const [key, label] of Object.entries(legacy.outputs.breakdown)) {
      outputs.push({
        id: key,
        label: typeof label === 'string' ? label : key,
        unit: legacy.outputs.breakdownUnits?.[key] || "",
        format: "number",
        isBigNumber: key === primaryKey,
      });
    }
  }

  // Ensure primary exists
  if (!outputs.find(o => o.id === primaryKey)) {
    outputs.push({
      id: primaryKey,
      label: "Result",
      unit: "",
      format: "number",
      isBigNumber: true,
    });
  }

  // Default thresholds
  const thresholds: PremiumThresholdSchema[] = [];

  // Default report template
  const reportTemplate: PremiumReportTemplate = {
    title: legacy.toolName,
    sections: ["executive_summary", "loss_breakdown"],
    exportFormats: ["pdf"],
  };

  const assumptions: SectorAssumptionPack = {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Calculated from dynamically generated legacy schema."],
  };

  return {
    id: slug,
    name: legacy.toolName,
    sectorSlug: "general",
    category: "revenue_margin" as any, // fallback
    painStatement: "Generated calculation report.",
    inputs,
    outputs,
    thresholds,
    reportTemplate,
    assumptions,
    legacyFormulas,
  };
}
