"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatToolLastUpdatedDate } from "@/lib/features/generated-tools/format-tool-last-updated-date";

export type ToolLastUpdatedLabelProps = {
  readonly isoDate: string;
  readonly className?: string;
};

export function ToolLastUpdatedLabel({ isoDate, className }: ToolLastUpdatedLabelProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool");
  const formattedDate = formatToolLastUpdatedDate(isoDate, locale);

  return (
    <p
      className={["sc-tool-last-updated", className ?? ""].filter(Boolean).join(" ")}
      data-tool-last-updated={isoDate}
    >
      {t("lastUpdated", { date: formattedDate })}
    </p>
  );
}
