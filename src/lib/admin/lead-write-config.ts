const DEFAULT_UPDATE_URL =
  "https://updateleadpipeline-nomt4vp7sa-uc.a.run.app";

/** Enables Kaydet UI; requires a configured HTTPS function (secret stays server-side). */
export function isAdminLeadWriteEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_ADMIN_LEAD_WRITE === "true";
}

export function getAdminLeadUpdateUrl(): string {
  const configured = process.env.NEXT_PUBLIC_ADMIN_LEAD_UPDATE_URL?.trim();
  return configured || DEFAULT_UPDATE_URL;
}
