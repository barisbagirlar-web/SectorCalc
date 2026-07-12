import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/infrastructure/firebase/admin";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
const SESSION_EXPIRY_MS = 14 * 24 * 60 * 60 * 1000;

function firebaseAdminErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object" || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : null;
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const idToken =
      typeof body === "object" &&
      body !== null &&
      "idToken" in body &&
      typeof (body as Record<string, unknown>).idToken === "string"
        ? ((body as Record<string, unknown>).idToken as string)
        : null;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const app = getFirebaseAdminApp();
    if (!app) {
      return NextResponse.json(
        { error: "Firebase Admin is not configured for this server runtime." },
        { status: 500 },
      );
    }

    const auth = getAuth(app);
    const decoded = await auth.verifyIdToken(idToken, true);
    if (!decoded?.uid) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 },
      );
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    });
    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", sessionCookie, {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: SESSION_EXPIRY_MS / 1000,
    });
    return response;
  } catch (error) {
    const code = firebaseAdminErrorCode(error);
    const message = error instanceof Error ? error.message : "Session creation failed";

    console.error("[session] Creation error:", { code, message });

    const isTokenFailure =
      code?.startsWith("auth/") ||
      message.toLowerCase().includes("token") ||
      message.toLowerCase().includes("credential");

    if (isTokenFailure) {
      return NextResponse.json(
        {
          error: "Invalid or revoked authentication token",
          ...(process.env.NODE_ENV !== "production" && code ? { code } : {}),
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error: "Authentication service unavailable",
        ...(process.env.NODE_ENV !== "production" && code ? { code } : {}),
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("__session", "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
