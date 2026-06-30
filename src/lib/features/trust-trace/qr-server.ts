/**
 * Server-side QR code generation for Trust Trace.
 * Replaces the external api.qrserver.com dependency.
 *
 * Usage (API route): generateQrSvg(targetUrl) → SVG string or data URL
 */
import * as QRCode from "qrcode";

/**
 * Generate a QR code as a data URL (PNG base64).
 * Works in Node.js server environment only.
 */
export async function generateQrDataUrl(
  targetUrl: string,
  width = 140,
): Promise<string> {
  return QRCode.toDataURL(targetUrl, {
    width,
    margin: 2,
    color: {
      dark: "#15803d",
      light: "#ffffff",
    },
  });
}

/**
 * Generate a QR code as an SVG string (smaller than PNG).
 */
export async function generateQrSvg(
  targetUrl: string,
): Promise<string> {
  return QRCode.toString(targetUrl, {
    type: "svg",
    margin: 2,
    color: {
      dark: "#15803d",
      light: "#ffffff",
    },
  });
}
