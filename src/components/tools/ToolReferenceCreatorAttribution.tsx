"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { TOOL_REFERENCE_CREATOR } from "@/config/tool-reference-creator";

export type ToolReferenceCreatorAttributionProps = {
  readonly toolName?: string;
  readonly shareExcerpt?: string;
  readonly belowHeader?: boolean;
};

export function ToolReferenceCreatorAttribution({
  toolName,
  shareExcerpt,
  belowHeader = false,
}: ToolReferenceCreatorAttributionProps) {
  const t = useTranslations("generatedTool.omniMeta");
  const identityClassName = belowHeader
    ? "sc-tool-omni-meta__identity sc-tool-omni-meta__identity--below-header"
    : "sc-tool-omni-meta__identity";

  return (
    <div className={identityClassName}>
      <a
        href={TOOL_REFERENCE_CREATOR.profileUrl}
        className="sc-tool-omni-meta__avatar-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("creatorProfileAria")}
      >
        <img
          src={TOOL_REFERENCE_CREATOR.imagePath}
          alt=""
          width={40}
          height={40}
          className="sc-tool-omni-meta__avatar"
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="sc-tool-omni-meta__copy">
        {toolName ? <h1 className="sc-tool-omni-meta__title">{toolName}</h1> : null}
        {shareExcerpt ? <p className="sc-tool-omni-meta__summary">{shareExcerpt}</p> : null}
        <p className="sc-tool-omni-meta__line">
          <span className="sc-tool-omni-meta__label">{t("creatorsLabel")}</span>
          <a
            href={TOOL_REFERENCE_CREATOR.profileUrl}
            className="sc-tool-omni-meta__name-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("creatorProfileAria")}
          >
            {t("creatorName")}
            <ExternalLink className="sc-tool-omni-meta__name-icon" aria-hidden="true" />
          </a>
        </p>
        <p className="sc-tool-omni-meta__affiliation">{TOOL_REFERENCE_CREATOR.affiliation.name}</p>
      </div>
    </div>
  );
}
