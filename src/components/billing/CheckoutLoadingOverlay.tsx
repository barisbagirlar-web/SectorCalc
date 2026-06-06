"use client";

import { useTranslations } from "next-intl";

export function CheckoutLoadingOverlay() {
  const t = useTranslations("checkout");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/80">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-card dark:bg-slate-900">
        <div
          className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-professional-blue border-t-transparent"
          aria-hidden
        />
        <h3 className="text-lg font-bold text-deep-navy dark:text-off-white">
          {t("overlayTitle")}
        </h3>
        <p className="mt-2 text-sm text-slate">{t("overlayBody")}</p>
      </div>
    </div>
  );
}
