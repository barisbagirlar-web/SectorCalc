import type { Request } from "express";
import * as admin from "firebase-admin";

export interface UserAuthSuccess {
  ok: true;
  uid: string;
  email: string | null;
}

export interface UserAuthFailure {
  ok: false;
  status: 401;
  error: string;
}

export type AuthorizeUserResult = UserAuthSuccess | UserAuthFailure;

function parseBearerToken(req: Request): string | null {
  const header = req.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export async function authorizeSignedInUser(
  req: Request
): Promise<AuthorizeUserResult> {
  const bearerToken = parseBearerToken(req);
  if (!bearerToken) {
    return { ok: false, status: 401, error: "Unauthorized." };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(bearerToken);
    return {
      ok: true,
      uid: decoded.uid,
      email: typeof decoded.email === "string" ? decoded.email : null,
    };
  } catch {
    return { ok: false, status: 401, error: "Unauthorized." };
  }
}
