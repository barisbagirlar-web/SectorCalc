"use client";

import { BadgeCheck } from "lucide-react";
import { useTranslations } from "@/lib/i18n-stub";
import { TOOL_REFERENCE_CREATOR } from "@/config/tool-reference-creator";

export function ToolBadge() {
  const t = useTranslations("generatedTool.omniMeta");

  return (
    <div className="sc-tool-academic-badge" role="group" aria-label={t("academicBadgeAria")}>
      <span className="sc-tool-academic-badge__pill">
        <BadgeCheck className="sc-tool-academic-badge__icon" aria-hidden="true" />
        {t("academicBadge")}
      </span>
      <span className="sc-tool-academic-badge__mr">
        {t("mrIdBadge", { mrId: TOOL_REFERENCE_CREATOR.mrId })}
      </span>
      <a
        href={TOOL_REFERENCE_CREATOR.mathSciNetUrl}
        className="sc-tool-academic-badge__link"
        target="_blank"
        rel="author noopener noreferrer"
        aria-label={t("mathSciNetAria", { name: TOOL_REFERENCE_CREATOR.name })}
      >
        {t("mathSciNetLinkLabel")} ↗
      </a>
    </div>
  );
}
