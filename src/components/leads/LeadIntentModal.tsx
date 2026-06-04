"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  LEAD_INDUSTRY_OPTIONS,
  LEAD_INTENDED_USE_OPTIONS,
  LEAD_TOOL_OPTIONS,
} from "@/data/lead-options";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";
import { createLeadIntent, validateLeadIntentInput } from "@/lib/leads/create-lead-intent";
import type {
  LeadIntentErrors,
  LeadIntentInput,
  LeadModalOpenContext,
  LeadPlan,
} from "@/lib/leads/types";
import { useLeadIntent } from "@/components/leads/LeadIntentContext";

const inputClass =
  "w-full min-h-[48px] rounded-lg border bg-white px-4 text-deep-navy focus:outline-none focus:ring-2 focus:ring-professional-blue/20";
const inputErrorClass = "border-soft-red";
const inputOkClass = "border-slate/25 focus:border-professional-blue";

interface FormState {
  name: string;
  email: string;
  company: string;
  industry: string;
  toolRequested: string;
  intendedUse: string;
  message: string;
}

function emptyForm(): FormState {
  return {
    name: "",
    email: "",
    company: "",
    industry: "",
    toolRequested: "",
    intendedUse: "",
    message: "",
  };
}

function formFromContext(ctx: LeadModalOpenContext | null): FormState {
  const base = emptyForm();
  if (!ctx) return base;
  return {
    ...base,
    industry: ctx.industry ?? "",
    toolRequested: ctx.toolRequested ?? "",
  };
}

function planLabel(plan: LeadPlan | undefined): string | null {
  if (!plan || plan === "unknown" || plan === "free") return null;
  const labels: Record<string, string> = {
    single_report: "Single Report",
    sector_pass: "Sector Pass",
    pro: "Pro",
  };
  return labels[plan] ?? null;
}

