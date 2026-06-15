"use client";

import { useLocale, useTranslations } from "next-intl";
import { InteractionActionBar } from "@/components/tools/InteractionActionBar";
import {
  formatToolHelpfulCount,
  resolveToolHelpfulCount,
} from "@/lib/tools/resolve-tool-helpful-count";

const CREATOR_AVATAR_SRC = "/img/creators/neela-nataraj.png";

type ToolOmniMetaSectionProps = {
  readonly toolName: string;
  readonly slug: string;
  readonly isPremium: boolean;
  readonly liked?: boolean;
  readonly disliked?: boolean;
  readonly onLike?: () => void;
  readonly onDislike?: () => void;
  readonly onFeedback?: () => void;
  readonly excerpt?: string;
  readonly url?: string;
};

export function ToolOmniMetaSection({
  toolName,
  slug,
  isPremium,
  liked,
  disliked,
  onLike,
  onDislike,
  onFeedback,
  excerpt,
  url,
}: ToolOmniMetaSectionProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.toolMeta");

  const helpfulCount = resolveToolHelpfulCount(slug, isPremium);
  const formattedHelpfulCount = formatToolHelpfulCount(helpfulCount, locale);

  return (
    <section
      className="mb-4 rounded-xl border border-[#E8EDF2] bg-white px-4 py-3 shadow-sm"
      aria-label={t("sectionLabel")}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <img
            src={CREATOR_AVATAR_SRC}
            alt={t("creatorName")}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full border border-[#E2E8F0] object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-tight text-[#0F172A] sm:text-xl">
              {toolName}
            </h1>
            <p className="mt-0.5 text-sm text-[#64748B]">
              <span>{t("creatorsLabel")}</span>
              <span className="font-medium text-[#334155]">{t("creatorName")}</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xl font-bold leading-none text-[#16A34A] sm:text-2xl">
            {formattedHelpfulCount}
          </div>
          <p className="mt-0.5 max-w-[9rem] text-[0.6875rem] leading-snug text-[#94A3B8]">
            {t("helpfulLabel")}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-[#EEF2F6] pt-3">
        <InteractionActionBar
          likeCount={helpfulCount}
          liked={liked}
          disliked={disliked}
          title={toolName}
          excerpt={excerpt}
          siteName="SectorCalc"
          url={url}
          onLike={onLike}
          onDislike={onDislike}
          onFeedback={onFeedback}
          compact
        />
      </div>
    </section>
  );
}
