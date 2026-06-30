"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { CreateApprovedReportInput, ApprovedReportPayload } from "@/lib/features/trust-trace/types";
import { ValidationStamp } from "./ValidationStamp";
import { TrustTraceSummary } from "./TrustTraceSummary";
import { ApprovedReportActions } from "./ApprovedReportActions";

type Props = {
  toolSlug: string;
  toolType: "free" | "premium" | "unknown";
  locale: string;
  routePath: string;
  formulaVersion?: string;
  formulaContractId?: string;
  inputSnapshot?: Record<string, unknown>;
  resultSnapshot?: Record<string, unknown>;
  userId?: string | null;
  userEmail?: string | null;
  /** If false, show a locked/upgrade CTA instead */
  isEligible?: boolean;
};

export function ApprovedReportPanel({
  toolSlug,
  toolType,
  locale,
  routePath,
  formulaVersion = "1.0.0",
  formulaContractId,
  inputSnapshot,
  resultSnapshot,
  userId,
  userEmail,
  isEligible = true,
}: Props) {
  const t = useTranslations("verify");
  const [state, setState] = useState<
    "idle" | "creating" | "done" | "error"
  >("idle");
  const [report, setReport] = useState<ApprovedReportPayload | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isEligible) {
    return (
      <div
        data-trust-trace-summary="true"
        data-calculation-summary="false"
        className="rounded-md border border-gray-200 bg-gray-50 p-3 text-center text-xs text-gray-500"
      >
        <p className="font-medium text-gray-700">{t("premiumSummary")}</p>
        <p className="mt-1">
          {t("upgradeToSave")}
        </p>
      </div>
    );
  }

  async function handleCreate() {
    setState("creating");
    setErrorMsg(null);
    try {
      const payload: CreateApprovedReportInput = {
        toolSlug,
        toolType,
        locale,
        routePath,
        formulaVersion,
        formulaContractId,
        inputSnapshot: inputSnapshot ?? {},
        resultSnapshot: resultSnapshot ?? {},
        userId: userId ?? null,
        userEmail: userEmail ?? null,
      };

      const res = await fetch("/api/reports/approved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data?.error ?? "create_failed");
        setState("error");
        return;
      }

      const data = await res.json();

      // Reconstruct a minimal ApprovedReportPayload for display
      const displayReport: ApprovedReportPayload = {
        id: data.reportId,
        reportId: data.reportId,
        calculationHash: data.calculationHash,
        validationStampId: data.validationStampId,
        qrTargetUrl: data.verifyUrl,
        toolSlug,
        toolType,
        locale,
        routePath,
        formulaVersion,
        formulaContractId,
        inputSnapshot: inputSnapshot ?? {},
        resultSnapshot: resultSnapshot ?? {},
        publicSummary: {
          toolSlug,
          toolType,
          formulaVersion,
          issuedAt: data.issuedAt,
          validationStampId: data.validationStampId,
        },
        auditTrail: [],
        status: "issued",
        visibility: "public_verify",
        issuedAt: data.issuedAt,
        updatedAt: data.issuedAt,
        userId: userId ?? null,
        userEmail: null,
        disclaimerVersion: "1.0",
      };

      setReport(displayReport);
      setState("done");
    } catch {
      setErrorMsg("create_failed");
      setState("error");
    }
  }

  if (state === "done" && report) {
    return (
      <div
        data-trust-trace-summary="true"
        className="space-y-3"
      >
        <ValidationStamp report={report} locale={locale} />
        <TrustTraceSummary report={report} />
        <ApprovedReportActions report={report} />
      </div>
    );
  }

  return (
    <div
      data-trust-trace-summary="true"
      data-calculation-summary="pending"
      className="rounded-md border border-gray-200 bg-gray-50 p-3"
    >
      <p className="text-sm font-medium text-gray-700">{t("saveSummary")}</p>
      <p className="mt-1 text-xs text-gray-500">
        {t("saveSummaryDesc")}
      </p>
      {state === "error" && errorMsg && (
        <p className="mt-1 text-xs text-red-600">
          {errorMsg === "auth_required"
            ? t("signInToSave")
            : t("saveFailed")}
        </p>
      )}
      <button
        type="button"
        disabled={state === "creating"}
        onClick={handleCreate}
        className="mt-2 inline-flex items-center gap-1.5 rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {state === "creating" ? t("saving") : t("saveSummary")}
      </button>
    </div>
  );
}
