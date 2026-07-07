/**
 * POST /api/engineering-diagnostics/photo-preview
 *
 * AI Photo Diagnosis — 2 credits = 3 uses.
 *
 * FLOW:
 * 1. Auth gate
 * 2. Product usage check (grant from credits if needed)
 * 3. Rate limit
 * 4. Parse + validate photos (EXIF strip, hash)
 * 5. Call OpenAI Vision
 * 6. On success → decrement 1 use, return result
 * 7. On failure → NO use decrement, return fallback
 *
 * CONSTRAINTS:
 * - Only visual observations — no deterministic values
 * - No cost_at_risk, tolerance_result, measurement_confidence,
 *   risk_score_numeric, final_decision
 */

import { NextResponse } from "next/server";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  checkProductUsage,
  grantProductUsesFromCredits,
  decrementProductUse,
  getProductUsageDoc,
  PRODUCT_KEYS,
} from "@/lib/credits/product-usage-policy";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { VISUAL_OBSERVATION_SYSTEM_PROMPT } from "@/lib/diagnostics/visualObservationPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_KEY = PRODUCT_KEYS.AI_PHOTO_DIAGNOSIS;

/* ── Rate limit: in-memory map, 10 req/hour per IP ── */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

/* ── Photo validation ── */

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTOS = 8;
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

interface PhotoEntry {
  data: string;
  mime: string;
  hash: string;
}

function validatePhotoBuffer(buffer: Buffer, mime: string): string | null {
  if (!ALLOWED_TYPES.includes(mime)) return "Unsupported file type. Use JPEG, PNG, or WebP.";
  if (buffer.length > MAX_SIZE_BYTES) return "File exceeds 8 MB limit.";
  return null;
}

function simpleHash(buffer: Buffer): string {
  let hash = 0;
  for (let i = 0; i < buffer.length && i < 65536; i++) {
    hash = ((hash << 5) - hash + buffer[i]) | 0;
  }
  return `h_${Math.abs(hash).toString(16).padStart(8, "0")}`;
}

function stripExif(buffer: Buffer, mime: string): Buffer {
  if (mime !== "image/jpeg" && mime !== "jpeg") return buffer;
  const APP1_MARKER = 0xffe1;
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === 0xff && buffer[i + 1] === 0xe1) {
      const segLen = buffer.readUInt16BE(i + 2) + 2;
      return Buffer.concat([buffer.subarray(0, i), buffer.subarray(i + segLen)]);
    }
  }
  return buffer;
}

/* ── Main handler ── */

