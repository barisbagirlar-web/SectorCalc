import type { GeneratedToolInput, GeneratedToolSchema } from "@/lib/generated-tools/types";
import { resolveGeneratedFieldDisplay } from "@/lib/i18n/generated-field-display";
import {
  resolveGeneratedToolDescription,
  resolveGeneratedToolTitle,
} from "@/lib/generated-tools/resolve-tool-display";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/i18n/locale-config";
import { absoluteLocalizedUrl, absoluteUrl, SITE_URL } from "@/lib/semantic/site-url";
import {
  describeExpectedInputFormat,
  type SchemaInputField,
} from "@/lib/validation/calculator-validator-schema";
import {
  formatApiPublicMessage,
  tApiPublic,
} from "@/lib/validation/api-public-messages";

type BotMdInput = Pick<
  GeneratedToolInput,
  | "id"
  | "label"
  | "label_i18n"
  | "type"
  | "unit"
  | "default"
  | "min"
  | "max"
  | "options"
  | "businessContext"
  | "businessContext_i18n"
>;

function formatInputRows(
  slug: string,
  inputs: readonly BotMdInput[],
  locale: SupportedLocale,
): string {
  return inputs
    .map((input) => {
      const display = resolveGeneratedFieldDisplay(slug, input, locale);
      const constraints: string[] = [];

      if (typeof input.min === "number") {
        constraints.push(`${tApiPublic(locale, "constraintMin")} ${input.min}`);
      }
      if (typeof input.max === "number") {
        constraints.push(`${tApiPublic(locale, "constraintMax")} ${input.max}`);
      }
      if (input.options?.length) {
        constraints.push(
          `${tApiPublic(locale, "constraintOptions")}: ${input.options.join(" | ")}`,
        );
      }
      if (input.default !== undefined) {
        constraints.push(
          `${tApiPublic(locale, "constraintDefault")}: ${String(input.default)}`,
        );
      }

      const constraintText = constraints.length > 0 ? ` (${constraints.join(", ")})` : "";
      const unitText = input.unit ? ` [${input.unit}]` : "";
      const contextText = display.helper
        ? `\n  - ${tApiPublic(locale, "constraintContext")}: ${display.helper}`
        : "";

      return `- **${input.id}** — ${display.label}${unitText} (${input.type})${constraintText}${contextText}`;
    })
    .join("\n");
}

function toExpectedFormatInputs(inputs: readonly BotMdInput[]): readonly SchemaInputField[] {
  return inputs.map((input) => ({
    id: input.id,
    label: input.label,
    type: input.type,
    unit: input.unit,
    default: input.default,
    min: input.min ?? null,
    max: input.max ?? null,
    options: input.options ?? undefined,
  }));
}

export function buildBotMdNotFound(slug: string, locale: SupportedLocale): string {
  return `# ${tApiPublic(locale, "botNotFoundTitle")}

${formatApiPublicMessage(locale, "botNotFoundBody", { slug })}
`;
}

export function buildBotMdDocument(input: {
  readonly slug: string;
  readonly locale: SupportedLocale;
  readonly schema: GeneratedToolSchema;
}): string {
  const { slug, locale, schema } = input;
  const title = resolveGeneratedToolTitle(slug, schema, locale);
  const description = resolveGeneratedToolDescription(slug, schema, locale);
  const inputs = schema.inputs;
  const expectedFormat = describeExpectedInputFormat(toExpectedFormatInputs(inputs));
  const canonicalUrl = absoluteLocalizedUrl(locale, `/tools/generated/${slug}`);
  const calculateUrl = absoluteUrl(`/api-public/calculate/${slug}`);
  const openApiUrl = absoluteUrl("/.well-known/openapi.yaml");

  const localeVariants = SUPPORTED_LOCALES.map(
    (variant) =>
      `- [${variant}] ${absoluteUrl(`/api-public/bot-md/${slug}?locale=${variant}`)}`,
  ).join("\n");

  return `# ${title}

> ${description || tApiPublic(locale, "botDefaultDescription")}

## ${tApiPublic(locale, "botCanonicalPage")}
${canonicalUrl}

## ${tApiPublic(locale, "botMachineApi")}
\`${calculateUrl}\`

Content-Type: \`application/json\`
Accept-Language: \`${locale}\`

\`\`\`json
{
  "locale": "${locale}",
  "inputs": ${JSON.stringify(Object.fromEntries(inputs.map((field) => [field.id, field.default ?? null])), null, 2)}
}
\`\`\`

## ${tApiPublic(locale, "botInputSchema")}
${formatInputRows(slug, inputs, locale)}

## ${tApiPublic(locale, "botExpectedTypes")}
\`\`\`json
${JSON.stringify({ locale, inputs: expectedFormat }, null, 2)}
\`\`\`

## ${tApiPublic(locale, "botOpenApi")}
${openApiUrl}

## Locale variants
${localeVariants}

## ${tApiPublic(locale, "botUsageNote")}

---
SectorCalc — ${SITE_URL}
`;
}
