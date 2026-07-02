"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, ShieldX, ExternalLink, Hash, Stamp, FileText, Calendar, CheckCircle, XCircle } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";

/* ── Types matching /api/verify/[hash] response ── */

type VerifyApiSuccess = {
  verified: true;
  hash: string;
  reportId: string;
  toolSlug: string;
  validationStampId: string;
  timestamp: string;
  message?: string;
  publicSummary?: {
    toolSlug: string;
    toolType: string;
    formulaVersion: string;
    issuedAt: string;
    validationStampId: string;
  };
};

type VerifyApiNotFound = {
  verified: false;
  hash: string;
  message?: string;
  timestamp?: string;
};

type VerifyApiRevoked = {
  verified: false;
  message?: string;
  hash: string;
  reportId?: string;
  timestamp?: string;
};

type VerifyApiHashMismatch = {
  verified: false;
  status: "hash_mismatch";
  message?: string;
  hash: string;
  reportId: string;
  timestamp: string;
};

type VerifyApiResult = VerifyApiSuccess | VerifyApiNotFound | VerifyApiRevoked | VerifyApiHashMismatch;

type StatusBadgeProps = {
  readonly variant: "verified" | "not_found" | "revoked" | "hash_mismatch" | "loading";
  readonly label: string;
};

/* ── Status badge ── */

function StatusBadge({ variant, label }: StatusBadgeProps) {
  const config = {
    verified: { icon: ShieldCheck, bg: "bg-emerald-50 border-emerald-300", text: "text-emerald-800" },
    not_found: { icon: ShieldAlert, bg: "bg-amber-50 border-amber-300", text: "text-amber-800" },
    revoked: { icon: ShieldX, bg: "bg-red-50 border-red-300", text: "text-red-800" },
    hash_mismatch: { icon: ShieldX, bg: "bg-red-50 border-red-300", text: "text-red-800" },
    loading: { icon: ShieldCheck, bg: "bg-gray-50 border-gray-200", text: "text-gray-500" },
  } as const;

  const { icon: Icon, bg, text } = config[variant];

  return (
    <div className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-semibold tracking-wider uppercase ${bg} ${text}`}>
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

/* ── Metadata row ── */

function MetaRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
        <p className="break-all font-mono text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
}

/* ── Skeleton loader ── */

function SkeletonCard() {
  return (
    <div className="mx-auto max-w-lg animate-pulse">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 h-8 w-48 rounded bg-gray-100" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
          <div className="h-4 w-5/6 rounded bg-gray-100" />
          <div className="h-4 w-2/3 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

/* ── Main verification card ── */

type TrustTraceVerificationCardProps = {
  readonly hash: string;
};

export function TrustTraceVerificationCard({ hash }: TrustTraceVerificationCardProps) {
  const t = useTranslations("verify");
  const locale = useLocale() as AppLocale;
  const [result, setResult] = useState<VerifyApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch(`/api/verify/${encodeURIComponent(hash)}`);
        const data = (await res.json()) as VerifyApiResult;
        if (!cancelled) {
          setResult(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(t("errorMessage"));
          setLoading(false);
        }
      }
    }

    verify();
    return () => { cancelled = true; };
  }, [hash, t]);

  if (loading) return <SkeletonCard />;

  if (error) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-red-800">{t("errorTitle")}</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-medium text-red-700 underline underline-offset-2 hover:text-red-900"
              >
                {t("actionRetry")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return <SkeletonCard />;

  /* ── NOT FOUND ── */
  if (result.verified === false && !("reportId" in result)) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <StatusBadge variant="not_found" label={t("notFoundBadge")} />
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              {result.message ?? t("notFoundMessage")}
            </p>
            {result.hash ? (
              <p className="mt-2 break-all font-mono text-xs text-amber-700">
                {t("notFoundHash", { hash: result.hash })}
              </p>
            ) : null}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            {t("notFoundHelp")}
          </p>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("actionManualVerify")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── HASH MISMATCH ── */
  if (result.verified === false && "status" in result && result.status === "hash_mismatch") {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <StatusBadge variant="hash_mismatch" label={t("hashMismatchBadge")} />
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-900">
              {result.message ?? t("hashMismatchMessage")}
            </p>
          </div>
          <div className="mt-4 divide-y divide-gray-100 border-t border-b border-gray-100">
            <MetaRow icon={FileText} label={t("labelReportId")} value={result.reportId} />
            <MetaRow icon={Hash} label={t("labelHash", { hash: result.hash })} value={result.hash} />
          </div>
          {result.timestamp ? (
            <MetaRow icon={Calendar} label={t("originallyIssued")} value={new Date(result.timestamp).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })} />
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            {t("hashMismatchHelp")}
          </p>
        </div>
      </div>
    );
  }

  /* ── REVOKED ── */
  if (result.verified === false && "reportId" in result && result.reportId) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <StatusBadge variant="revoked" label={t("revokedBadge")} />
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-900">
              {result.message ?? t("revokedMessage")}
            </p>
          </div>
          {result.reportId ? (
            <MetaRow icon={FileText} label={t("labelReportId")} value={result.reportId} />
          ) : null}
          {result.timestamp ? (
            <MetaRow icon={Calendar} label={t("originallyIssued")} value={new Date(result.timestamp).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })} />
          ) : null}
          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            {t("revokedHelp")}
          </p>
        </div>
      </div>
    );
  }

  /* ── VERIFIED ── */
  if (result.verified === true) {
    const ps = result.publicSummary;
    const issuedDate = ps?.issuedAt ?? result.timestamp;
    const dateDisplay = issuedDate
      ? new Date(issuedDate).toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Verified seal */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <StatusBadge variant="verified" label={t("verifiedBadge")} />
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>

          {/* Hero message */}
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-medium text-emerald-900">
              {t("verifiedMessage")}
            </p>
          </div>

          {/* Metadata */}
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            <MetaRow icon={FileText} label={t("labelReportId")} value={result.reportId} />
            <MetaRow icon={Hash} label={t("labelTool")} value={result.toolSlug} />
            {ps?.formulaVersion ? (
              <MetaRow icon={FileText} label={t("labelFormulaVersion")} value={ps.formulaVersion} />
            ) : null}
            {result.validationStampId ? (
              <MetaRow icon={Stamp} label={t("labelValidationStamp")} value={result.validationStampId} />
            ) : null}
            {issuedDate ? (
              <MetaRow icon={Calendar} label={t("labelIssuedAt")} value={dateDisplay} />
            ) : null}
          </div>

          {/* Hash footer */}
          <p className="mt-4 break-all font-mono text-xs text-gray-400">
            {t("labelHash", { hash: result.hash })}
          </p>

          {/* Re-verify */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("actionVerifyAnother")}
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
          {t("footerNote")}
        </p>
      </div>
    );
  }

  return <SkeletonCard />;
}
