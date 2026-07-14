import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/infrastructure/firebase/admin";
import {
  parseBearerToken,
  type VerifiedSignedInUser,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";

export { parseBearerToken };

const SUPER_ADMIN_EMAIL = "barisbagirlar@gmail.com";

/** Verify Firebase ID token and require `admin: true` custom claim or super admin email. */
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
    if (decoded.email === SUPER_ADMIN_EMAIL || decoded.admin === true) {
      return signedIn;
    }

    return null;
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
