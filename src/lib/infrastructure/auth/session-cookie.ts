import type { User } from "firebase/auth";
const SESSION_API = "/api/auth/session";
export async function syncSessionCookie(user: User): Promise<void> {
  try {
    const idToken = await user.getIdToken(false);
    if (!idToken) return;
    const response = await fetch(SESSION_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) });
    if (!response.ok) console.warn("[session] Cookie sync failed:", response.status);
  } catch {}
}
export async function clearSessionCookie(): Promise<void> {
  try { await fetch(SESSION_API, { method: "DELETE" }); } catch {}
}
