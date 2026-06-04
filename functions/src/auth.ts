import * as admin from "firebase-admin";
import type { Request } from "express";
import { isAdminWriteConfigured, verifyAdminLeadUpdateSecret } from "./security";

export interface AuthSuccess {
  ok: true;
}

export interface AuthFailure {
  ok: false;
  status: 401 | 403;
  error: string;
}

export type AuthorizeAdminWriteResult = AuthSuccess | AuthFailure;

function parseBearerToken(req: Request): string | null {
  const header = req.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export async function authorizeAdminWrite(
  req: Request
): Promise<AuthorizeAdminWriteResult> {
  const bearerToken = parseBearerToken(req);

  if (bearerToken) {
    try {
      const decoded = await admin.auth().verifyIdToken(bearerToken);
      if (decoded.admin === true) {
        return { ok: true };
      }
      return { ok: false, status: 403, error: "Forbidden." };
    } catch {
      return { ok: false, status: 401, error: "Unauthorized." };
    }
  }

  if (isAdminWriteConfigured() && verifyAdminLeadUpdateSecret(req)) {
    return { ok: true };
  }

  return { ok: false, status: 401, error: "Unauthorized." };
}
