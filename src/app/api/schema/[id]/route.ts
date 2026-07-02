import { NextRequest, NextResponse } from "next/server";
import { schemaRegistry } from "@/lib/core/schema/schema-registry";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/schema/[id] — Dynamic schema loading with auto-translation
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const schemaId = id.replace(/-schema$/, ""); // normalize: strip trailing -schema

  // Search order: generated/schemas → data/pro-tools → data/pro-tools-universal
  const searchPaths = [
    "generated/schemas",
    "data/pro-tools",
    "data/pro-tools-universal",
  ];

  for (const dirPath of searchPaths) {
    try {
      const schema = schemaRegistry.getSchema(schemaId, dirPath);
      return NextResponse.json(schema);
    } catch {
      // Not found in this directory, try next
    }
  }

  return NextResponse.json(
    { error: `Schema not found: ${schemaId}` },
    { status: 404 },
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/schema/[id] — Bulk translate (batch endpoint for clients)
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const schemaId = id.replace(/-schema$/, "");

  const searchPaths = [
    "generated/schemas",
    "data/pro-tools",
    "data/pro-tools-universal",
  ];

  // Try to load the schema; if found, it's already translated
  for (const dirPath of searchPaths) {
    try {
      const schema = schemaRegistry.getSchema(schemaId, dirPath);
      return NextResponse.json({
        translated: true,
        schema,
      });
    } catch {
      // Continue
    }
  }

  return NextResponse.json(
    { error: `Schema not found: ${schemaId}` },
    { status: 404 },
  );
}
