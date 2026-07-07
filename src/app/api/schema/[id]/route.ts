import { NextRequest, NextResponse } from "next/server";
import { schemaRegistry } from "@/lib/core/schema/schema-registry";
import { getAllProToolSchemas } from "@/sectorcalc/runtime/pro-schema-loader";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/schema/[id] - Dynamic schema loading
// Searches: generated/schemas, then pro-v531, then v531
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const schemaId = id.replace(/-schema$/, ""); // normalize: strip trailing -schema

  // Strategy 1: Try the registry-based paths (generated/schemas, pro-v531, v531)
  const searchPaths = [
    "generated/schemas",
    "src/sectorcalc/schemas/pro-v531",
    "src/sectorcalc/schemas/v531",
  ];

  for (const dirPath of searchPaths) {
    try {
      const schema = schemaRegistry.getSchema(schemaId, dirPath);
      return NextResponse.json(schema);
    } catch {
      // Not found in this directory, try next
    }
  }

  // Strategy 2: Pre-loaded pro-v531 schemas (works in all environments)
  try {
    const proEntries = getAllProToolSchemas();
    for (const { toolKey, schema } of proEntries) {
      if (toolKey === schemaId) {
        return NextResponse.json(schema);
      }
    }
  } catch {
    // Fallback failed too
  }

  return NextResponse.json(
    { error: `Schema not found: ${schemaId}` },
    { status: 404 },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/schema/[id] - Check if schema exists (batch endpoint for clients)
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const schemaId = id.replace(/-schema$/, "");

  // Try registry-based paths
  const searchPaths = [
    "generated/schemas",
    "src/sectorcalc/schemas/pro-v531",
    "src/sectorcalc/schemas/v531",
  ];

  for (const dirPath of searchPaths) {
    try {
      const schema = schemaRegistry.getSchema(schemaId, dirPath);
      return NextResponse.json({ translated: true, schema });
    } catch {
      // Continue
    }
  }

  // Fallback to pre-loaded schemas
  try {
    const proEntries = getAllProToolSchemas();
    for (const { toolKey, schema } of proEntries) {
      if (toolKey === schemaId) {
        return NextResponse.json({ translated: true, schema });
      }
    }
  } catch {
    // Fallback failed too
  }

  return NextResponse.json(
    { error: `Schema not found: ${schemaId}` },
    { status: 404 },
  );
}
