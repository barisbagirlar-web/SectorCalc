import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import {
  parseBearerToken,
  type VerifiedSignedInUser,
  verifySignedInUser,
} from "@/lib/firebase/verify-signed-in-user";

export { parseBearerToken };

/** Verify Firebase ID token and require `admin: true` custom claim. */
export async function verifyAdminUser(
  idToken: string,
): Promise<VerifiedSignedInUser | null> {
  const signedIn = await verifySignedInUser(idToken);
  if (!signedIn) {
    return null;
  }

  try {
    const app = getFirebaseAdminApp();
    if (!app) {
      return null;
    }

    const decoded = await getAuth(app).verifyIdToken(idToken);
    if (decoded.admin !== true) {
      return null;
    }

    return signedIn;
  } catch {
    return null;
  }
}

export async function requireAdminFromRequest(
  request: Request,
): Promise<VerifiedSignedInUser | null> {
  const idToken = parseBearerToken(request);
  if (!idToken) {
    return null;
  }
  return verifyAdminUser(idToken);
}
