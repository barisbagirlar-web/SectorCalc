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
  readonly shouldFetch: boolean;
  readonly onComplete?: () => void;
};

/* ── Industrial color tokens ── */

const SIGNIFICANCE_COLORS: Record<OutputInterpretation["significance"], string> = {
  critical: "text-red-800 bg-red-50 border-red-300",
  significant: "text-amber-800 bg-amber-50 border-amber-300",
  notable: "text-blue-800 bg-blue-50 border-blue-300",
  informational: "text-slate-600 bg-slate-100 border-slate-300",
};

const SEVERITY_COLORS: Record<InterpretationRisk["severity"], string> = {
  high: "text-red-800 bg-red-50 border-red-300",
  medium: "text-amber-800 bg-amber-50 border-amber-300",
  low: "text-slate-600 bg-slate-100 border-slate-300",
};

const PRIORITY_LABELS: Record<InterpretationRecommendation["priority"], string> = {
  immediate: "Acil / Immediate",
  short_term: "Kısa Vade / Short-term",
  long_term: "Uzun Vade / Long-term",
};

const PRIORITY_COLORS: Record<InterpretationRecommendation["priority"], string> = {
  immediate: "text-white bg-red-700",
  short_term: "text-white bg-amber-600",
  long_term: "text-white bg-blue-700",
};

const CONFIDENCE_CLASS: Record<string, string> = {
  high: "text-emerald-800 bg-emerald-50 border-emerald-300",
  medium: "text-amber-800 bg-amber-50 border-amber-300",
  low: "text-slate-600 bg-slate-100 border-slate-300",
};

/** Known field-note category prefixes — used for visual labeling */
const FN_CATEGORY_PATTERNS: Array<{
  labelKey: string;
  patterns: RegExp[];
}> = [
  {
    labelKey: "fieldNoteAssumptions",
    patterns: [/assumption/i, /varsayım/i, /annahme/i, /hypothèse/i, /supuesto/i, /افتراض/i],
  },
  {
    labelKey: "fieldNoteDataQuality",
    patterns: [/data quality/i, /veri kalitesi/i, /datengüte/i, /qualité des données/i, /calidad de datos/i, /جودة البيانات/i],
  },
  {
    labelKey: "fieldNoteExpertConsult",
    patterns: [/expert/i, /uzman/i, /fachmann/i, /spécialiste/i, /perito/i, /خبير/i, /consult/i, /danış/i],
  },
  {
    labelKey: "fieldNoteBoundary",
    patterns: [/boundary/i, /sınır/i, /grenze/i, /limite/i, /límite/i, /حد/i, /range/i, /aralık/i, /bereich/i],
  },
  {
    labelKey: "fieldNoteNextDepth",
    patterns: [/next step/i, /sonraki adım/i, /nächster/i, /prochaine/i, /siguiente/i, /الخطوة/i, /phase 2/i, /faz 2/i, /additional/i, /ek/i],
  },
  {
    labelKey: "fieldNoteRegulatory",
    patterns: [/regulat/i, /yönetmelik/i, /vorschrift/i, /réglement/i, /reglamento/i, /لائحة/i, /iso/i, /ansi/i, /din/i, /astm/i, /standard/i],
  },
];

/* ── Sub-components ── */

