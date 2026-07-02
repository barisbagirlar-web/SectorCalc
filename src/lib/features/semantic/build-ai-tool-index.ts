// @ts-nocheck
import { listSemanticToolContracts } from "@/lib/features/semantic/semantic-tool-reader";
import { absoluteLocalizedUrl, absoluteUrl } from "@/lib/features/semantic/site-url";
import { pickLocaleText } from "@/lib/features/semantic/semantic-locale-utils";
import type { SemanticToolContract } from "@/lib/features/semantic/tool-semantic-types";
import { SEMANTIC_LOCALES } from "@/lib/features/semantic/tool-semantic-types";

export type AiToolIndexEntry = {
  readonly toolSlug: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly tier: SemanticToolContract["tier"];
  readonly category: string;
  readonly archetype: SemanticToolContract["archetype"];
  readonly locales: readonly string[];
  readonly inputParameters: ReadonlyArray<{
    readonly key: string;
    readonly label: string;
    readonly description: string;
    readonly unitText?: string;
    readonly required: boolean;
    readonly valueType: string;
  }>;
  readonly outputParameters: ReadonlyArray<{
    readonly key: string;
    readonly label: string;
    readonly description: string;
    readonly unitText?: string;
  }>;
};

export function buildAiToolIndex(locale = "en"): readonly AiToolIndexEntry[] {
  return listSemanticToolContracts()
    .filter((tool) => tool.isPublic)
    .map((tool) => ({
      toolSlug: tool.toolSlug,
      title: pickLocaleText(tool.title, locale),
      description: pickLocaleText(tool.description, locale),
      url: absoluteLocalizedUrl(locale, tool.urlPath),
      tier: tool.tier,
      category: tool.category,
      archetype: tool.archetype,
      
      inputParameters: tool.inputParameters.map((param) => ({
        key: param.key,
        label: pickLocaleText(param.label, locale),
        description: pickLocaleText(param.description, locale),
        unitText: param.unitText,
        required: param.required,
        valueType: param.valueType,
      })),
      outputParameters: tool.outputParameters.map((param) => ({
        key: param.key,
        label: pickLocaleText(param.label, locale),
        description: pickLocaleText(param.description, locale),
        unitText: param.unitText,
      })),
    }))
    .sort((a, b) => a.toolSlug.localeCompare(b.toolSlug));
}

export function buildAiToolIndexTxt(locale = "en"): string {
  const entries = buildAiToolIndex(locale);
  const lines = [
    "# SectorCalc AI Tool Index",
    `# Site: ${absoluteUrl("/")}`,
    `# Generated entries: ${entries.length}`,
    "",
  ];

  for (const entry of entries) {
    lines.push(`## ${entry.toolSlug}`);
    lines.push(`- title: ${entry.title}`);
    lines.push(`- url: ${entry.url}`);
    lines.push(`- tier: ${entry.tier}`);
    lines.push(`- category: ${entry.category}`);
    lines.push(`- archetype: ${entry.archetype}`);
    lines.push("- inputs:");
    for (const input of entry.inputParameters) {
      lines.push(
        `  - ${input.key}: ${input.label}${input.unitText ? ` (${input.unitText})` : ""}`,
      );
    }
    lines.push("- outputs:");
    for (const output of entry.outputParameters) {
      lines.push(`  - ${output.key}: ${output.label}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
