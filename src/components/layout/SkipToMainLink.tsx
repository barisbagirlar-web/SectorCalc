"use client";

import { useTranslations } from "@/lib/i18n-stub";

export function SkipToMainLink() {
  const t = useTranslations("a11y");

  return (
    <a href="#main-content" className="sc-skip-link">
      {t("skipToMain")}
    </a>
  );
}
