/**
 * Server-side QR code generation API.
 * Replaces https://api.qrserver.com/ with in-house generation.
 *
 * GET /api/qr?url=https://sectorcalc.com/verify/abc...&size=140
 * Returns: SVG image with Content-Type: image/svg+xml
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateQrSvg } from "@/lib/features/trust-trace/qr-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_URL_LENGTH = 1024;
const MIN_SIZE = 80;
const MAX_SIZE = 600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const sizeParam = searchParams.get("size");

  if (!url || url.length > MAX_URL_LENGTH) {
    return NextResponse.json(
      { error: "Missing or too long 'url' parameter" },
      { status: 400 },
    );
  }

  // Basic URL validation - allow only sectorcalc.com URLs
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("sectorcalc.com") && !parsed.hostname.endsWith("web.app")) {
      return NextResponse.json(
        { error: "Only sectorcalc.com URLs are allowed" },
        { status: 403 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 },
    );
  }

  const size = Math.min(
    MAX_SIZE,
    Math.max(MIN_SIZE, Number(sizeParam) || 140),
  );

  try {
    const svg = await generateQrSvg(url);

    // Inject viewBox with requested size
    const sizedSvg = svg.replace(
      /<svg([^>]*)>/,
      (match, attrs: string) => {
        const hasViewBox = /viewBox/i.test(attrs);
        return hasViewBox
          ? match
          : `<svg${attrs} width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
      },
    );

    return new NextResponse(sizedSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml;charset=utf-8",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.error("[QR API] generation failed:", error);
    return NextResponse.json(
      { error: "QR generation failed" },
      { status: 500 },
    );
  }
}
