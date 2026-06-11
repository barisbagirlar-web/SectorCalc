"use client";

import Link from "@/lib/navigation/next-link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { PremiumPaywall } from "@/components/subscription/PremiumPaywall";
import { CheckoutLoadingOverlay } from "@/components/billing/CheckoutLoadingOverlay";
import {
 LEAD_INDUSTRY_OPTIONS,
 LEAD_INTENDED_USE_OPTIONS,
 LEAD_TOOL_OPTIONS,
} from "@/data/lead-options";
import {
 ANALYTICS_EVENTS,
 trackEvent,
} from "@/lib/analytics/events";
import {
 buildVerdictUnlockLeadInput,
 createLeadIntent,
 validateLeadIntentInput,
 validateVerdictUnlockEmail,
} from "@/lib/leads/create-lead-intent";
import {
 buildCheckoutLoginUrl,
 startCheckoutSession,
} from "@/lib/billing/create-checkout-session";
import type {
 LeadIntentErrors,
 LeadIntentInput,
 LeadModalOpenContext,
 LeadPlan,
} from "@/lib/leads/types";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";
import { useLeadIntent } from "@/components/leads/LeadIntentContext";

const inputClass =
 "w-full min-h-[48px] rounded-lg border bg-white px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/20";
const inputErrorClass = "border-soft-red";
const inputOkClass = "border-slate/25 focus:border-deep-navy";

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

function modalTitle(context: LeadModalOpenContext | null, phase: "form" | "success"): string {
 if (phase === "success") return "Request received.";
 if (context?.flow === "verdict_unlock") return "Send my full verdict";
 if (context?.flow === "paywall") return "Unlock full verdict";
 return "Request this decision report";
}

