"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getSavedDrafts } from "@/lib/field-mode/saved-drafts";

export function SavedDraftNotice() {
  const t = useTranslations("fieldMode");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getSavedDrafts().length);
  }, []);

  return (
    <div>
      <h3 className="text-sm font-semibold text-navy">{t("savedDrafts")}</h3>
      <p className="mt-1 text-sm text-body-charcoal">
        {count === 0 ? t("noDrafts") : `${count}`}
      </p>
      <p className="mt-1 text-xs text-body-charcoal">{t("staleDataWarning")}</p>
    </div>
  );
}
