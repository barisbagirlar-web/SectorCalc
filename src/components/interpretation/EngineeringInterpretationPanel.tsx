"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { EngineeringInterpretation, InterpretationRecommendation, InterpretationRisk, OutputInterpretation, InterpretPremiumResultRequest } from "@/lib/ai/engineering-interpretation/types";

type PanelState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: EngineeringInterpretation }
  | { status: "error"; error: string; fallbackMessage: string };

type EngineeringInterpretationPanelProps = {
  readonly request: InterpretPremiumResultRequest;
  /** Signal to trigger interpretation fetch */
  readonly shouldFetch: boolean;
  /** Called when interpretation fetch completes */
  readonly onComplete?: () => void;
};

const SIGNIFICANCE_COLORS: Record<OutputInterpretation["significance"], string> = {
  critical: "text-red-700 bg-red-50 border-red-200",
  significant: "text-amber-700 bg-amber-50 border-amber-200",
  notable: "text-blue-700 bg-blue-50 border-blue-200",
  informational: "text-slate-600 bg-slate-50 border-slate-200",
};

const SEVERITY_COLORS: Record<InterpretationRisk["severity"], string> = {
  high: "text-red-700 bg-red-50 border-red-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  low: "text-slate-600 bg-slate-50 border-slate-200",
};

const PRIORITY_LABELS: Record<InterpretationRecommendation["priority"], string> = {
  immediate: "Immediate",
  short_term: "Short-term",
  long_term: "Long-term",
};

const PRIORITY_COLORS: Record<InterpretationRecommendation["priority"], string> = {
  immediate: "text-white bg-red-600",
  short_term: "text-white bg-amber-600",
  long_term: "text-white bg-blue-600",
};

const CONFIDENCE_CLASS: Record<string, string> = {
  high: "text-green-700 bg-green-50 border-green-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  low: "text-slate-600 bg-slate-50 border-slate-200",
};

function SignificanceBadge({ significance }: { significance: OutputInterpretation["significance"] }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide ${SIGNIFICANCE_COLORS[significance]}`}>
      {significance}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: InterpretationRisk["severity"] }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide ${SEVERITY_COLORS[severity]}`}>
      {severity}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: InterpretationRecommendation["priority"] }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide ${PRIORITY_COLORS[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-32 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-2/3 bg-slate-100 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-28 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-5/6 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export function EngineeringInterpretationPanel({
  request,
  shouldFetch,
  onComplete,
}: EngineeringInterpretationPanelProps) {
  const t = useTranslations("engineeringInterpretation");
  const [state, setState] = useState<PanelState>({ status: "idle" });
  const fetchRef = useRef(false);

  const fetchInterpretation = useCallback(async () => {
    if (fetchRef.current) return;
    fetchRef.current = true;

    setState({ status: "loading" });

    try {
      const response = await fetch("/api/ai/interpret-premium-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const result = await response.json() as { ok: boolean; interpretation?: EngineeringInterpretation; error?: string; fallbackMessage?: string };

      if (result.ok && result.interpretation) {
        setState({ status: "loaded", data: result.interpretation });
      } else {
        setState({
          status: "error",
          error: result.error ?? "Unknown error",
          fallbackMessage: result.fallbackMessage ?? "Interpretation unavailable.",
        });
      }
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : String(err),
        fallbackMessage: "Network error. Please check your connection and try again.",
      });
    } finally {
      fetchRef.current = false;
      onComplete?.();
    }
  }, [request, onComplete]);

  useEffect(() => {
    if (shouldFetch && state.status === "idle") {
      fetchInterpretation();
    }
  }, [shouldFetch, state.status, fetchInterpretation]);

  const handleRetry = () => {
    fetchRef.current = false;
    setState({ status: "idle" });
    setTimeout(() => fetchInterpretation(), 100);
  };

  if (state.status === "idle" || state.status === "loading") {
    return (
      <section className="sc-premium-decision-report__section" aria-label={t("tabLabel")}>
        <h3 className="sc-premium-decision-report__heading">{t("tabLabel")}</h3>
        {state.status === "loading" ? (
          <div className="mt-3">
            <LoadingSkeleton />
            <p className="mt-3 text-xs text-slate-400">{t("generating")}</p>
          </div>
        ) : null}
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="sc-premium-decision-report__section" aria-label={t("tabLabel")}>
        <h3 className="sc-premium-decision-report__heading">{t("tabLabel")}</h3>
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-900">{t("unavailable")}</p>
          <p className="mt-1 text-xs text-amber-700">{state.fallbackMessage}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-md bg-amber-100 px-4 py-2 text-xs font-medium text-amber-900 hover:bg-amber-200"
          >
            {t("retry")}
          </button>
        </div>
      </section>
    );
  }

  const { data } = state;

  return (
    <section className="sc-premium-decision-report__section" aria-label={t("tabLabel")}>
      <h3 className="sc-premium-decision-report__heading">{t("tabLabel")}</h3>

      {/* Confidence indicator */}
      <div className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide ${CONFIDENCE_CLASS[data.confidence]}`}>
        {t(`confidence.${data.confidence}`)}
      </div>

      {/* Executive Summary */}
      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("executiveSummary")}</h4>
        <p className="text-sm leading-relaxed text-slate-800">{data.executiveSummary}</p>
      </div>

      {/* Output Analyses */}
      {data.outputAnalyses.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("outputAnalyses")}</h4>
          <div className="space-y-2">
            {data.outputAnalyses.map((analysis) => (
              <div
                key={analysis.outputId}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{analysis.label}</span>
                  <SignificanceBadge significance={analysis.significance} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{analysis.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Risk Assessment */}
      {data.riskAssessment.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("riskAssessment")}</h4>
          <div className="space-y-2">
            {data.riskAssessment.map((risk, index) => (
              <div
                key={`risk-${index}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{risk.factor}</span>
                  <SeverityBadge severity={risk.severity} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{risk.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Recommendations */}
      {data.recommendations.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("recommendations")}</h4>
          <div className="space-y-2">
            {data.recommendations.map((rec, index) => (
              <div
                key={`rec-${index}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{rec.action}</span>
                  <PriorityBadge priority={rec.priority} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-700">Expected impact: </span>
                  {rec.expectedImpact}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Field Notes */}
      {data.fieldNotes.length > 0 ? (
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("fieldNotes")}</h4>
          <ul className="list-inside list-disc space-y-1">
            {data.fieldNotes.map((note, index) => (
              <li key={`note-${index}`} className="text-xs leading-relaxed text-slate-600">
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
