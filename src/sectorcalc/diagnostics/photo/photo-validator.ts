/**
 * Engineering Diagnostics — Photo Validation & Processing
 *
 * Server-side photo validation, EXIF stripping, and hashing.
 * Never stores photos unless privacy_mode permits it.
 *
 * STRICT:
 * - Photos are processed server-side only
 * - EXIF metadata stripped before any AI call
 * - OpenAI key never leaves server
 * - Max 8 photos, 8 MB each, JPEG/PNG/WebP only
 */

import crypto from "node:crypto";

export const MAX_PHOTOS = 8;
export const MAX_PHOTO_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ── Validation ── */

export interface PhotoValidationError {
  index: number;
  error: string;
}

export interface PhotoValidationResult {
  ok: boolean;
  errors: PhotoValidationError[];
}

/**
 * Validate a batch of base64-encoded photos.
 * Each entry must be `data:{mime};base64,{data}` format.
 */
export function validatePhotos(
  photos: string[],
): PhotoValidationResult {
  const errors: PhotoValidationError[] = [];

  if (photos.length > MAX_PHOTOS) {
    errors.push({
      index: -1,
      error: `Maximum ${MAX_PHOTOS} photos allowed. Received ${photos.length}.`,
    });
    return { ok: false, errors };
  }

  if (photos.length === 0) {
    return { ok: true, errors: [] };
  }

  for (let i = 0; i < photos.length; i++) {
    const raw = photos[i];

    // Validate format
    const match = raw.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
    if (!match) {
      errors.push({ index: i, error: "Invalid photo format. Must be base64-encoded JPEG, PNG, or WebP." });
      continue;
    }

    const mime = match[1] as string;
    const b64Data = match[3];

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(mime)) {
      errors.push({ index: i, error: `Unsupported format: ${mime}. Allowed: JPEG, PNG, WebP.` });
      continue;
    }

    // Validate size
    const byteLength = Buffer.byteLength(b64Data, "base64");
    if (byteLength > MAX_PHOTO_SIZE_BYTES) {
      errors.push({
        index: i,
        error: `Photo exceeds maximum size of 8 MB (${(byteLength / 1024 / 1024).toFixed(1)} MB).`,
      });
      continue;
    }
  }

  return { ok: errors.length === 0, errors };
}

/* ── EXIF Stripping ── */

/**
 * Strip EXIF metadata from a JPEG buffer by removing APP1 segments.
 * For PNG/WebP, returns buffer as-is (EXIF less common).
 * Pure Node — no external dependencies.
 */
export function stripExif(buffer: Buffer, mime: string): Buffer {
  // Accept both "image/jpeg" and shorthand "jpeg"
  const isJpeg = mime === "image/jpeg" || mime === "jpeg";
  if (!isJpeg) {
    return buffer;
  }

  // JPEG EXIF is stored in APP1 marker (0xFF 0xE1).
  // We scan for and remove all APP1 segments.
  let result = buffer;
  let pos = 2; // Skip SOI marker (0xFF 0xD8)

  while (pos < result.length - 1) {
    // Look for marker prefix 0xFF
    if (result[pos] !== 0xff) {
      pos++;
      continue;
    }

    const marker = result[pos + 1];

    // SOS (Start of Scan) — image data starts, no more metadata
    if (marker === 0xda) {
      break;
    }

    // APP1 marker (EXIF)
    if (marker === 0xe1) {
      const segLength = result.readUInt16BE(pos + 2);
      const segEnd = pos + 2 + segLength;
      // Remove APP1 segment
      result = Buffer.concat([result.subarray(0, pos), result.subarray(segEnd)]);
      continue; // Don't advance pos — next marker at same position
    }

    // Other marker with length (most markers except RST0-7, SOI, EOI, TEM)
    if (
      marker !== 0x01 && // TEM
      !(marker >= 0xd0 && marker <= 0xd7) && // RST0-RST7
      marker !== 0xd8 && // SOI
      marker !== 0xd9    // EOI
    ) {
      const segLength = result.readUInt16BE(pos + 2);
      pos += 2 + segLength;
    } else {
      pos += 2;
    }
  }

  return result;
}

/* ── Processing Pipeline ── */

export interface ProcessedPhoto {
  hash: string;
  mime: string;
  data: string; // base64-encoded, EXIF-stripped
  size_bytes: number;
}

/**
 * Process a batch of base64 photos:
 * 1. Validate
 * 2. Decode
 * 3. Strip EXIF
 * 4. Hash
 * 5. Re-encode as base64
 *
 * Returns validated + processed photos.
 * Throws on validation failure.
 */
export function processPhotos(photos: string[]): ProcessedPhoto[] {
  const validation = validatePhotos(photos);
  if (!validation.ok) {
    const messages = validation.errors.map((e) => `[${e.index}] ${e.error}`).join("; ");
    throw new Error(`Photo validation failed: ${messages}`);
  }

  return photos.map((raw) => {
    const match = raw.match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/)!;
    const mime = match[1];
    const b64Data = match[3];
    const buffer = Buffer.from(b64Data, "base64");

    // Strip EXIF
    const clean = stripExif(buffer, mime);

    // Hash
    const hash = crypto.createHash("sha256").update(clean).digest("hex");

    return {
      hash,
      mime,
      data: clean.toString("base64"),
      size_bytes: clean.length,
    };
  });
}
