"use client";

import { useEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { InteractionActionBar } from "@/components/tools/InteractionActionBar";
import { ToolCompactHeader } from "@/components/tools/ToolCompactHeader";
import { ToolBadge } from "@/components/tools/ToolBadge";
import { ToolReferenceCreatorAttribution } from "@/components/tools/ToolReferenceCreatorAttribution";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { useToolHelpfulVote } from "@/hooks/use-tool-helpful-vote";
import { buildToolPageCreatorJsonLd } from "@/lib/features/semantic/build-tool-creator-jsonld";
import {
  formatHelpfulCountDisplay,
  type ToolHelpfulCountTier,
} from "@/lib/features/tools/tool-helpful-count";
import {
  resolveGeneratedToolPath,
  resolvePremiumToolPath,
} from "@/lib/features/tools/paths";
import { absoluteLocalizedUrl } from "@/lib/features/semantic/site-url";
import { shouldOfferToolEmbed, buildEmbedUrl } from "@/lib/features/tools/embed-policy";

export type ToolOmniMetaSectionProps = {
  readonly toolName: string;
  readonly slug: string;
  readonly tier: ToolHelpfulCountTier;
  readonly excerpt?: string;
  readonly summary?: string;
  readonly keywordTags?: readonly string[];
  readonly icon?: LucideIcon;
  readonly canonicalPath?: string;
  /** Set when the route already emits tool JSON-LD (e.g. premium-schema pages). */
  readonly skipStructuredData?: boolean;
  /** Increment after recalculate to clear the active vote and revert its count delta. */
  readonly voteResetKey?: number;
  readonly onVoteFeedback?: (type: "up" | "down") => void | Promise<void>;
  readonly onFeedback?: () => void;
  readonly voteNotice?: string | null;
};

function resolveCanonicalPath(
  slug: string,
  tier: ToolHelpfulCountTier,
  canonicalPath?: string,
): string {
  if (canonicalPath) {
    return canonicalPath;
  }
  return tier === "premium" ? resolvePremiumToolPath(slug) : resolveGeneratedToolPath(slug);
}

export function ToolOmniMetaSection({
  toolName,
  slug,
  tier,
  excerpt,
  summary,
  keywordTags = [],
  icon,
  canonicalPath,
  skipStructuredData = false,
  voteResetKey = 0,
  onVoteFeedback,
  onFeedback,
  voteNotice,
}: ToolOmniMetaSectionProps) {
  const locale = useLocale();
  const t = useTranslations("generatedTool.omniMeta");
  const { helpfulCount, vote, applyVote, clearVote } = useToolHelpfulVote(slug, tier);

  const helpfulCountLabel = formatHelpfulCountDisplay(helpfulCount, locale);
  const resolvedCanonicalPath = resolveCanonicalPath(slug, tier, canonicalPath);
  const shareUrl = absoluteLocalizedUrl(locale, resolvedCanonicalPath);
  const showEmbed = shouldOfferToolEmbed(tier);
  const shareExcerpt = summary ?? excerpt;

  const creatorJsonLd = useMemo(
    () =>
      buildToolPageCreatorJsonLd({
        toolName,
        description: shareExcerpt,
        urlPath: resolvedCanonicalPath,
        locale,
      }),
    [locale, resolvedCanonicalPath, shareExcerpt, toolName],
  );

  useEffect(() => {
    if (voteResetKey > 0) {
      clearVote();
    }
  }, [voteResetKey, clearVote]);

  const handleLike = () => {
    applyVote("up");
    void onVoteFeedback?.("up");
  };

  const handleDislike = () => {
    applyVote("down");
    void onVoteFeedback?.("down");
  };

  return (
    <>
      {skipStructuredData ? null : <SemanticJsonLd data={creatorJsonLd} />}
      <section className="sc-tool-omni-meta" aria-label={t("sectionLabel")}>
        <div className="sc-tool-omni-meta__top">
          <div className="sc-tool-omni-meta__main">
            <ToolBadge />
            {icon ? (
              <>
                <ToolCompactHeader
                  toolName={toolName}
                  summary={summary ?? excerpt ?? ""}
                  keywordTags={keywordTags}
                  icon={icon}
                />
                <ToolReferenceCreatorAttribution belowHeader />
              </>
            ) : (
              <ToolReferenceCreatorAttribution
                toolName={toolName}
                shareExcerpt={shareExcerpt}
              />
            )}
          </div>

          <p className="sc-tool-omni-meta__helpful">
            <span className="sc-tool-omni-meta__helpful-count">{helpfulCountLabel}</span>{" "}
            <span className="sc-tool-omni-meta__helpful-label">{t("helpfulLabel")}</span>
          </p>
        </div>

        <div className="sc-tool-omni-meta__actions">
          <InteractionActionBar
            likeCount={helpfulCount}
            liked={vote === "up"}
            disliked={vote === "down"}
            title={toolName}
            excerpt={shareExcerpt}
            siteName="SectorCalc"
            url={shareUrl}
            embedUrl={showEmbed ? buildEmbedUrl(shareUrl, locale, slug) : undefined}
            showEmbed={showEmbed}
            onLike={handleLike}
            onDislike={handleDislike}
            onFeedback={onFeedback}
          />
          {voteNotice ? (
            <p className="sc-tool-omni-meta__notice" role="status">
              {voteNotice}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
