import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { getFreeToolSchema } from "@/sectorcalc/runtime/free-schema-loader";
import { getFreeV531SchemaRaw, hasFreeV531Schema } from "@/sectorcalc/runtime/inline-free-v531-registry";
import { FREE_V531_SCHEMA_SLUGS } from "@/sectorcalc/schemas/free-v531/registry.generated";
import { isActiveTool } from "@/sectorcalc/runtime/active-tool-allowlist";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") || "machining-cost-per-part";
  
  const results: Record<string, unknown> = {
    slug,
    hasFreeV531Schema: hasFreeV531Schema(slug),
    freeV531SlugsCount: FREE_V531_SCHEMA_SLUGS.length,
    freeV531SlugsFirst5: FREE_V531_SCHEMA_SLUGS.slice(0, 5),
    freeV531HasSlug: FREE_V531_SCHEMA_SLUGS.includes(slug),
    isActiveTool: isActiveTool(slug),
  };

  // Get raw schema
  const rawSchema = getFreeV531SchemaRaw(slug);
  results.rawSchemaExists = !!rawSchema;
  results.rawSchemaToolKey = rawSchema ? (rawSchema as any).tool_key : null;
  results.rawSchemaToolName = rawSchema ? (rawSchema as any).tool_name : null;

  // Get via free schema loader
  const freeSchema = getFreeToolSchema(slug);
  results.freeSchemaExists = !!freeSchema;
  results.freeSchemaToolKey = freeSchema?.tool_key ?? null;

  // Get via full resolver
  const resolverResult = resolveApprovedToolSchema(slug);
  results.resolverOk = resolverResult.ok;
  if (!resolverResult.ok) {
    results.resolverReason = resolverResult.reason;
    results.resolverErrors = resolverResult.errors;
  }

  return Response.json(results, {
    headers: { "content-type": "application/json" },
  });
}
