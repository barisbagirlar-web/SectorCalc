import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import {
  getCalculationReportCopy,
} from "@/lib/email/calculation-report-email-copy";
import { sendCalculationReportEmail } from "@/lib/email/send-calculation-report-email";
import {
  buildPdfExportLeadInput,
  isValidPdfExportEmail,
  savePdfExportLeadServer,
} from "@/lib/leads/save-pdf-export-lead-server";
import {
  buildCalculationReportFileName,
  type CalculationReportRow,
} from "@/lib/pdf/calculation-report-types";
import { renderCalculationReportPdf } from "@/lib/pdf/render-calculation-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = new Map<string, number>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const MAX_ROWS = 40;
const MAX_LABEL_LENGTH = 120;
const MAX_VALUE_LENGTH = 120;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const last = RATE_LIMIT.get(ip) ?? 0;
  if (now - last < RATE_WINDOW_MS / RATE_MAX) {
    return false;
  }
  RATE_LIMIT.set(ip, now);
  return true;
}

function sanitizeRows(value: unknown): CalculationReportRow[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const rows: CalculationReportRow[] = [];
  for (const item of value.slice(0, MAX_ROWS)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      continue;
    }
    const record = item as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label.trim().slice(0, MAX_LABEL_LENGTH) : "";
    const rowValue = typeof record.value === "string" ? record.value.trim().slice(0, MAX_VALUE_LENGTH) : "";
    if (!label || !rowValue) {
      continue;
    }
    rows.push({ label, value: rowValue });
  }
  return rows;
}

function sanitizePrimaryResult(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim().slice(0, MAX_VALUE_LENGTH);
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  if (typeof payload.honeypot === "string" && payload.honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof payload.email === "string" ? payload.email : "";
  if (!isValidPdfExportEmail(email)) {
    return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
  }

  const toolName = typeof payload.toolName === "string" ? payload.toolName.trim().slice(0, 160) : "";
  const toolSlug = typeof payload.toolSlug === "string" ? payload.toolSlug.trim().slice(0, 120) : "";
  const localeRaw = typeof payload.locale === "string" ? payload.locale : "en";
  const locale: AppLocale = isAppLocale(localeRaw) ? localeRaw : "en";
  const pagePath = typeof payload.pagePath === "string" ? payload.pagePath.trim().slice(0, 240) : "/";
  const primaryResult = sanitizePrimaryResult(payload.primaryResult);

  if (!toolName || !toolSlug || !primaryResult) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const inputRows = sanitizeRows(payload.inputRows);
  const breakdownRows = sanitizeRows(payload.breakdownRows);
  if (inputRows.length === 0) {
    return NextResponse.json({ ok: false, error: "missing_inputs" }, { status: 400 });
  }

  const copy = getCalculationReportCopy(locale);
  const generatedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  try {
    const pdfBuffer = await renderCalculationReportPdf({
      toolName,
      locale,
      copy,
      inputRows,
      primaryResult,
      breakdownRows,
      generatedAt,
    });

    const fileName = buildCalculationReportFileName(toolName);
    const emailResult = await sendCalculationReportEmail({
      to: email.trim().toLowerCase(),
      toolName,
      locale,
      pdfBuffer,
      fileName,
    });

    if (!emailResult.ok) {
      const status = emailResult.error === "email_not_configured" ? 503 : 500;
      return NextResponse.json({ ok: false, error: emailResult.error }, { status });
    }

    const leadInput = buildPdfExportLeadInput({
      email,
      toolName,
      toolSlug,
      locale,
      pagePath,
    });
    await savePdfExportLeadServer({ ...leadInput, toolSlug });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "pdf_generation_failed" }, { status: 500 });
  }
}
