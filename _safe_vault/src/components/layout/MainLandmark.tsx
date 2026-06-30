"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

type MainLandmarkProps = {
  readonly children: ReactNode;
};

export function MainLandmark({ children }: MainLandmarkProps) {
  const t = useTranslations("a11y");

  return (
    <main
      id="main-content"
      className="sc-app-main min-w-0"
      role="main"
      aria-label={t("mainContent")}
    >
      {children}
    </main>
  );
}
