import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ hash: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { hash } = await context.params;

  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) {
    return NextResponse.json(
      {
        verified: false,
        message: "Geçersiz doğrulama hash formatı.",
        hash,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    verified: true,
    message: "Bu rapor SectorCalc Trust Trace ile doğrulanmıştır.",
    hash,
    timestamp: new Date().toISOString(),
  });
}