export function LeadIntentModal() {
 const locale = useLocale();
 const { isOpen, context, closeLeadModal } = useLeadIntent();
 const titleId = useId();
 const dialogRef = useRef<HTMLDivElement>(null);
 const [phase, setPhase] = useState<"form" | "success">("form");
 const [form, setForm] = useState<FormState>(emptyForm);
 const [unlockEmail, setUnlockEmail] = useState("");
 const [unlockEmailError, setUnlockEmailError] = useState<string | null>(null);
 const [errors, setErrors] = useState<LeadIntentErrors>({});
 const [submitError, setSubmitError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [checkoutPending, setCheckoutPending] = useState(false);
 const openedRef = useRef(false);

 const flow = context?.flow ?? "default";
 const revenueTool = context?.toolSlug
 ? getRevenueToolByPaidSlug(context.toolSlug)
 : null;

 useEffect(() => {
 if (!isOpen) {
 openedRef.current = false;
 setPhase("form");
 setForm(emptyForm());
 setUnlockEmail("");
 setUnlockEmailError(null);
 setErrors({});
 setSubmitError(null);
 setLoading(false);
 setCheckoutPending(false);
 return;
 }

 setForm(formFromContext(context));
 setErrors({});
 setSubmitError(null);
 setUnlockEmailError(null);
 setPhase("form");

 if (!openedRef.current && context) {
 openedRef.current = true;
 trackEvent(ANALYTICS_EVENTS.lead_modal_opened, {
 source: context.source,
 toolRequested: context.toolRequested,
 industry: context.industry,
 plan: context.plan,
 pagePath: context.pagePath,
 flow: context.flow,
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

 const updateField = useCallback((field: keyof FormState, value: string) => {
 setForm((prev) => ({ ...prev, [field]: value }));
 setErrors((prev) => {
 if (!prev[field as keyof LeadIntentErrors]) return prev;
 const next = { ...prev };
 delete next[field as keyof LeadIntentErrors];
 return next;
 });
 }, []);

 const proceedToSingleVerdictCheckout = useCallback(async () => {
 if (!context?.toolSlug) {
 setSubmitError("Tool context missing. Please try again from the calculator page.");
 return;
 }

 setCheckoutPending(true);
 setSubmitError(null);

 try {
 await startCheckoutSession({
 plan: "single_report",
 toolSlug: context.toolSlug,
 locale,
 returnPath: `/tools/premium/${context.toolSlug}`,
 });
 } catch (caught) {
 const message =
 caught instanceof Error ? caught.message : "Unable to start checkout.";
 if (message.toLowerCase().includes("login") || message.toLowerCase().includes("sign")) {
 window.location.assign(
 buildCheckoutLoginUrl(`/tools/premium/${context.toolSlug}`),
 );
 return;
 }
 setSubmitError(message);
 setCheckoutPending(false);
 }
 }, [context, locale]);

 const handleVerdictUnlockSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!context || loading) return;

 const emailError = validateVerdictUnlockEmail(unlockEmail);
 if (emailError) {
 setUnlockEmailError(emailError);
 return;
 }

 setLoading(true);
 setSubmitError(null);
 setUnlockEmailError(null);

 try {
 const leadInput = buildVerdictUnlockLeadInput(unlockEmail, {
 toolRequested: context.toolRequested,
 industry: context.industry,
 pagePath: context.pagePath ?? "/",
 });

 const result = await createLeadIntent(leadInput);
 if (!result.success) {
 if (result.rateLimited) {
 setSubmitError(result.rateLimitMessage ?? "Too many requests. Try again later.");
 return;
 }
 setSubmitError("Unable to save your request. Please try again.");
 return;
 }

 trackEvent(ANALYTICS_EVENTS.lead_submitted, {
 source: context.source,
 toolRequested: context.toolRequested,
 industry: context.industry,
 plan: "single_report",
 pagePath: context.pagePath,
 flow: "verdict_unlock",
 });

 closeLeadModal();
 await proceedToSingleVerdictCheckout();
 } catch {
 setSubmitError("Something went wrong. Please try again.");
 } finally {
 setLoading(false);
 }
 };

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
 const result = await createLeadIntent(input);
 if (!result.success) {
 if (result.rateLimited) {
 setSubmitError(
 result.rateLimitMessage ?? "Too many requests. Please try again later.",
 );
 return;
 }
 setErrors(result.errors ?? {});
 return;
 }

 trackEvent(ANALYTICS_EVENTS.lead_submitted, {
 source: context.source,
 toolRequested: form.toolRequested,
 industry: form.industry,
 plan: context.plan,
 pagePath: context.pagePath,
 });
 setPhase("success");
 } catch {
 setSubmitError("Something went wrong. Please check your entries and try again.");
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
 {checkoutPending ? <CheckoutLoadingOverlay /> : null}
 <button
 type="button"
 className="absolute inset-0 bg-deep-navy/70 backdrop-blur-[2px]"
 aria-label="Close dialog"
 onClick={closeLeadModal}
 />
 <div
 ref={dialogRef}
 role="dialog"
 aria-modal="true"
 aria-labelledby={titleId}
 className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border sm:max-h-[90vh] sm:rounded-sm ${
 flow === "paywall"
 ? "max-w-xl border-amber/25 bg-deep-navy"
 : "max-w-lg border-border-subtle bg-white"
 }`}
 >
 <div
 className={`flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-6 ${
 flow === "paywall" ? "border-border-subtle/40" : "border-border-subtle"
 }`}
 >
 <div className="min-w-0">
 <h2
 id={titleId}
 className={`text-lg font-bold sm:text-xl ${
 flow === "paywall" ? "text-white" : "text-text-primary"
 }`}
 >
 {modalTitle(context, phase)}
 </h2>
 {phase === "form" && flow === "default" && (
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 Tell us what you need. Premium unlock and export are not live yet —
 we record your intent for the next release.
 {planName ? (
 <span className="mt-1 block font-medium text-text-primary">
 Plan interest: {planName}
 </span>
 ) : null}
 </p>
 )}
 {phase === "form" && flow === "verdict_unlock" && (
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 Enter your email to receive checkout access for the full margin
 verdict — safe price, leak breakdown and recommended action.
 </p>
 )}
 </div>
 <button
 type="button"
 onClick={closeLeadModal}
 className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
 flow === "paywall"
 ? "text-text-secondary hover:bg-white/10 hover:text-white"
 : "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
 }`}
 aria-label="Close"
 >
 <span aria-hidden className="text-xl leading-none">
 ×
 </span>
 </button>
 </div>

 <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
 {flow === "paywall" ? (
 <PremiumPaywall
 tool={revenueTool ?? undefined}
 toolSlug={context?.toolSlug}
 variant="modal"
 />
 ) : null}

 {flow !== "paywall" && phase === "success" ? (
 <div className="space-y-6">
 <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
 Thanks. We recorded your report request. In the next release,
 premium report unlock and export will be available directly inside
 SectorCalc.
 </p>
 <Link
 href="/free-tools"
 onClick={closeLeadModal}
 className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-deep-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-black sm:w-auto"
 >
 Continue exploring tools
 </Link>
 </div>
 ) : null}

 {flow === "verdict_unlock" && phase === "form" ? (
 <form className="space-y-5" onSubmit={handleVerdictUnlockSubmit} noValidate>
 <Field
 id="unlock-email"
 label="Email"
 required
 error={unlockEmailError ?? undefined}
 >
 <input
 id="unlock-email"
 type="email"
 autoComplete="email"
 placeholder="Send my verdict to this email"
 value={unlockEmail}
 onChange={(e) => {
 setUnlockEmail(e.target.value);
 setUnlockEmailError(null);
 }}
 aria-invalid={Boolean(unlockEmailError)}
 className={`${inputClass} ${unlockEmailError ? inputErrorClass : inputOkClass}`}
 />
 </Field>
 {submitError ? (
 <p
 className="rounded-lg border border-amber/30 bg-amber/[0.06] px-4 py-3 text-sm text-amber"
 role="alert"
 >
 {submitError}
 </p>
 ) : null}
 <button
 type="submit"
 disabled={loading || checkoutPending}
 className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border border-amber/40 bg-amber px-6 text-sm font-semibold text-deep-navy transition-colors hover:bg-amber/90 disabled:opacity-60"
 >
 {loading || checkoutPending ? "Redirecting to checkout…" : "Continue to checkout"}
 </button>
 <p className="text-xs leading-relaxed text-text-secondary">
 You may be asked to sign in before secure payment. Digital product —
 estimates only.
 </p>
 </form>
 ) : null}

 {flow === "default" && phase === "form" ? (
 <form className="space-y-5" onSubmit={handleSubmit} noValidate>
 <Field id="lead-name" label="Name" required error={errors.name}>
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

 <Field id="lead-email" label="Email" required error={errors.email}>
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
 className={`${inputClass} border-slate/25 bg-bg-subtle text-text-secondary`}
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

 <Field id="lead-message" label="Message (optional)" error={errors.message}>
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

 {submitError ? (
 <p
 className="rounded-lg border border-amber/30 bg-amber/[0.06] px-4 py-3 text-sm text-amber"
 role="alert"
 >
 {submitError}
 </p>
 ) : null}

 <button
 type="submit"
 disabled={loading}
 className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-deep-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-60"
 >
 {loading ? "Submitting…" : "Submit request"}
 </button>
 </form>
 ) : null}
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
 <label htmlFor={id} className="block text-sm font-medium text-text-primary">
 {label}
 {required ? <span className="ml-0.5 text-amber">*</span> : null}
 </label>
 {children}
 {error ? (
 <p id={errorId} className="text-sm text-amber" role="alert">
 {error}
 </p>
 ) : null}
 </div>
 );
}
