import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/infrastructure/firebase/admin";

export type VerifiedSignedInUser = {
  readonly uid: string;
  readonly email: string | null;
};

export function parseBearerToken(req: Request): string | null {
  const header = req.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

/** Verify Firebase ID token and return uid when the user is signed in. */
export async function verifySignedInUser(
  idToken: string,
): Promise<VerifiedSignedInUser | null> {
  if (!idToken.trim()) {
    return null;
  }

  try {
    const app = getFirebaseAdminApp();
    if (!app) {
      return null;
    }

    const decoded = await getAuth(app).verifyIdToken(idToken);
    if (!decoded?.uid) {
      return null;
    }

    return {
      uid: decoded.uid,
      email: typeof decoded.email === "string" ? decoded.email : null,
    };
  } catch {
    return null;
  }
}
