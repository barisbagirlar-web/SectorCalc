import { NextResponse } from "next/server";
import { getGeneratedToolSchema } from "@/lib/generated-tools/schema-loader";
import { absoluteLocalizedUrl, absoluteUrl, SITE_URL } from "@/lib/semantic/site-url";
import {
  describeExpectedInputFormat,
  getToolValidationSchema,
} from "@/lib/validation/calculator-validator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatInputRows(
  inputs: ReadonlyArray<{
    readonly id: string;
    readonly label: string;
    readonly type: string;
    readonly unit?: string;
    readonly default?: unknown;
    readonly min?: number | null;
    readonly max?: number | null;
    readonly options?: readonly string[] | null;
    readonly businessContext?: string;
  }>,
): string {
  return inputs
    .map((input) => {
      const constraints: string[] = [];
      if (typeof input.min === "number") {
        constraints.push(`min ${input.min}`);
      }
      if (typeof input.max === "number") {
        constraints.push(`max ${input.max}`);
      }
      if (input.options?.length) {
        constraints.push(`options: ${input.options.join(" | ")}`);
      }
      if (input.default !== undefined) {
        constraints.push(`default: ${String(input.default)}`);
      }

      const constraintText = constraints.length > 0 ? ` (${constraints.join(", ")})` : "";
      const unitText = input.unit ? ` [${input.unit}]` : "";
      const contextText = input.businessContext ? `\n  - Context: ${input.businessContext}` : "";

      return `- **${input.id}** — ${input.label}${unitText} (${input.type})${constraintText}${contextText}`;
    })
    .join("\n");
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await context.params;
  const schema = getGeneratedToolSchema(slug);
  const validationSchema = getToolValidationSchema(slug);

  if (!schema && !validationSchema) {
    return new NextResponse(`# Tool not found\n\nNo calculator found for slug \`${slug}\`.`, {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }

  const title = schema?.toolName ?? validationSchema?.toolName ?? slug;
  const description = schema?.outputs?.primary ?? "Sector-specific calculator";
  const inputs = validationSchema?.inputs ?? schema?.inputs ?? [];
  const expectedFormat = describeExpectedInputFormat(inputs);
  const canonicalUrl = absoluteLocalizedUrl("en", `/tools/generated/${slug}`);
  const calculateUrl = absoluteUrl(`/api-public/calculate/${slug}`);
  const openApiUrl = absoluteUrl("/.well-known/openapi.yaml");

  const markdown = `# ${title}

> ${description}

## Canonical page
${canonicalUrl}

## Machine API (POST)
\`${calculateUrl}\`

Content-Type: \`application/json\`

\`\`\`json
{
  "inputs": ${JSON.stringify(Object.fromEntries(inputs.map((input) => [input.id, input.default ?? null])), null, 2)}
}
\`\`\`

## Input schema
${formatInputRows(inputs)}

## Expected input types
\`\`\`json
${JSON.stringify({ inputs: expectedFormat }, null, 2)}
\`\`\`

## OpenAPI contract
${openApiUrl}

## Usage note
SectorCalc provides sector-specific calculators and decision-support outputs. Results are technical simulations — not financial, legal, medical, or engineering advice. Verify before business decisions.

---
SectorCalc — ${SITE_URL}
`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