export async function POST(req: Request) {
  try {
    /* ── 1. Auth gate ── */
    const token = parseBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Authentication required. Sign in to use AI Photo Diagnosis." },
        { status: 401 }
      );
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired authentication token." },
        { status: 401 }
      );
    }

    /* ── 2. Product usage gate ── */
    const isOwner = user.email ? isProBypassEmail(user.email) : false;

    if (!isOwner) {
      const hasUsage = await checkProductUsage(user.uid, PRODUCT_KEY);
      if (!hasUsage) {
        const grantResult = await grantProductUsesFromCredits(user.uid, PRODUCT_KEY);
        if (!grantResult.ok) {
          return NextResponse.json(
            {
              ok: false,
              error: "INSUFFICIENT_CREDITS",
              message: "2 Diagnostic Credits are required for AI Photo Diagnosis.",
              credits_required: 2,
              usage_grant: 3,
            },
            { status: 402 }
          );
        }
      }
    }

    /* ── 3. Rate limit ── */
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded. Max 10 requests per hour." },
        { status: 429 }
      );
    }

    /* ── 4. Parse body ── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const reqBody = body as { photos?: string[]; mime_types?: string[]; problem_note?: string };
    const rawPhotos: string[] = Array.isArray(reqBody.photos) ? reqBody.photos : [];
    const mimeTypes: string[] = Array.isArray(reqBody.mime_types) ? reqBody.mime_types : [];
    const problemNote: string = typeof reqBody.problem_note === "string" ? reqBody.problem_note.trim() : "";

    if (rawPhotos.length === 0) {
      return NextResponse.json(
        { ok: false, error: "At least one photo is required." },
        { status: 400 }
      );
    }
    if (rawPhotos.length > MAX_PHOTOS) {
      return NextResponse.json(
        { ok: false, error: `Maximum ${MAX_PHOTOS} photos allowed.` },
        { status: 400 }
      );
    }

    /* ── 5. Validate each photo (strip EXIF, hash) ── */
    const validated: PhotoEntry[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rawPhotos.length; i++) {
      const mime = mimeTypes[i] || "image/jpeg";
      let buffer: Buffer;
      try {
        buffer = Buffer.from(rawPhotos[i].split(",").pop() || rawPhotos[i], "base64");
      } catch {
        errors.push(`Photo ${i + 1}: invalid base64 encoding.`);
        continue;
      }

      const validationError = validatePhotoBuffer(buffer, mime);
      if (validationError) {
        errors.push(`Photo ${i + 1}: ${validationError}`);
        continue;
      }

      const cleanBuffer = stripExif(buffer, mime);
      const hash = simpleHash(cleanBuffer);

      validated.push({
        data: `data:${mime};base64,${cleanBuffer.toString("base64")}`,
        mime,
        hash,
      });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Photo validation failed", details: errors },
        { status: 422 }
      );
    }

    /* ── 6. Call OpenAI for visual observation only ── */
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "AI visual service not configured." },
        { status: 400 }
      );
    }

    const imageContents = validated.map((p) => ({
      type: "image_url" as const,
      image_url: { url: p.data, detail: "low" as const },
    }));

    let visualResult: string;
    const userMessage: { type: "text"; text: string }[] = [
      {
        type: "text",
        text: problemNote
          ? `Problem context: ${problemNote}\n\nAnalyze these photos for visible conditions based on the context above. Output only visual observations.`
          : "Analyze these photos for visible conditions. Output only visual observations.",
      },
    ];

    let openAiFailed = false;
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: VISUAL_OBSERVATION_SYSTEM_PROMPT },
            { role: "user", content: [...userMessage, ...imageContents] },
          ],
          max_tokens: 2048,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      visualResult = data.choices?.[0]?.message?.content || "";
      if (!visualResult) throw new Error("OpenAI returned empty response");
    } catch (err) {
      openAiFailed = true;
      // Return fallback — NO use decrement
      return NextResponse.json(
        {
          ok: true,
          mode: "visual_preview",
          uses_consumed: 0,
          remaining_uses: null,
          probable_domain: "UNKNOWN",
          probable_issue_type: "UNKNOWN",
          observations: [
            {
              element: "General assessment",
              observation: "AI visual analysis is temporarily unavailable. Manual inspection is required.",
              confidence: "LOW_CONFIDENCE",
              requires_manual_verification: true,
              concern_level: "MEDIUM",
            },
          ],
          summary: "Visual analysis service encountered an issue. A qualified professional should inspect the equipment directly.",
          photo_quality_note: "Visual analysis could not be completed.",
          recommended_next_steps: [
            "Perform manual visual inspection with a qualified inspector",
            "Document findings with calibrated measurement tools",
            "Initiate a Full Engineering Diagnostic for complete analysis",
          ],
          photo_hashes: validated.map((p) => p.hash),
          ai_available: false,
          disclaimer: "Photo-only diagnostics provide a preliminary visual assessment. For a defensible engineering report, add measurements, tolerance limits, operating context, and cost exposure.",
        },
        { status: 200 }
      );
    }

    /* ── 7. Parse + validate AI output against constraints ── */
    let aiOutput: unknown;
    try {
      const cleaned = visualResult
        .replace(/```json\s*/gi, "")
        .replace(/```/g, "")
        .trim();
      aiOutput = JSON.parse(cleaned);
    } catch {
      aiOutput = null;
    }

    const forbiddenNumericFieldPattern = new RegExp(
      `\\b(${["cost_at_risk", "tolerance_result", "measurement_confidence", "risk_score_numeric", "final_decision", "risk_score", "total_risk_score", "expanded_uncertainty", "decision_state", "tolerance_status"].join("|")})\\b`,
      "i"
    );

    const forbiddenClaimPattern = new RegExp(
      `\\b(${["certified", "guaranteed", "defect-free", "final acceptance", "100%", "zero defect", "legally binding", "approval"].join("|")})\\b`,
      "i"
    );

    const rawText = typeof visualResult === "string" ? visualResult : JSON.stringify(visualResult);
    const hasForbiddenNumeric = forbiddenNumericFieldPattern.test(rawText);
    const hasForbiddenClaim = forbiddenClaimPattern.test(rawText);

    const observations = aiOutput && typeof aiOutput === "object" && !hasForbiddenNumeric && !hasForbiddenClaim
      ? (aiOutput as Record<string, unknown>)
      : null;

    /* ── 8. AI succeeded → decrement 1 product use ── */
    if (!isOwner) {
      await decrementProductUse(user.uid, PRODUCT_KEY);
    }

    const usageDoc = !isOwner ? await getProductUsageDoc(user.uid, PRODUCT_KEY) : null;
    const remainingUses = usageDoc?.remainingUses ?? null;

    return NextResponse.json(
      {
        ok: true,
        mode: "visual_preview",
        uses_consumed: 1,
        remaining_uses: remainingUses,
        probable_domain: (observations && typeof observations.probable_domain === "string" ? observations.probable_domain : "UNKNOWN"),
        probable_issue_type: (observations && typeof observations.probable_issue_type === "string" ? observations.probable_issue_type : "UNKNOWN"),
        observations: observations?.observations || [
          {
            element: "General assessment",
            observation: "Visual analysis was completed. Manual verification is required before any engineering decision.",
            confidence: "MEDIUM_CONFIDENCE",
            requires_manual_verification: true,
            concern_level: "MEDIUM",
          },
        ],
        summary: observations?.summary || "Preliminary visual assessment completed. A Full Engineering Diagnostic is needed for deterministic measurements and cost exposure analysis.",
        photo_quality_note: observations?.photo_quality_note || "Photos were processed and analyzed.",
        recommended_next_steps: observations?.recommended_next_steps || [
          "Perform manual dimensional measurement with calibrated instruments",
          "Document operating parameters and environmental conditions",
          "Initiate a Full Engineering Diagnostic for complete analysis including cost-at-risk and corrective action plan",
        ],
        photo_hashes: validated.map((p) => p.hash),
        ai_available: true,
        disclaimer: "Photo-only diagnostics provide a preliminary visual assessment. For a defensible engineering report, add measurements, tolerance limits, operating context, and cost exposure.",
        requires_upgrade: true,
        locked_features: [
          "Root Cause Analysis",
          "Cost-at-Risk",
          "NCR/CAPA",
          "PDF Report",
          "Verification Record",
          "Dashboard History",
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
