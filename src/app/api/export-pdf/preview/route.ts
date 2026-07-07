// POST /api/export-pdf/preview
// No auth, no credit. Generates a watermarked PDF preview.
// Collects lead email before returning the PDF.
// Rate-limited: 5 req/hour per IP.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getCalculationReportCopy,
} from "@/lib/infrastructure/email/calculation-report-email-copy";
import {
  buildPdfExportLeadInput,
  isValidPdfExportEmail,
  savePdfExportLeadServer,
} from "@/lib/features/leads/save-pdf-export-lead-server";
import {
  buildCalculationReportFileName,
  type CalculationReportRow,
} from "@/lib/content/pdf/calculation-report-types";
import { renderCalculationReportPdf } from "@/lib/content/pdf/render-calculation-report";
import { isAppLocale } from "@/i18n/routing";
import { addWatermark } from "@/lib/pdf/watermark";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Rate limit: 5 req/hour per IP ──────────────────────────────
const RATE_MAP = new Map<string, number[]>();
const RATE_WINDOW_MS = 3_600_000; // 1 hour
const RATE_MAX = 5;

function checkPreviewRateLimit(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const timestamps = RATE_MAP.get(ip) ?? [];
  const recent = timestamps.filter((t) => t > cutoff);
  if (recent.length >= RATE_MAX) return false;
  recent.push(now);
  RATE_MAP.set(ip, recent);
  return true;
}

// ── Sanitizers (mirror existing export-pdf/route.ts) ────────────
const MAX_ROWS = 40;
const MAX_LABEL_LENGTH = 120;
const MAX_VALUE_LENGTH = 120;

function sanitizeRows(value: unknown): CalculationReportRow[] {
  if (!Array.isArray(value)) return [];
  const rows: CalculationReportRow[] = [];
  for (const item of value.slice(0, MAX_ROWS)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const record = item as Record<string, unknown>;
    const label =
      typeof record.label === "string"
        ? record.label.trim().slice(0, MAX_LABEL_LENGTH)
        : "";
    const rowValue =
      typeof record.value === "string"
        ? record.value.trim().slice(0, MAX_VALUE_LENGTH)
        : "";
    if (!label || !rowValue) continue;
    rows.push({ label, value: rowValue });
  }
  return rows;
}

function sanitizePrimaryResult(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
  return trimmed.length > 0 ? trimmed : null;
}

// ── POST handler ────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  /* ── Rate limit ────────────────────────────────────────────── */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!checkPreviewRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  /* ── Parse body ────────────────────────────────────────────── */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  const payload = body as Record<string, unknown>;
  const email = typeof payload.email === "string" ? payload.email : "";
  if (!isValidPdfExportEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "email_required" },
      { status: 400 },
    );
  }

  const toolName =
    typeof payload.toolName === "string"
      ? payload.toolName.trim().slice(0, 160)
      : "";
  const toolSlug =
    typeof payload.toolSlug === "string"
      ? payload.toolSlug.trim().slice(0, 120)
      : "";
  const localeRaw = typeof payload.locale === "string" ? payload.locale : "en";
  const pagePath =
    typeof payload.pagePath === "string"
      ? payload.pagePath.trim().slice(0, 240)
      : "/";
  const primaryResult = sanitizePrimaryResult(payload.primaryResult);

  // Allow missing primaryResult in preview (partial data)
  const inputRows = sanitizeRows(payload.inputRows);
  const breakdownRows = sanitizeRows(payload.breakdownRows);
  if (inputRows.length === 0) {
    return NextResponse.json(
      { ok: false, error: "missing_inputs" },
      { status: 400 },
    );
  }

  /* ── Save lead first ───────────────────────────────────────── */
  const leadInput = buildPdfExportLeadInput({
    email,
    toolName: toolName || "Engineering Calculator",
    toolSlug,
    locale: localeRaw,
    pagePath,
  });
  await savePdfExportLeadServer({ ...leadInput, toolSlug });

  /* ── Generate watermarked PDF ──────────────────────────────── */
  try {
    const displayName = toolName || "Engineering Calculator";
    const displayResult = primaryResult || "Preview";
    const localizedLocale = isAppLocale(localeRaw) ? localeRaw : "en";
    const copy = getCalculationReportCopy(localizedLocale);
    const generatedAt = new Intl.DateTimeFormat(localizedLocale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    const pdfBuffer = await renderCalculationReportPdf({
      toolName: displayName,
      locale: localizedLocale,
      copy,
      inputRows,
      primaryResult: displayResult,
      breakdownRows,
      generatedAt,
    });

    const watermarked = await addWatermark(pdfBuffer);

    return new Response(new Uint8Array(watermarked), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${buildCalculationReportFileName(displayName)}"`,
        "X-Pdf-Type": "preview-watermarked",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "pdf_generation_failed" },
      { status: 500 },
    );
  }
}
