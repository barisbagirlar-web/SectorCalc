import { createHash } from "crypto";
import { SITE_URL } from "@/lib/semantic/site-url";

export function generateVerificationHash(data: unknown): string {
  const timestamp = new Date().toISOString();
  const payload = JSON.stringify({ data, timestamp });
  return createHash("sha256").update(payload).digest("hex");
}

export function generateQRData(verificationHash: string): string {
  return `${SITE_URL}/verify/${verificationHash}`;
}

export function generateVerifyPageUrl(verificationHash: string): string {
  return `${SITE_URL}/verify?hash=${encodeURIComponent(verificationHash)}`;
}
