import type { Request } from "express";

export function isAdminWriteConfigured(): boolean {
  const secret = process.env.ADMIN_LEAD_UPDATE_SECRET?.trim();
  if (secret) {
    return true;
  }
  return process.env.FUNCTIONS_EMULATOR === "true";
}

export function verifyAdminLeadUpdateSecret(req: Request): boolean {
  const expected = process.env.ADMIN_LEAD_UPDATE_SECRET?.trim();
  if (!expected) {
    return false;
  }

  const provided = req.get("x-admin-lead-secret")?.trim();
  return provided === expected;
}
