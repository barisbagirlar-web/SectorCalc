"use client";

import { useTranslations } from "next-intl";

export function SkipToMainLink() {
  const t = useTranslations("a11y");

  return (
    <a href="#main-content" className="sc-skip-link">
      {t("skipToMain")}
    </a>
  );
}
