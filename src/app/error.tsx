"use client";

import { useEffect } from "react";
import { useTranslations } from "@/lib/i18n-stub";
import { Link } from "@/i18n/routing";

type LocaleErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

export default function LocaleError({ error, reset }: LocaleErrorProps) {
  const t = useTranslations("errors");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold text-premium-velvet">{t("errorPageTitle")}</h1>
      <p className="mt-3 text-sm leading-relaxed text-body-charcoal">
        {t("errorPageDescription")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-h-[44px] rounded-sm bg-deep-navy px-4 py-2 text-sm font-semibold text-white"
        >
          {t("pageTryAgain")}
        </button>
        <Link
          href="/calculator-library"
          className="inline-flex min-h-[44px] items-center rounded-sm border border-border-subtle px-4 py-2 text-sm font-semibold text-deep-navy"
        >
          {t("calculatorLibraryLink")}
        </Link>
      </div>
    </main>
  );
}
