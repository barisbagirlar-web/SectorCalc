import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./activation-paths.mjs";
import { toPascalCase } from "./premium-backfill-factory-lib.mjs";

const SCHEMAS_DIR = path.join(ROOT, "src/lib/premium-schema/schemas");
const SCHEMA_REGISTRY_FILE = path.join(ROOT, "src/lib/premium-schema/schema-registry.ts");

function quoteString(value) {
  return JSON.stringify(value);
}

function inferCategory(slug) {
  if (/oee|availability|downtime/i.test(slug)) return "oee";
  if (/energy|kwh|compressor|boiler|steam/i.test(slug)) return "energy";
  if (/scrap|waste|fire|muda/i.test(slug)) return "scrap";
  if (/route|logistics|freight|fuel|trip/i.test(slug)) return "route";
  if (/time|hour|labor|mesai/i.test(slug)) return "time";
  if (/carbon|cbam/i.test(slug)) return "carbon";
  return "cost";
}

function mapInputType(type) {
  if (type === "percent") return "number";
  if (type === "currency") return "number";
  if (type === "integer") return "number";
  return "number";
}

function slugToSchemaExport(slug) {
  const pascal = toPascalCase(slug);
  const base = /^[A-Za-z_]/.test(pascal) ? pascal : `Slug${pascal}`;
  return `${base}_SCHEMA`;
}

