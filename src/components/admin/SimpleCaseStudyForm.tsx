"use client";

import { ArrowLeft, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import Link from "@/lib/ui-shared/navigation/next-link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { useAdminLocale } from "@/lib/features/admin/admin-locale-context";
import { useAdminAuth } from "@/lib/features/admin/use-admin-auth";
import { nextPublishedCaseStudyId } from "@/lib/features/case-studies/admin-case-studies";
import {
  emptyCaseStudyFormValues,
  formValuesToDraft,
  saveCaseStudyDraft,
  type CaseStudyFormValues,
} from "@/lib/features/case-studies/case-study-drafts";
import {
  isAdminCaseStudyApiErrorCode,
  listAdminCaseStudyEditorLocales,
  type AdminCaseStudyEditorMessages,
} from "@/lib/infrastructure/i18n/admin-case-study-editor-messages";
import { getLocaleDefinition, isSupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import {
  mergeParsedCaseStudyIntoFormValues,
  type ParsedCaseStudyFromText,
} from "@/lib/features/case-studies/parse-case-study-from-text";
import type { CaseStudyResult } from "@/lib/features/case-studies/types";

const fieldClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm text-deep-navy focus:border-sc-copper focus:outline-none focus:ring-2 focus:ring-sc-copper/20";

const sectionClass = "space-y-4 rounded-xl border border-slate/20 bg-white p-6";

function updateResultRow(
  results: CaseStudyResult[],
  index: number,
  field: keyof CaseStudyResult,
  value: string,
): CaseStudyResult[] {
  return results.map((row, rowIndex) =>
    rowIndex === index ? { ...row, [field]: value } : row,
  );
}

function isParsedCaseStudyPayload(
  value: unknown,
): value is ParsedCaseStudyFromText & { success: true; sourceLocale?: string } {
  return Boolean(value && typeof value === "object" && (value as { success?: unknown }).success === true);
}

function resolveApiErrorMessage(
  error: string | undefined,
  messages: AdminCaseStudyEditorMessages,
): string {
  if (error && isAdminCaseStudyApiErrorCode(error)) {
    return messages.apiError[error];
  }
  return messages.errorParseFailed;
}

export function SimpleCaseStudyForm() {
  const router = useRouter();
  const { locale, messages: m } = useAdminLocale();
  const { loading: authLoading, isAdmin, getIdToken } = useAdminAuth();
  const initialId = useMemo(() => nextPublishedCaseStudyId(), []);
  const storyLocales = listAdminCaseStudyEditorLocales();

  const [parsing, setParsing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState(false);
  const [values, setValues] = useState<CaseStudyFormValues>(() => ({
    ...emptyCaseStudyFormValues(initialId),
    sourceLocale: locale,
  }));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CaseStudyFormValues>(field: K, value: CaseStudyFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const addResult = () => {
    setValues((prev) => ({
      ...prev,
      results: [...prev.results, { metric: "", before: "", after: "" }],
    }));
  };

  const removeResult = (index: number) => {
    setValues((prev) => ({
      ...prev,
      results: prev.results.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const handleParse = async () => {
    if (!rawText.trim()) {
      setError(m.errorEmptyStory);
      return;
    }

    setParsing(true);
    setError(null);
    setMessage(null);

    try {
      const token = await getIdToken(true);
      if (!token) {
        setError(m.errorSession);
        return;
      }

      const response = await fetch("/api/admin/parse-case-study", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: rawText, sourceLocale: values.sourceLocale }),
      });

      const payload = (await response.json()) as
        | (ParsedCaseStudyFromText & { success: true; sourceLocale?: string; error?: string })
        | { success: false; error?: string };

      if (!response.ok || !isParsedCaseStudyPayload(payload)) {
        setError(
          payload.success === false
            ? resolveApiErrorMessage(payload.error, m)
            : m.errorParseFailed,
        );
        return;
      }

      const { success, sourceLocale: parsedSourceLocale, ...parsedFields } = payload;
      void success;
      setValues((prev) => ({
        ...mergeParsedCaseStudyIntoFormValues(prev, parsedFields),
        sourceLocale:
          parsedSourceLocale && isSupportedLocale(parsedSourceLocale)
            ? parsedSourceLocale
            : prev.sourceLocale,
      }));
      setParsed(true);
      setMessage(m.successParsed);
    } catch (parseError) {
      console.error("Parse case study error:", parseError);
      setError(m.errorConnection);
    } finally {
      setParsing(false);
    }
  };

  const handlePublish = async () => {
    if (!values.title.trim()) {
      setError(m.errorTitleRequired);
      return;
    }

    setPublishing(true);
    setError(null);
    setMessage(null);

    try {
      const token = await getIdToken(true);
      if (!token) {
        setError(m.errorSession);
        return;
      }

      const response = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
          message?: string;
        } | null;
        const apiMessage = resolveApiErrorMessage(payload?.error, m);
        setError(payload?.error ? apiMessage : (payload?.message ?? m.errorPublishFailed));
        return;
      }

      saveCaseStudyDraft(formValuesToDraft(values));
      setMessage(m.successPublished);
      router.push("/admin/case-studies");
    } catch (publishError) {
      console.error("Publish case study error:", publishError);
      setError(m.errorConnection);
    } finally {
      setPublishing(false);
    }
  };

  if (authLoading) {
    return <p className="text-sm text-text-secondary">{m.checkingSession}</p>;
  }

  if (!isAdmin) {
    return <AdminAuthBar />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-navy">{m.pageTitle}</h1>
          <p className="mt-1 text-sm text-text-secondary">{m.pageSubtitle}</p>
        </div>
        <Link
          href="/admin/case-studies"
          className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-text-secondary transition hover:text-deep-navy"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {m.backToList}
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      <section className={sectionClass}>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-deep-navy">{m.storyLabel}</span>
          <textarea
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            rows={12}
            placeholder={m.storyPlaceholder}
            className={`${fieldClass} min-h-[220px] resize-y font-mono`}
          />
        </label>

        <label className="mt-4 block max-w-xs space-y-1">
          <span className="text-sm font-medium text-deep-navy">{m.sourceLocaleLabel}</span>
          <select
            value={values.sourceLocale}
            onChange={(event) => {
              const next = event.target.value;
              if (isSupportedLocale(next)) {
                update("sourceLocale", next);
              }
            }}
            className={fieldClass}
          >
            {storyLocales.map((code) => (
              <option key={code} value={code}>
                {getLocaleDefinition(code).nativeName}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleParse()}
            disabled={parsing || publishing}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-sc-copper px-4 text-sm font-semibold text-white transition hover:bg-sc-copper/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {parsing ? m.parsing : m.parseButton}
          </button>
          <Link
            href="/admin/case-studies/new/full"
            className="text-sm font-medium text-sc-copper transition hover:text-deep-navy"
          >
            {m.advancedEditor}
          </Link>
        </div>
        <p className="text-xs text-text-secondary">{m.parseHint}</p>
      </section>

      {parsed ? (
        <section className={`${sectionClass} space-y-5`}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {m.parsedSectionTitle}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-deep-navy">{m.fieldTitle}</span>
              <input
                type="text"
                value={values.title}
                onChange={(event) => update("title", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-deep-navy">{m.fieldIndustry}</span>
              <input
                type="text"
                value={values.industry}
                onChange={(event) => update("industry", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-deep-navy">{m.fieldCountry}</span>
              <input
                type="text"
                value={values.country}
                onChange={(event) => update("country", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-deep-navy">{m.fieldCity}</span>
              <input
                type="text"
                value={values.city}
                onChange={(event) => update("city", event.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-deep-navy">{m.fieldChallenge}</span>
            <textarea
              value={values.challenge}
              onChange={(event) => update("challenge", event.target.value)}
              rows={3}
              className={`${fieldClass} min-h-[88px] resize-y`}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-deep-navy">{m.fieldSolution}</span>
            <textarea
              value={values.solution}
              onChange={(event) => update("solution", event.target.value)}
              rows={3}
              className={`${fieldClass} min-h-[88px] resize-y`}
            />
          </label>

          <div className="space-y-3">
            <span className="text-sm font-medium text-deep-navy">{m.fieldResults}</span>
            {values.results.map((row, index) => (
              <div
                key={`result-${index}`}
                className="flex flex-col gap-3 rounded-lg border border-slate/15 bg-off-white p-2 sm:flex-row sm:items-center"
              >
                <input
                  type="text"
                  value={row.metric}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      results: updateResultRow(prev.results, index, "metric", event.target.value),
                    }))
                  }
                  placeholder={m.metricName}
                  className={`${fieldClass} flex-1`}
                />
                <input
                  type="text"
                  value={row.before}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      results: updateResultRow(prev.results, index, "before", event.target.value),
                    }))
                  }
                  placeholder={m.metricBefore}
                  className={`${fieldClass} sm:w-24`}
                />
                <input
                  type="text"
                  value={row.after}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      results: updateResultRow(prev.results, index, "after", event.target.value),
                    }))
                  }
                  placeholder={m.metricAfter}
                  className={`${fieldClass} sm:w-24`}
                />
                <button
                  type="button"
                  onClick={() => removeResult(index)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-amber transition hover:text-deep-navy disabled:opacity-40"
                  disabled={values.results.length <= 1}
                  aria-label={m.removeMetric}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResult}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-sc-copper transition hover:text-deep-navy"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {m.addMetric}
            </button>
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-deep-navy">{m.fieldTestimonial}</span>
            <input
              type="text"
              value={values.testimonialQuote}
              onChange={(event) => update("testimonialQuote", event.target.value)}
              placeholder={m.testimonialPlaceholder}
              className={fieldClass}
            />
          </label>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void handlePublish()}
              disabled={parsing || publishing}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {publishing ? m.publishing : m.publishButton}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
