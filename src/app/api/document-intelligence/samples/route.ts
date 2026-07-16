/**
 * API Route: GET /api/document-intelligence/samples
 *
 * Serves downloadable sample output files for the Maintenance BOM
 * Recovery landing page. Files are pre-generated at build time and
 * served as static attachments.
 *
 * Query parameters:
 *   ?file=bom         → Sample_Maintenance_BOM.xlsx
 *   ?file=exception   → Sample_Procurement_Exception_Report.xlsx
 *   ?file=source-map  → Sample_Source_Map.csv
 */

import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SAMPLES_DIR = "public/samples";

const FILE_MAP = {
  bom: {
    filename: "Sample_Maintenance_BOM.xlsx",
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  exception: {
    filename: "Sample_Procurement_Exception_Report.xlsx",
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  "source-map": {
    filename: "Sample_Source_Map.csv",
    contentType: "text/csv; charset=utf-8",
  },
} as const;

type FileKey = keyof typeof FILE_MAP;

function isFileKey(value: string | null): value is FileKey {
  return value !== null && value in FILE_MAP;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("file");

  if (!isFileKey(fileKey)) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_FILE_PARAMETER",
          message:
            'Valid values: "bom", "exception", "source-map". Example: ?file=bom',
        },
      },
      { status: 400 }
    );
  }

  const entry = FILE_MAP[fileKey];
  const filePath = resolve(process.cwd(), SAMPLES_DIR, entry.filename);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      {
        error: {
          code: "SAMPLE_FILE_NOT_FOUND",
          message: `Sample file "${entry.filename}" not found. Run \`node scripts/generate-sample-bom-outputs.mjs\` first.`,
        },
      },
      { status: 404 }
    );
  }

  const fileBuffer = readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": entry.contentType,
      "Content-Disposition": `attachment; filename="${entry.filename}"`,
      "Content-Length": String(fileBuffer.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