function resolveToolTitle(toolMeta, slug) {
  const title = toolMeta.title ?? slug;
  if (typeof title === "string") return title;
  if (title && typeof title === "object" && typeof title.en === "string") return title.en;
  return slugToTitle(slug);
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildSchemaDraftFromP7Response(response, toolMeta = {}) {
  const slug = response.slug;
  const inputs = (response.inputs ?? []).slice(0, 6).map((input) => ({
    id: input.key,
    label: input.labelEn ?? input.key,
    type: mapInputType(input.type ?? "number"),
    unit: input.unit ?? "",
    required: input.required !== false,
    smartDefault: typeof input.defaultValue === "number" ? input.defaultValue : 1,
    validation: {
      min: typeof input.min === "number" ? input.min : 0,
      max: typeof input.max === "number" ? input.max : undefined,
      step: input.type === "percent" ? 0.1 : undefined,
    },
    helper: input.businessRule ?? "",
    expertMeaning: input.labelEn ?? input.key,
  }));

  if (inputs.length < 3) {
    throw new Error(`insufficient_inputs:${inputs.length}`);
  }

  const [a, b, c] = inputs;
  const formulaPipeline =
    inputs.length >= 3
      ? [
          {
            formulaId: "cost.total_exposure",
            inputMap: { a: a.id, b: b.id, c: c.id },
            outputId: "totalExposure",
          },
          {
            formulaId: "benchmark.variance_percent",
            inputMap: { actual: a.id, target: b.id },
            outputId: "variancePercent",
          },
        ]
      : [
          {
            formulaId: "cost.sum2",
            inputMap: { a: a.id, b: b.id },
            outputId: "totalExposure",
          },
        ];

  const p7Outputs = response.outputs ?? [];
  const outputs = [
    {
      id: "totalExposure",
      label: p7Outputs[0]?.labelEn ?? "Total exposure",
      unit: p7Outputs[0]?.unit ?? "USD",
      format: p7Outputs[0]?.unit === "%" ? "percentage" : "currency",
      isBigNumber: true,
    },
    {
      id: formulaPipeline.length > 1 ? "variancePercent" : "totalExposure",
      label: p7Outputs[1]?.labelEn ?? "Variance percent",
      unit: "%",
      format: "percentage",
    },
  ];

  return {
    id: slug,
    name: resolveToolTitle(toolMeta, slug),
    sectorSlug: toolMeta.category ?? "general-industrial",
    category: inferCategory(slug),
    painStatement:
      response.formulaMethod?.methodBasis ??
      `Quantify operational exposure for ${slug.replace(/-/g, " ")}.`,
    inputs,
    formulaPipeline,
    outputs,
    thresholds: [
      {
        fieldId: "totalExposure",
        warning: 1,
        critical: 3,
        direction: "higher_is_bad",
        warningMessage: "Exposure is entering warning band — review drivers.",
        criticalMessage: "Exposure is critical — immediate operational review required.",
      },
    ],
    reportTemplate: {
      title: `${toolMeta.title ?? slug} Decision Report`,
      sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
      exportFormats: ["pdf", "csv"],
    },
    assumptions: {
      hiddenLossMultiplier: 1.05,
      volatilityPercent: 8,
      targetMarginPercent: 15,
      assumptionNotes: (response.assumptionsEn ?? []).slice(0, 3),
    },
    exportName: slugToSchemaExport(slug),
  };
}

function renderInputBlock(inputs) {
  return inputs
    .map((input) => {
      const max = input.validation.max !== undefined ? `, max: ${input.validation.max}` : "";
      const step = input.validation.step !== undefined ? `, step: ${input.validation.step}` : "";
      return `    {
      id: ${quoteString(input.id)},
      label: ${quoteString(input.label)},
      type: ${quoteString(input.type)},
      unit: ${quoteString(input.unit)},
      required: ${input.required},
      smartDefault: ${input.smartDefault},
      validation: { min: ${input.validation.min}${max}${step} },
      helper: ${quoteString(input.helper)},
      expertMeaning: ${quoteString(input.expertMeaning)},
    }`;
    })
    .join(",\n");
}

function renderPipelineBlock(pipeline) {
  return pipeline
    .map(
      (step) => `    {
      formulaId: ${quoteString(step.formulaId)},
      inputMap: ${JSON.stringify(step.inputMap, null, 2).replace(/\n/g, "\n      ")},
      outputId: ${quoteString(step.outputId)},
    }`,
    )
    .join(",\n");
}

function renderOutputsBlock(outputs) {
  return outputs
    .map(
      (output) => `    {
      id: ${quoteString(output.id)},
      label: ${quoteString(output.label)},
      unit: ${quoteString(output.unit)},
      format: ${quoteString(output.format)},
      isBigNumber: ${output.isBigNumber ? "true" : "false"},
    }`,
    )
    .join(",\n");
}

export function renderSchemaFile(draft) {
  const notes = draft.assumptions.assumptionNotes
    .map((note) => `      ${quoteString(note)},`)
    .join("\n");

  return `import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ${draft.exportName}: PremiumCalculatorSchema = {
  id: ${quoteString(draft.id)},
  name: ${quoteString(draft.name)},
  sectorSlug: ${quoteString(draft.sectorSlug)},
  category: ${quoteString(draft.category)},
  painStatement: ${quoteString(draft.painStatement)},

  inputs: [
${renderInputBlock(draft.inputs)}
  ],

  formulaPipeline: [
${renderPipelineBlock(draft.formulaPipeline)}
  ],

  outputs: [
${renderOutputsBlock(draft.outputs)}
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: ${quoteString(draft.reportTemplate.title)},
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
${notes}
    ],
  },
};
`;
}

export function writeSchemaFile(draft) {
  const filePath = path.join(SCHEMAS_DIR, `${draft.id}.ts`);
  fs.writeFileSync(filePath, renderSchemaFile(draft), "utf8");
  return filePath;
}

export function wireSchemaRegistryEntry(draft) {
  wireSchemaRegistryBatch([draft]);
}

export function removeSchemaRegistryEntry(draft) {
  let content = fs.readFileSync(SCHEMA_REGISTRY_FILE, "utf8");
  const importLine = `import { ${draft.exportName} } from "@/lib/premium-schema/schemas/${draft.id}";`;
  const arrayEntry = `  ${draft.exportName},`;
  const mapEntry = `  ${quoteString(draft.id)}: ${quoteString(draft.id)},`;

  content = content
    .split("\n")
    .filter((line) => line !== importLine && line !== arrayEntry && line !== mapEntry)
    .join("\n");

  fs.writeFileSync(SCHEMA_REGISTRY_FILE, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

export function wireSchemaRegistryBatch(drafts) {
  if (drafts.length === 0) return;
  let content = fs.readFileSync(SCHEMA_REGISTRY_FILE, "utf8");

  for (const draft of drafts) {
    const importPath = `@/lib/premium-schema/schemas/${draft.id}`;
    const importLine = `import { ${draft.exportName} } from "${importPath}";`;
    if (!content.includes(importLine)) {
      const anchor = "import type { PremiumCalculatorSchema }";
      content = content.replace(anchor, `${importLine}\n${anchor}`);
    }

    const arrayEntry = `  ${draft.exportName},`;
    if (!content.includes(arrayEntry)) {
      content = content.replace(
        /(export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema\[\] = \[[\s\S]*?)(\n\];)/,
        `$1\n${arrayEntry}$2`,
      );
    }

    const mapEntry = `  ${quoteString(draft.id)}: ${quoteString(draft.id)},`;
    if (!content.includes(mapEntry)) {
      content = content.replace(
        /export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = \{/,
        (match) => `${match}\n${mapEntry}`,
      );
    }
  }

  fs.writeFileSync(SCHEMA_REGISTRY_FILE, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

export function schemaFileExists(slug) {
  return fs.existsSync(path.join(SCHEMAS_DIR, `${slug}.ts`));
}
