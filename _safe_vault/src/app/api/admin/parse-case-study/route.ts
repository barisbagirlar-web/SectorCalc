import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { callDeepSeekJson } from "@/lib/ai/deepseek/deepseek-client";
import {
  buildCaseStudyParsePrompt,
  validateParsedCaseStudyFromText,
} from "@/lib/case-studies/parse-case-study-from-text";
import { isSupportedLocale } from "@/lib/i18n/locale-config";
import { requireAdminFromRequest } from "@/lib/firebase/verify-admin-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_TEXT_LENGTH = 20;
const MAX_TEXT_LENGTH = 12_000;

type ParseCaseStudyRequestBody = {
  readonly text?: unknown;
  readonly sourceLocale?: unknown;
};

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "PARSE_FAILED" }, { status: 400 });
  }

  const record = (body ?? {}) as ParseCaseStudyRequestBody;
  const text = typeof record.text === "string" ? record.text.trim() : "";
  const sourceLocale =
    typeof record.sourceLocale === "string" && isSupportedLocale(record.sourceLocale)
      ? record.sourceLocale
      : "en";

  if (text.length < MIN_TEXT_LENGTH) {
    return NextResponse.json({ success: false, error: "TEXT_TOO_SHORT" }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { success: false, error: "TEXT_TOO_LONG", maxLength: MAX_TEXT_LENGTH },
      { status: 400 },
    );
  }

  const result = await callDeepSeekJson(
    "content_draft",
    [
      {
        role: "system",
        content: "You are an industrial case study parser. Output only valid JSON.",
      },
      { role: "user", content: buildCaseStudyParsePrompt(text, sourceLocale) },
    ],
    validateParsedCaseStudyFromText,
  );

  if (!result.ok) {
    const error =
      result.errorCode === "missing_api_key"
        ? "MISSING_API_KEY"
        : "PARSE_FAILED";
    return NextResponse.json(
      { success: false, error, message: result.message },
      { status: error === "MISSING_API_KEY" ? 503 : 500 },
    );
  }

  return NextResponse.json({ success: true, sourceLocale, ...result.data });
}
