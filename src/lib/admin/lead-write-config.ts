const DEFAULT_UPDATE_URL =
  "https://updateleadpipeline-nomt4vp7sa-uc.a.run.app";

const DEFAULT_TEST_CLASSIFICATION_URL =
  "https://us-central1-sectorcalc-bf412.cloudfunctions.net/updateLeadTestClassification";

/** Enables Kaydet UI; requires a configured HTTPS function (secret stays server-side). */
export function isAdminLeadWriteEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_ADMIN_LEAD_WRITE === "true";
}

export function getAdminLeadUpdateUrl(): string {
  const configured = process.env.NEXT_PUBLIC_ADMIN_LEAD_UPDATE_URL?.trim();
  return configured || DEFAULT_UPDATE_URL;
}

export function getAdminTestClassificationUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_ADMIN_TEST_CLASSIFICATION_URL?.trim();
  return configured || DEFAULT_TEST_CLASSIFICATION_URL;
}
