"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import {
  BETA_COMPANY_SIZE_OPTIONS,
  BETA_INDUSTRY_OPTIONS,
  BETA_LOSS_RANGE_OPTIONS,
} from "@/data/beta-partner-options";
import {
  buildDefaultBetaPartnerInput,
  createBetaPartnerLead,
} from "@/lib/features/benchmarks/create-beta-partner";
import type { BetaPartnerFieldErrors, BetaPartnerInput } from "@/lib/features/benchmarks/benchmark-types";
import { stripLocalePrefix } from "@/i18n/routing";
import { trackConversionEvent } from "@/lib/infrastructure/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";
import { appendAttributionToNotes } from "@/lib/features/campaigns/campaign-links";

const inputClass =
  "w-full min-h-[48px] rounded-lg border bg-white px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/20";
const inputErrorClass = "border-soft-red";
const inputOkClass = "border-slate/25 focus:border-deep-navy";

export function BetaPartnerForm() {
  const t = useTranslations("betaPartner.form");
  const locale = useLocale();
  const pathname = usePathname();
  const pagePath = stripLocalePrefix(pathname ?? "/");
  const attribution = useAttributionContext();

  const [form, setForm] = useState<BetaPartnerInput>(() =>
    buildDefaultBetaPartnerInput(pagePath)
  );
  const [errors, setErrors] = useState<BetaPartnerFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    trackConversionEvent({
      stage: "landing",
      eventName: "beta_partner_open",
      locale,
      pagePath,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      valueType: "lead",
    });
  }, [attribution.utmCampaign, attribution.utmMedium, attribution.utmSource, locale, pagePath]);

  const fieldClass = (field: keyof BetaPartnerInput): string =>
    [inputClass, errors[field] ? inputErrorClass : inputOkClass].join(" ");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setErrors({});

    const result = await createBetaPartnerLead({
      ...form,
      pagePath,
      notes: appendAttributionToNotes(form.notes, {
        ...attribution,
        landingPath: attribution.landingPath ?? pagePath,
      }),
    });

    setLoading(false);

    if (!result.success) {
      setErrors(result.errors ?? {});
      if (result.rateLimited) {
        setSubmitError(result.errors?.form ?? t("rateLimited"));
      }
      return;
    }

    trackConversionEvent({
      stage: "lead_submit",
      eventName: "beta_partner_submit",
      locale,
      pagePath,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      ctaId: "beta_partner_form_submit",
      valueType: "lead",
    });

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="sc-beta-partner__success rounded-lg border border-professional-blue/30 bg-white p-8 text-center">
        <h2 className="text-xl font-bold text-deep-navy">{t("successTitle")}</h2>
        <p className="mt-3 text-sm text-body-charcoal">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sc-beta-partner__form space-y-5"
      noValidate
    >
      {submitError ? (
        <p className="rounded-lg border border-soft-red/40 bg-soft-red/5 px-4 py-3 text-sm text-soft-red">
          {submitError}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="beta-company" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("companyName")} *
          </label>
          <input
            id="beta-company"
            type="text"
            autoComplete="organization"
            value={form.companyName}
            onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
            className={fieldClass("companyName")}
          />
          {errors.companyName ? (
            <p className="mt-1 text-xs text-soft-red">{errors.companyName}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-contact" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("contactName")} *
          </label>
          <input
            id="beta-contact"
            type="text"
            autoComplete="name"
            value={form.contactName}
            onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))}
            className={fieldClass("contactName")}
          />
          {errors.contactName ? (
            <p className="mt-1 text-xs text-soft-red">{errors.contactName}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-email" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("email")} *
          </label>
          <input
            id="beta-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className={fieldClass("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-soft-red">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-country" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("country")} *
          </label>
          <input
            id="beta-country"
            type="text"
            autoComplete="country-name"
            value={form.country}
            onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            className={fieldClass("country")}
          />
          {errors.country ? (
            <p className="mt-1 text-xs text-soft-red">{errors.country}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-industry" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("industry")} *
          </label>
          <select
            id="beta-industry"
            value={form.industry}
            onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))}
            className={fieldClass("industry")}
          >
            <option value="">{t("selectPlaceholder")}</option>
            {BETA_INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.industry ? (
            <p className="mt-1 text-xs text-soft-red">{errors.industry}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-size" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("companySize")} *
          </label>
          <select
            id="beta-size"
            value={form.companySize}
            onChange={(e) => setForm((prev) => ({ ...prev, companySize: e.target.value }))}
            className={fieldClass("companySize")}
          >
            <option value="">{t("selectPlaceholder")}</option>
            {BETA_COMPANY_SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.companySize ? (
            <p className="mt-1 text-xs text-soft-red">{errors.companySize}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-role" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("role")} *
          </label>
          <input
            id="beta-role"
            type="text"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            className={fieldClass("role")}
          />
          {errors.role ? (
            <p className="mt-1 text-xs text-soft-red">{errors.role}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-loss-area" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("mainLossArea")} *
          </label>
          <input
            id="beta-loss-area"
            type="text"
            value={form.mainLossArea}
            onChange={(e) => setForm((prev) => ({ ...prev, mainLossArea: e.target.value }))}
            className={fieldClass("mainLossArea")}
          />
          {errors.mainLossArea ? (
            <p className="mt-1 text-xs text-soft-red">{errors.mainLossArea}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-method" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("currentMethod")} *
          </label>
          <input
            id="beta-method"
            type="text"
            value={form.currentMethod}
            onChange={(e) => setForm((prev) => ({ ...prev, currentMethod: e.target.value }))}
            className={fieldClass("currentMethod")}
          />
          {errors.currentMethod ? (
            <p className="mt-1 text-xs text-soft-red">{errors.currentMethod}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="beta-loss-range" className="mb-1 block text-sm font-medium text-deep-navy">
            {t("monthlyEstimatedLossRange")} *
          </label>
          <select
            id="beta-loss-range"
            value={form.monthlyEstimatedLossRange}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, monthlyEstimatedLossRange: e.target.value }))
            }
            className={fieldClass("monthlyEstimatedLossRange")}
          >
            <option value="">{t("selectPlaceholder")}</option>
            {BETA_LOSS_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.monthlyEstimatedLossRange ? (
            <p className="mt-1 text-xs text-soft-red">{errors.monthlyEstimatedLossRange}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="beta-notes" className="mb-1 block text-sm font-medium text-deep-navy">
          {t("notes")}
        </label>
        <textarea
          id="beta-notes"
          rows={4}
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          className={[inputClass, inputOkClass, "min-h-[120px] py-3"].join(" ")}
        />
        {errors.notes ? (
          <p className="mt-1 text-xs text-soft-red">{errors.notes}</p>
        ) : null}
      </div>

      <label className="flex min-h-[44px] items-start gap-3">
        <input
          type="checkbox"
          checked={form.wantsCaseStudyPermission}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, wantsCaseStudyPermission: e.target.checked }))
          }
          className="mt-1"
        />
        <span className="text-sm text-body-charcoal">{t("caseStudyPermission")}</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="sc-cta-primary min-h-[48px] w-full md:w-auto md:px-8"
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
