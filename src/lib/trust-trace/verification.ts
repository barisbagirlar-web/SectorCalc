import { SITE_URL } from "@/lib/semantic/site-url";
import { createCalculationHash } from "./hash";

export async function generateVerificationHash(data: unknown): Promise<string> {
  const payload = {
    data,
    timestamp: new Date().toISOString(),
  };
  return createCalculationHash(payload);
}

export function generateQRData(verificationHash: string): string {
  return `${SITE_URL}/verify/${verificationHash}`;
}

export function buildQrCodeImageUrl(targetUrl: string, size = 120): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}`;
}
