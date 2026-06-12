import { collectLocaleKeyParityGaps } from "@/lib/locale-center/locale-dictionary";
import {
  EN_RENDERED_FORBIDDEN_RE,
  INTERNAL_PUBLIC_FORBIDDEN_ANY_LOCALE,
  TR_RENDERED_FORBIDDEN_RE,
} from "@/lib/locale-center/internal-copy-blocklist";
import { SUPPORTED_LOCALES } from "@/lib/locale-center/locale-config";

export type LocaleIntegrityIssue = {
  readonly code: string;
  readonly message: string;
  readonly severity: "error" | "warning";
};

export type LocaleIntegrityReport = {
  readonly generatedAt: string;
  readonly localeKeyGaps: number;
  readonly issues: readonly LocaleIntegrityIssue[];
  readonly passed: boolean;
};

function scanTextForForbidden(
  html: string,
  locale: string,
): LocaleIntegrityIssue[] {
  const issues: LocaleIntegrityIssue[] = [];

  if (locale === "tr") {
    const matches = html.match(TR_RENDERED_FORBIDDEN_RE);
    if (matches) {
      const unique = [...new Set(matches)];
      for (const term of unique) {
        issues.push({
          code: "tr-forbidden-term",
          message: `TR rendered HTML contains forbidden term: ${term}`,
          severity: "error",
        });
      }
    }
  }

  if (locale === "en") {
    const matches = html.match(EN_RENDERED_FORBIDDEN_RE);
    if (matches) {
      const unique = [...new Set(matches)];
      for (const term of unique) {
        issues.push({
          code: "en-forbidden-term",
          message: `EN rendered HTML contains forbidden Turkish term: ${term}`,
          severity: "error",
        });
      }
    }
  }

  for (const term of INTERNAL_PUBLIC_FORBIDDEN_ANY_LOCALE) {
    if (html.includes(term)) {
      issues.push({
        code: "internal-leak",
        message: `Rendered HTML contains internal marker: ${term}`,
        severity: "error",
      });
    }
  }

  if (locale === "ar") {
    const hasRtl = html.includes('dir="rtl"') || html.includes("dir=\\\"rtl\\\"");
    const hasLang = html.includes('lang="ar"') || html.includes("lang=\\\"ar\\\"");
    if (!hasRtl || !hasLang) {
      issues.push({
        code: "ar-rtl",
        message: "AR page missing dir=rtl or lang=ar",
        severity: "error",
      });
    }
  }

  return issues;
}

export function buildLocaleIntegrityReport(htmlByRoute?: Record<string, string>): LocaleIntegrityReport {
  const issues: LocaleIntegrityIssue[] = [];
  const gaps = collectLocaleKeyParityGaps();

  if (gaps.length > 0) {
    issues.push({
      code: "key-parity",
      message: `${gaps.length} message key(s) missing across locales`,
      severity: "error",
    });
  }

  if (htmlByRoute) {
    for (const [route, html] of Object.entries(htmlByRoute)) {
      const locale = route.split("/").filter(Boolean)[0] ?? "en";
      if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
        continue;
      }
      issues.push(...scanTextForForbidden(html, locale));
    }
  }

  const errors = issues.filter((issue) => issue.severity === "error");

  return {
    generatedAt: new Date().toISOString(),
    localeKeyGaps: gaps.length,
    issues,
    passed: errors.length === 0,
  };
}

export function formatLocaleIntegrityReport(report: LocaleIntegrityReport): string {
  const lines = [
    `Locale Integrity Report — ${report.generatedAt}`,
    `Key parity gaps: ${report.localeKeyGaps}`,
    `Issues: ${report.issues.length}`,
  ];

  for (const issue of report.issues) {
    lines.push(`[${issue.severity.toUpperCase()}] ${issue.code}: ${issue.message}`);
  }

  lines.push(report.passed ? "RESULT: PASS" : "RESULT: FAIL");
  return lines.join("\n");
}
