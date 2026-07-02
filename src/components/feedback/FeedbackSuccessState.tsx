"use client";

import { useTranslations } from "@/lib/i18n-stub";

export function FeedbackSuccessState() {
  const t = useTranslations("feedback");

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4">
      <p className="text-sm font-semibold text-deep-navy">{t("success.title")}</p>
      <p className="mt-1 text-sm text-body-charcoal">{t("success.description")}</p>
    </div>
  );
}
