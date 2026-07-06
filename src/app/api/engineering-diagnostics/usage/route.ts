/**
 * GET /api/engineering-diagnostics/usage
 *
 * Returns the current user's remaining Full Diagnostic uses and
 * the package mapping for UI display.
 *
 * Auth: Bearer <Firebase ID token> (required)
 *
 * Response:
 *   { ok: true, remainingUses: number, packageInfo: { creditsPerPackage, usesPerPackage } }
 *   { ok: false, error: "Authentication required" }
 */

import { NextResponse } from "next/server";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  getRemainingDiagnosticUses,
  DIAGNOSTIC_PACKAGE_CREDITS,
  DIAGNOSTIC_PACKAGE_USES,
} from "@/sectorcalc/diagnostics/diagnostic-package";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const token = parseBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Authentication required." },
        { status: 401 },
      );
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired authentication token." },
        { status: 401 },
      );
    }

    const remainingUses = await getRemainingDiagnosticUses(user.uid);

    return NextResponse.json({
      ok: true,
      remainingUses,
      packageInfo: {
        creditsPerPackage: DIAGNOSTIC_PACKAGE_CREDITS,
        usesPerPackage: DIAGNOSTIC_PACKAGE_USES,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
