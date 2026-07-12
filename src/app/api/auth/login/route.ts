import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/infrastructure/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("A valid email address is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const SESSION_EXPIRY_MS = 14 * 24 * 60 * 60 * 1000;

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/**
 * POST /api/auth/login
 *
 * Authenticates a user with email + password using Firebase Auth REST API,
 * then issues a session cookie. Password is sent server-to-API, never
 * exposed to the browser JS context.
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          details: firstError?.message ?? "Invalid input.",
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // Exchange email+password for a Firebase ID token via REST API
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error("[auth/login] Missing NEXT_PUBLIC_FIREBASE_API_KEY");
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 },
      );
    }

    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    let idToken: string;
    try {
      const firebaseRes = await fetch(signInUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });

      if (!firebaseRes.ok) {
        const errBody = (await firebaseRes.json()) as Record<string, unknown>;
        const errMsg =
          typeof errBody.error === "object" && errBody.error !== null
            ? ((errBody.error as Record<string, unknown>).message as string) ?? ""
            : "";

        // Dev: log raw Firebase REST error message so 400 is not blindly
        // assumed to be "wrong password" — see UYARI in auth audit
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log(`[auth/login] Raw Firebase REST error message: ${errMsg}`, errBody);
        }

        // Map Firebase REST API error codes to user-safe messages
        if (errMsg === "EMAIL_NOT_FOUND" || errMsg === "INVALID_PASSWORD" || errMsg === "INVALID_LOGIN_CREDENTIALS") {
          return NextResponse.json(
            { error: "INVALID_CREDENTIALS", details: "Invalid email or password." },
            { status: 401 },
          );
        }

        if (errMsg === "USER_DISABLED") {
          return NextResponse.json(
            { error: "ACCOUNT_DISABLED", details: "This account has been disabled." },
            { status: 403 },
          );
        }

        if (errMsg === "OPERATION_NOT_ALLOWED") {
          return NextResponse.json(
            { error: "OPERATION_NOT_ALLOWED", details: "Email/password sign-in is not enabled." },
            { status: 403 },
          );
        }

        if (errMsg === "TOO_MANY_ATTEMPTS_TRY_LATER") {
          return NextResponse.json(
            { error: "RATE_LIMITED", details: "Too many attempts. Please wait and try again." },
            { status: 429 },
          );
        }

        if (errMsg === "API_KEY_NOT_VALID" || errMsg === "INVALID_API_KEY") {
          return NextResponse.json(
            { error: "CONFIGURATION_ERROR", details: "Authentication service configuration error." },
            { status: 503 },
          );
        }

        return NextResponse.json(
          { error: "AUTHENTICATION_FAILED", details: "Sign-in failed. Please try again." },
          { status: 401 },
        );
      }

      const firebaseData = (await firebaseRes.json()) as Record<string, unknown>;
      idToken = firebaseData.idToken as string;
    } catch (fetchErr) {
      console.error("[auth/login] Firebase REST call failed:", fetchErr);
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 },
      );
    }

    // Exchange ID token for a session cookie
    const app = getFirebaseAdminApp();
    if (!app) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 },
      );
    }

    let sessionCookie: string;
    try {
      const auth = getAuth(app);
      sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_EXPIRY_MS,
      });
    } catch (cookieErr) {
      console.error("[auth/login] Session cookie creation failed:", cookieErr);
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", sessionCookie, {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: SESSION_EXPIRY_MS / 1000,
    });

    return response;
  } catch (error) {
    console.error("[auth/login] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
