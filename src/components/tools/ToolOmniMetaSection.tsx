"use client";

import { useTranslations } from "next-intl";

const CREATOR_AVATAR_SRC = "/img/creators/neela-nataraj.png";

type ToolOmniMetaSectionProps = {
  readonly toolTitle: string;
};

const SOCIAL_STATS = [
  { id: "likes", label: "1K", icon: "★" },
  { id: "hearts", label: "1K", icon: "♥" },
  { id: "bookmarks", label: "1K", icon: "◆" },
  { id: "shares", label: "1K", icon: "↗" },
  { id: "views", label: "1K", icon: "▣" },
  { id: "comments", label: "1K", icon: "…" },
] as const;

export function ToolOmniMetaSection({ toolTitle }: ToolOmniMetaSectionProps) {
  const t = useTranslations("generatedTool.omniMeta");

  return (
    <section className="sc-tool-omni-meta" aria-labelledby="tool-omni-meta-title">
      <div className="sc-tool-omni-meta__top">
        <div className="sc-tool-omni-meta__identity">
          <div className="sc-tool-omni-meta__avatar-ring" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CREATOR_AVATAR_SRC}
              alt={t("creatorName")}
              className="sc-tool-omni-meta__avatar"
              width={48}
              height={48}
              loading="lazy"
            />
          </div>

          <div className="sc-tool-omni-meta__copy">
            <h1 id="tool-omni-meta-title" className="sc-tool-omni-meta__title">
              {toolTitle}
            </h1>
            <p className="sc-tool-omni-meta__credit-line">
              <span className="sc-tool-omni-meta__credit-label">{t("creatorsLabel")}</span>
              <span className="sc-tool-omni-meta__credit-name">{t("creatorName")}</span>
            </p>
            <p className="sc-tool-omni-meta__credit-line">
              <span className="sc-tool-omni-meta__credit-label">{t("reviewersLabel")}</span>
              <span className="sc-tool-omni-meta__credit-name">{t("reviewerNames")}</span>
            </p>
          </div>
        </div>

        <div className="sc-tool-omni-meta__helpful">
          <div className="sc-tool-omni-meta__helpful-count">{t("helpfulCount")}</div>
          <div className="sc-tool-omni-meta__helpful-label">{t("helpfulLabel")}</div>
        </div>
      </div>

      <div className="sc-tool-omni-meta__actions" role="group" aria-label={t("socialActionsLabel")}>
        {SOCIAL_STATS.map((stat) => (
          <span key={stat.id} className="sc-tool-omni-meta__action">
            <span className="sc-tool-omni-meta__action-icon" aria-hidden="true">
              {stat.icon}
            </span>
            <span>{stat.label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
