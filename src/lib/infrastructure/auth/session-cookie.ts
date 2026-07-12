import type { User } from "firebase/auth";

const SESSION_API = "/api/auth/session";

interface SessionApiError {
  error?: string;
  code?: string;
}

export async function syncSessionCookie(user: User): Promise<void> {
  // Always force-refresh after password reset, provider linking, or a new sign-in.
  // A cached ID token may have been revoked and must never be used to establish
  // the server-side session that protects account and Pro routes.
  const idToken = await user.getIdToken(true);
  if (!idToken) {
    throw new Error("Firebase did not return an ID token.");
  }

  const response = await fetch(SESSION_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    let detail = `Session creation failed with HTTP ${response.status}.`;
    try {
      const payload = (await response.json()) as SessionApiError;
      detail = payload.error || payload.code || detail;
    } catch {
      // Preserve the HTTP-based fallback when the response is not JSON.
    }
    throw new Error(detail);
  }
}

export async function clearSessionCookie(): Promise<void> {
  try {
    await fetch(SESSION_API, {
      method: "DELETE",
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    // Sign-out must still clear the client Firebase session even if the server
    // endpoint is temporarily unavailable.
  }
}
