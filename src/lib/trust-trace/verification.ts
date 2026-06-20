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

/**
 * Build QR code image URL using our server-side API.
 * Previously used external api.qrserver.com — now in-house.
 */
export function buildQrCodeImageUrl(targetUrl: string, size = 140): string {
  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_BASE_URL ?? "https://sectorcalc.com");
  return `${baseUrl}/api/qr?url=${encodeURIComponent(targetUrl)}&size=${size}`;
}
