"use client";

import { useTranslations } from "next-intl";
import { clearRecentTools } from "@/lib/field-mode/recent-tools";
import { clearSavedDrafts } from "@/lib/field-mode/saved-drafts";
import { RecentTools } from "@/components/field-mode/RecentTools";
import { SavedDraftNotice } from "@/components/field-mode/SavedDraftNotice";
import { LowBandwidthToggle } from "@/components/field-mode/LowBandwidthToggle";
import { InstallPwaPrompt } from "@/components/field-mode/InstallPwaPrompt";

export function FieldModePanel() {
  const t = useTranslations("fieldMode");

  const clearAll = () => {
    clearRecentTools();
    clearSavedDrafts();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <section
      data-field-mode-panel="true"
      aria-labelledby="field-mode-heading"
      className="sc-industrial-panel mt-6 p-4 sm:p-6"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-copper">{t("eyebrow")}</p>
      <h2 id="field-mode-heading" className="mt-1 text-lg font-semibold text-navy">
        {t("title")}
      </h2>
      <p className="mt-1 text-sm text-body-charcoal">{t("subtitle")}</p>

      <div className="mt-4">
        <InstallPwaPrompt />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RecentTools />
        <SavedDraftNotice />
      </div>

      <div className="mt-4 border-t border-navy/10 pt-4">
        <LowBandwidthToggle />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-body-charcoal">{t("privacyNote")}</p>
        <button
          type="button"
          onClick={clearAll}
          className="min-h-[44px] rounded-lg border border-navy/15 px-4 text-sm font-medium text-navy"
        >
          {t("clearData")}
        </button>
      </div>
    </section>
  );
}