export function LeadIntentModal() {
  const { isOpen, context, closeLeadModal } = useLeadIntent();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"form" | "success">("form");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<LeadIntentErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const openedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      openedRef.current = false;
      setPhase("form");
      setForm(emptyForm());
      setErrors({});
      setSubmitError(null);
      setLoading(false);
      return;
    }

    setForm(formFromContext(context));
    setErrors({});
    setSubmitError(null);
    setPhase("form");

    if (!openedRef.current && context) {
      openedRef.current = true;
      trackEvent(ANALYTICS_EVENTS.lead_modal_opened, {
        source: context.source,
        toolRequested: context.toolRequested,
        industry: context.industry,
        plan: context.plan,
        pagePath: context.pagePath,
      });
    }
  }, [isOpen, context]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLeadModal();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeLeadModal]);

  const updateField = useCallback(
    (field: keyof FormState, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field as keyof LeadIntentErrors]) return prev;
        const next = { ...prev };
        delete next[field as keyof LeadIntentErrors];
        return next;
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || loading) return;

    const input: LeadIntentInput = {
      name: form.name,
      email: form.email,
      company: form.company,
      industry: form.industry,
      toolRequested: form.toolRequested,
      intendedUse: form.intendedUse,
      message: form.message || undefined,
      source: context.source,
      pagePath: context.pagePath ?? "/",
      plan: context.plan,
    };

    const validationErrors = validateLeadIntentInput(input);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      trackEvent(ANALYTICS_EVENTS.lead_submit_failed, {
        source: context.source,
        toolRequested: form.toolRequested,
        industry: form.industry,
        plan: context.plan,
        pagePath: context.pagePath,
        reason: "validation",
      });
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      console.info("[SectorCalc] Lead form submit started");
      const result = await createLeadIntent(input);
      console.info("[SectorCalc] createLeadIntent result", result);
      if (!result.success) {
        if (result.rateLimited) {
          setSubmitError(
            result.rateLimitMessage ?? "Too many requests. Please try again later."
          );
          trackEvent(ANALYTICS_EVENTS.lead_submit_failed, {
            source: context.source,
            toolRequested: form.toolRequested,
            industry: form.industry,
            plan: context.plan,
            pagePath: context.pagePath,
            reason: "rate_limit",
          });
          return;
        }
        setErrors(result.errors ?? {});
        trackEvent(ANALYTICS_EVENTS.lead_submit_failed, {
          source: context.source,
          toolRequested: form.toolRequested,
          industry: form.industry,
          plan: context.plan,
          pagePath: context.pagePath,
          reason: "validation",
        });
        return;
      }

      trackEvent(ANALYTICS_EVENTS.lead_submitted, {
        source: context.source,
        toolRequested: form.toolRequested,
        industry: form.industry,
        plan: context.plan,
        pagePath: context.pagePath,
      });
      setErrors({});
      setSubmitError(null);
      setPhase("success");
    } catch {
      setSubmitError(
        "Something went wrong. Please check your entries and try again."
      );
      trackEvent(ANALYTICS_EVENTS.lead_submit_failed, {
        source: context.source,
        toolRequested: form.toolRequested,
        industry: form.industry,
        plan: context.plan,
        pagePath: context.pagePath,
        reason: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const toolLocked = Boolean(context?.toolRequested);
  const planName = planLabel(context?.plan);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-deep-navy/60 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={closeLeadModal}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate/20 bg-white shadow-card sm:max-h-[90vh] sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate/15 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-bold text-deep-navy sm:text-xl"
            >
              {phase === "success" ? "Request received." : "Request this decision report"}
            </h2>
            {phase === "form" && (
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Tell us what you need. Premium unlock and export are not live yet —
                we record your intent for the next release.
                {planName ? (
                  <span className="mt-1 block font-medium text-deep-navy">
                    Plan interest: {planName}
                  </span>
                ) : null}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={closeLeadModal}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate transition-colors hover:bg-off-white hover:text-deep-navy"
            aria-label="Close"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {phase === "success" ? (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-slate sm:text-base">
                Thanks. We recorded your report request. In the next release,
                premium report unlock and export will be available directly inside
                SectorCalc.
              </p>
              <Link
                href="/free-tools"
                onClick={closeLeadModal}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-professional-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
              >
                Continue exploring tools
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <Field
                id="lead-name"
                label="Name"
                required
                error={errors.name}
              >
                <input
                  id="lead-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  className={`${inputClass} ${errors.name ? inputErrorClass : inputOkClass}`}
                />
              </Field>

              <Field
                id="lead-email"
                label="Email"
                required
                error={errors.email}
              >
                <input
                  id="lead-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  className={`${inputClass} ${errors.email ? inputErrorClass : inputOkClass}`}
                />
              </Field>

              <Field
                id="lead-company"
                label="Company / Business name"
                required
                error={errors.company}
              >
                <input
                  id="lead-company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  aria-invalid={Boolean(errors.company)}
                  className={`${inputClass} ${errors.company ? inputErrorClass : inputOkClass}`}
                />
              </Field>

              <Field
                id="lead-industry"
                label="Industry"
                required
                error={errors.industry}
              >
                <select
                  id="lead-industry"
                  value={form.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                  aria-invalid={Boolean(errors.industry)}
                  className={`${inputClass} ${errors.industry ? inputErrorClass : inputOkClass}`}
                >
                  <option value="">Select industry</option>
                  {LEAD_INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>

              {toolLocked ? (
                <Field
                  id="lead-tool-locked"
                  label="Tool / Report requested"
                  required
                  error={errors.toolRequested}
                >
                  <input
                    id="lead-tool-locked"
                    type="text"
                    readOnly
                    value={form.toolRequested}
                    className={`${inputClass} border-slate/25 bg-off-white text-slate`}
                  />
                </Field>
              ) : (
                <Field
                  id="lead-tool"
                  label="Tool / Report requested"
                  required
                  error={errors.toolRequested}
                >
                  <select
                    id="lead-tool"
                    value={form.toolRequested}
                    onChange={(e) => updateField("toolRequested", e.target.value)}
                    aria-invalid={Boolean(errors.toolRequested)}
                    className={`${inputClass} ${errors.toolRequested ? inputErrorClass : inputOkClass}`}
                  >
                    <option value="">Select tool or report</option>
                    {LEAD_TOOL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field
                id="lead-intended-use"
                label="Intended use"
                required
                error={errors.intendedUse}
              >
                <select
                  id="lead-intended-use"
                  value={form.intendedUse}
                  onChange={(e) => updateField("intendedUse", e.target.value)}
                  aria-invalid={Boolean(errors.intendedUse)}
                  className={`${inputClass} ${errors.intendedUse ? inputErrorClass : inputOkClass}`}
                >
                  <option value="">Select intended use</option>
                  {LEAD_INTENDED_USE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="lead-message"
                label="Message (optional)"
                error={errors.message}
              >
                <textarea
                  id="lead-message"
                  rows={4}
                  maxLength={500}
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  className={`${inputClass} min-h-[120px] resize-y py-3 ${errors.message ? inputErrorClass : inputOkClass}`}
                  placeholder="Timeline, client context, or questions (max 500 characters)"
                />
              </Field>

              {submitError && (
                <p className="rounded-lg border border-soft-red/30 bg-soft-red/5 px-4 py-3 text-sm text-soft-red" role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-professional-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-deep-navy">
        {label}
        {required ? <span className="ml-0.5 text-soft-red">*</span> : null}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="text-sm text-soft-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
