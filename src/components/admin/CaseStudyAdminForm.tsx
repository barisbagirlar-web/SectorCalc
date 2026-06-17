"use client";

import Link from "@/lib/navigation/next-link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminAuthBar } from "@/components/admin/AdminAuthPanel";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import {
  getPublishedCaseStudyByAdminId,
  nextPublishedCaseStudyId,
} from "@/lib/case-studies/admin-case-studies";
import {
  caseStudyToFormValues,
  downloadCaseStudyDraftExport,
  emptyCaseStudyFormValues,
  formValuesToDraft,
  getCaseStudyDraftById,
  saveCaseStudyDraft,
  type CaseStudyFormValues,
} from "@/lib/case-studies/case-study-drafts";
import type { CaseStudyResult } from "@/lib/case-studies/types";

const fieldClass =
  "w-full min-h-[44px] rounded-lg border border-slate/25 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const textareaClass =
  "w-full min-h-[120px] rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const buttonPrimaryClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-professional-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";

const buttonSecondaryClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate/25 bg-white px-4 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue/40 hover:bg-off-white";

type CaseStudyAdminFormProps = {
  readonly studyId?: string;
  readonly mode: "create" | "edit";
};

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

export function CaseStudyAdminForm({ studyId, mode }: CaseStudyAdminFormProps) {
  const router = useRouter();
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const initialId = useMemo(
    () => studyId ?? nextPublishedCaseStudyId(),
    [studyId],
  );

  const initialValues = useMemo(() => {
    if (studyId) {
      const draft = getCaseStudyDraftById(studyId);
      if (draft) {
        return caseStudyToFormValues(draft);
      }
      const published = getPublishedCaseStudyByAdminId(studyId);
      if (published) {
        return caseStudyToFormValues(published);
      }
    }
    return emptyCaseStudyFormValues(initialId);
  }, [initialId, studyId]);

  const [values, setValues] = useState<CaseStudyFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isPublishedEdit =
    mode === "edit" &&
    studyId !== undefined &&
    getPublishedCaseStudyByAdminId(studyId) !== undefined &&
    getCaseStudyDraftById(studyId) === undefined;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    if (!values.title.trim()) {
      setError("Title is required.");
      setSubmitting(false);
      return;
    }

    const draft = formValuesToDraft(values);
    saveCaseStudyDraft(draft);
    downloadCaseStudyDraftExport(draft);
    setMessage(
      isPublishedEdit
        ? "Draft saved locally and JSON exported. Update static locale files in the repo to publish changes."
        : "Draft saved in this browser and JSON exported. Add the bundle to the repo to publish.",
    );
    setSubmitting(false);

    if (mode === "create") {
      router.replace(`/admin/case-studies/${encodeURIComponent(draft.id ?? draft.slug)}/edit`);
    }
  };

  if (authLoading) {
    return <p className="text-sm text-text-secondary">Checking admin access…</p>;
  }

  return (
    <div>
      <AdminAuthBar />

      {!isAdmin ? (
        <p className="mt-6 text-sm text-text-secondary">
          Sign in with an admin account to edit case study drafts.
        </p>
      ) : (
        <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 space-y-8">
          {isPublishedEdit ? (
            <p className="rounded-sm border border-amber/25 bg-amber/5 px-4 py-3 text-sm text-deep-navy">
              This story is live from static files. Saving creates a browser draft and exports JSON —
              it does not change the public page until you commit the repo files and deploy.
            </p>
          ) : null}

          {error ? (
            <p className="text-sm font-medium text-amber" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-sm font-medium text-emerald-700" role="status">
              {message}
            </p>
          ) : null}

          <section className="space-y-4 rounded-sm border border-slate/20 bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-deep-navy">Metadata</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">ID</span>
                <input value={values.id} readOnly className={fieldClass} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Published date</span>
                <input
                  type="date"
                  value={values.publishedAt}
                  onChange={(event) => setValues({ ...values, publishedAt: event.target.value })}
                  className={fieldClass}
                  required
                />
              </label>
              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Title</span>
                <input
                  value={values.title}
                  onChange={(event) => setValues({ ...values, title: event.target.value })}
                  className={fieldClass}
                  required
                />
              </label>
              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Subtitle</span>
                <input
                  value={values.subtitle}
                  onChange={(event) => setValues({ ...values, subtitle: event.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Industry</span>
                <input
                  value={values.industry}
                  onChange={(event) => setValues({ ...values, industry: event.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Read time (min)</span>
                <input
                  type="number"
                  min={1}
                  value={values.readTime}
                  onChange={(event) => setValues({ ...values, readTime: event.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Country</span>
                <input
                  value={values.country}
                  onChange={(event) => setValues({ ...values, country: event.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">City</span>
                <input
                  value={values.city}
                  onChange={(event) => setValues({ ...values, city: event.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Project duration</span>
                <input
                  value={values.projectDuration}
                  onChange={(event) => setValues({ ...values, projectDuration: event.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Savings (EUR)</span>
                <input
                  value={values.savingsEur}
                  onChange={(event) => setValues({ ...values, savingsEur: event.target.value })}
                  className={fieldClass}
                  inputMode="numeric"
                />
              </label>
              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Tools (comma-separated slugs)</span>
                <input
                  value={values.tools}
                  onChange={(event) => setValues({ ...values, tools: event.target.value })}
                  className={fieldClass}
                  placeholder="oee-downtime-calculator, scrap-rate-optimizer"
                />
              </label>
            </div>
          </section>

          <section className="space-y-4 rounded-sm border border-slate/20 bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-deep-navy">Story (English)</h2>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Challenge</span>
              <textarea
                value={values.challenge}
                onChange={(event) => setValues({ ...values, challenge: event.target.value })}
                className={textareaClass}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Solution</span>
              <textarea
                value={values.solution}
                onChange={(event) => setValues({ ...values, solution: event.target.value })}
                className={textareaClass}
              />
            </label>
          </section>

          <section className="space-y-4 rounded-sm border border-slate/20 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-deep-navy">Results</h2>
              <button
                type="button"
                className={buttonSecondaryClass}
                onClick={() =>
                  setValues({
                    ...values,
                    results: [...values.results, { metric: "", before: "", after: "" }],
                  })
                }
              >
                Add row
              </button>
            </div>
            {values.results.map((row, index) => (
              <div key={`result-${index}`} className="grid gap-3 md:grid-cols-3">
                <input
                  value={row.metric}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      results: updateResultRow(values.results, index, "metric", event.target.value),
                    })
                  }
                  className={fieldClass}
                  placeholder="Metric"
                />
                <input
                  value={row.before}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      results: updateResultRow(values.results, index, "before", event.target.value),
                    })
                  }
                  className={fieldClass}
                  placeholder="Before"
                />
                <input
                  value={row.after}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      results: updateResultRow(values.results, index, "after", event.target.value),
                    })
                  }
                  className={fieldClass}
                  placeholder="After"
                />
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-sm border border-slate/20 bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-deep-navy">Testimonial (optional)</h2>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Quote</span>
              <textarea
                value={values.testimonialQuote}
                onChange={(event) => setValues({ ...values, testimonialQuote: event.target.value })}
                className={textareaClass}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={values.testimonialAuthor}
                onChange={(event) => setValues({ ...values, testimonialAuthor: event.target.value })}
                className={fieldClass}
                placeholder="Author"
              />
              <input
                value={values.testimonialTitle}
                onChange={(event) => setValues({ ...values, testimonialTitle: event.target.value })}
                className={fieldClass}
                placeholder="Title"
              />
              <input
                value={values.testimonialCompany}
                onChange={(event) => setValues({ ...values, testimonialCompany: event.target.value })}
                className={fieldClass}
                placeholder="Company"
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={submitting} className={buttonPrimaryClass}>
              {submitting ? "Saving…" : "Save draft & export JSON"}
            </button>
            <Link href="/admin/case-studies" className={buttonSecondaryClass}>
              Back to list
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