function SignificanceBadge({ significance }: { significance: OutputInterpretation["significance"] }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${SIGNIFICANCE_COLORS[significance]}`}>
      {significance}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: InterpretationRisk["severity"] }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${SEVERITY_COLORS[severity]}`}>
      {severity}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: InterpretationRecommendation["priority"] }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${PRIORITY_COLORS[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-hidden="true">
      {/* executive summary skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-11/12 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-4/5 bg-slate-200 rounded" />
      </div>
      {/* output analyses skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-36 bg-slate-200 rounded" />
        <div className="h-20 w-full bg-slate-100 rounded" />
        <div className="h-20 w-full bg-slate-100 rounded" />
      </div>
      {/* risk skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-16 w-full bg-slate-100 rounded" />
        <div className="h-16 w-full bg-slate-100 rounded" />
      </div>
    </div>
  );
}

function FieldNoteCard({
  note,
  index,
  locale,
}: {
  note: string;
  index: number;
  locale: string;
}) {
  /* Detect category from content */
  const matched = FN_CATEGORY_PATTERNS.find((cat) =>
    cat.patterns.some((p) => p.test(note)),
  );

  const CATEGORY_LABELS: Record<string, string> = {
    fieldNoteAssumptions:
      locale === "tr" ? "Model Varsayımları" :
      locale === "de" ? "Modellannahmen" :
      locale === "fr" ? "Hypothèses du Modèle" :
      locale === "es" ? "Supuestos del Modelo" :
      locale === "ar" ? "افتراضات النموذج" :
      "Model Assumptions",

    fieldNoteDataQuality:
      locale === "tr" ? "Veri Kalitesi" :
      locale === "de" ? "Datenqualität" :
      locale === "fr" ? "Qualité des Données" :
      locale === "es" ? "Calidad de los Datos" :
      locale === "ar" ? "جودة البيانات" :
      "Data Quality",

    fieldNoteExpertConsult:
      locale === "tr" ? "Uzman Görüşü Gerekiyor" :
      locale === "de" ? "Expertenrat Erforderlich" :
      locale === "fr" ? "Avis d'Expert Requis" :
      locale === "es" ? "Se Requiere Opinión de Experto" :
      locale === "ar" ? "استشارة خبير مطلوبة" :
      "Expert Consultation Required",

    fieldNoteBoundary:
      locale === "tr" ? "Sınır Koşulları ve Geçerlilik Aralığı" :
      locale === "de" ? "Grenzbedingungen und Gültigkeitsbereich" :
      locale === "fr" ? "Conditions aux Limites et Plage de Validité" :
      locale === "es" ? "Condiciones Límite y Rango de Validez" :
      locale === "ar" ? "الظروف الحدودية ونطاق الصلاحية" :
      "Boundary Conditions & Validity Range",

    fieldNoteNextDepth:
      locale === "tr" ? "İleri Analiz Önerileri" :
      locale === "de" ? "Weiterführende Analysen" :
      locale === "fr" ? "Analyses Approfondies Recommandées" :
      locale === "es" ? "Análisis Adicionales Recomendados" :
      locale === "ar" ? "تحليلات إضافية موصى بها" :
      "Recommended Further Analysis",

    fieldNoteRegulatory:
      locale === "tr" ? "Standartlar ve Mevzuat" :
      locale === "de" ? "Normen und Vorschriften" :
      locale === "fr" ? "Normes et Réglementation" :
      locale === "es" ? "Normas y Reglamentación" :
      locale === "ar" ? "المعايير واللوائح" :
      "Standards & Regulatory Compliance",
  };

  const categoryLabel = matched
    ? CATEGORY_LABELS[matched.labelKey] ?? "Technical Advisory"
    : (locale === "tr" ? "Teknik Not" :
       locale === "de" ? "Technische Notiz" :
       locale === "fr" ? "Note Technique" :
       locale === "es" ? "Nota Técnica" :
       locale === "ar" ? "ملاحظة فنية" :
       "Technical Advisory");

  /* Split into "header" (first sentence fragment before colon) and body */
  const colonIdx = note.indexOf(":");
  const hasHeader = colonIdx > 0 && colonIdx < 80;

  return (
    <div className="border-l-4 border-sc-copper bg-white px-4 py-3.5 shadow-sm">
      <div className="flex items-start gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sc-navy text-[0.625rem] font-bold text-white">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-sc-copper">
              {categoryLabel}
            </span>
          </div>
          {hasHeader ? (
            <>
              <p className="mt-1 font-semibold text-slate-900">
                {note.slice(0, colonIdx)}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-700">
                {note.slice(colonIdx + 1).trim()}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */

export function EngineeringInterpretationPanel({
  request,
  shouldFetch,
  onComplete,
}: EngineeringInterpretationPanelProps) {
  const t = useTranslations("engineeringInterpretation");
  const [state, setState] = useState<PanelState>({ status: "idle" });
  const fetchRef = useRef(false);
  const locale = request.locale;

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

  /* ── Idle / Loading state ── */
  if (state.status === "idle" || state.status === "loading") {
    return (
      <section className="sc-premium-decision-report__section" aria-label={t("tabLabel")}>
        <h3 className="sc-premium-decision-report__heading">{t("tabLabel")}</h3>
        {state.status === "loading" ? (
          <div className="mt-4">
            <LoadingSkeleton />
            <p className="mt-4 text-xs italic text-slate-400">{t("generating")}</p>
          </div>
        ) : null}
      </section>
    );
  }

  /* ── Error state ── */
  if (state.status === "error") {
    return (
      <section className="sc-premium-decision-report__section" aria-label={t("tabLabel")}>
        <h3 className="sc-premium-decision-report__heading">{t("tabLabel")}</h3>
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4">
          <p className="text-base font-semibold text-amber-900">{t("unavailable")}</p>
          <p className="mt-1 text-sm text-amber-700">{state.fallbackMessage}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded-md bg-amber-100 px-5 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-200"
          >
            {t("retry")}
          </button>
        </div>
      </section>
    );
  }

  /* ── Loaded state ── */
  const { data } = state;

  return (
    <section className="sc-premium-decision-report__section" aria-label={t("tabLabel")}>
      <h3 className="sc-premium-decision-report__heading">{t("tabLabel")}</h3>

      {/* Confidence + metadata bar */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className={`inline-block rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${CONFIDENCE_CLASS[data.confidence]}`}>
          {t(`confidence.${data.confidence}`)}
        </span>
        <span className="text-[0.6875rem] text-slate-400">
          AI-assisted engineering analysis
        </span>
      </div>

      {/* ── 1. Executive Summary (PREMIUM — large, multi-paragraph) ── */}
      <div className="mt-6 space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sc-navy">
          <span className="inline-block h-0.5 w-5 bg-sc-copper" />
          {t("executiveSummary")}
        </h4>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {data.executiveSummary.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} className={`text-base leading-relaxed text-slate-800 ${
              i > 0 ? "mt-4" : ""
            }`}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* ── 2. Output Analyses ── */}
      {data.outputAnalyses.length > 0 ? (
        <div className="mt-8 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sc-navy">
            <span className="inline-block h-0.5 w-5 bg-sc-copper" />
            {t("outputAnalyses")}
          </h4>
          <div className="grid gap-3">
            {data.outputAnalyses.map((analysis) => (
              <div
                key={analysis.outputId}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">{analysis.label}</span>
                  <SignificanceBadge significance={analysis.significance} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {analysis.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── 3. Risk Assessment ── */}
      {data.riskAssessment.length > 0 ? (
        <div className="mt-8 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sc-navy">
            <span className="inline-block h-0.5 w-5 bg-sc-copper" />
            {t("riskAssessment")}
          </h4>
          <div className="grid gap-3">
            {data.riskAssessment.map((risk, index) => (
              <div
                key={`risk-${index}`}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">{risk.factor}</span>
                  <SeverityBadge severity={risk.severity} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {risk.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── 4. Recommendations ── */}
      {data.recommendations.length > 0 ? (
        <div className="mt-8 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sc-navy">
            <span className="inline-block h-0.5 w-5 bg-sc-copper" />
            {t("recommendations")}
          </h4>
          <div className="grid gap-3">
            {data.recommendations.map((rec, index) => (
              <div
                key={`rec-${index}`}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">{rec.action}</span>
                  <PriorityBadge priority={rec.priority} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-700">
                    {locale === "tr" ? "Beklenen Etki: " :
                     locale === "de" ? "Erwartete Auswirkung: " :
                     locale === "fr" ? "Impact Attendu: " :
                     locale === "es" ? "Impacto Esperado: " :
                     locale === "ar" ? "الأثر المتوقع: " :
                     "Expected Impact: "}
                  </span>
                  {rec.expectedImpact}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── 5. Field Notes (PREMIUM — professional advisory cards) ── */}
      {data.fieldNotes.length > 0 ? (
        <div className="mt-8 space-y-4">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sc-navy">
            <span className="inline-block h-0.5 w-5 bg-sc-copper" />
            {t("fieldNotes")}
          </h4>
          <div className="grid gap-3">
            {data.fieldNotes.map((note, index) => (
              <FieldNoteCard
                key={`fn-${index}`}
                note={note}
                index={index}
                locale={locale}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
