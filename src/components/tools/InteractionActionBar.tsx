"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Code2,
  MessageSquare,
  Quote,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  buildEmbedCode,
  buildQuoteText,
  buildShareUrl,
  copyTextToClipboard,
  formatCount,
  getCurrentUrl,
  openShareWindow,
  type SharePlatform,
} from "@/lib/interaction-action-bar/helpers";

export type InteractionActionBarProps = {
  readonly likeCount: number | string;
  readonly liked?: boolean;
  readonly disliked?: boolean;
  readonly title?: string;
  readonly excerpt?: string;
  readonly siteName?: string;
  readonly url?: string;
  readonly embedUrl?: string;
  readonly onLike?: () => void;
  readonly onDislike?: () => void;
  readonly onFeedback?: () => void;
  readonly onShare?: (platform: SharePlatform) => void;
  readonly onEmbed?: () => void;
  readonly onQuote?: () => void;
  readonly compact?: boolean;
};

type ShareMenuItem = {
  readonly id: SharePlatform;
  readonly labelKey: string;
};

const SHARE_MENU_ITEMS: readonly ShareMenuItem[] = [
  { id: "copy", labelKey: "shareCopyLink" },
  { id: "facebook", labelKey: "shareFacebook" },
  { id: "x", labelKey: "shareX" },
  { id: "linkedin", labelKey: "shareLinkedIn" },
  { id: "pinterest", labelKey: "sharePinterest" },
  { id: "reddit", labelKey: "shareReddit" },
  { id: "embed", labelKey: "shareEmbed" },
  { id: "quote", labelKey: "shareQuote" },
] as const;

const actionButtonClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#CBD3E1] bg-white px-3 text-[#30343B] transition hover:border-[#A8B4C7] hover:bg-[#F1F5F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]";

function resolveSizing(compact: boolean): {
  readonly shell: string;
  readonly segment: string;
  readonly count: string;
} {
  if (compact) {
    return {
      shell: "min-h-11",
      segment: "min-h-11 min-w-10 md:min-w-11",
      count: "min-w-[2.75rem] text-sm",
    };
  }
  return {
    shell: "min-h-11 md:min-h-[72px]",
    segment: "min-h-11 min-w-11 md:min-h-[72px] md:min-w-[72px]",
    count: "min-w-[3rem] text-sm md:min-w-[4.5rem] md:text-base",
  };
}

export function InteractionActionBar({
  likeCount,
  liked = false,
  disliked = false,
  title = "",
  excerpt,
  siteName = "SectorCalc",
  url,
  embedUrl,
  onLike,
  onDislike,
  onFeedback,
  onShare,
  onEmbed,
  onQuote,
  compact = false,
}: InteractionActionBarProps) {
  const t = useTranslations("generatedTool.interactionActionBar");
  const sizing = resolveSizing(compact);
  const shareMenuId = useId();
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const embedTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  const [shareOpen, setShareOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const formattedLikeCount = formatCount(likeCount);
  const pageUrl = resolvedUrl || url || "";
  const iframeUrl = embedUrl ?? pageUrl;
  const embedCode = buildEmbedCode(iframeUrl, title || siteName);
  const quoteText = buildQuoteText(title, siteName, pageUrl, excerpt);

  useEffect(() => {
    if (!url) {
      setResolvedUrl(getCurrentUrl());
    }
  }, [url]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  const closeOverlays = useCallback(() => {
    setShareOpen(false);
    setEmbedOpen(false);
    setQuoteOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlays();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOverlays]);

  useEffect(() => {
    if (!shareOpen) {
      return undefined;
    }
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (
        shareMenuRef.current?.contains(target) ||
        shareButtonRef.current?.contains(target)
      ) {
        return;
      }
      setShareOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [shareOpen]);

  useEffect(() => {
    if (embedOpen) {
      embedTextareaRef.current?.focus();
    }
  }, [embedOpen]);

  const handleShareAction = async (platform: SharePlatform) => {
    onShare?.(platform);
    setShareOpen(false);

    if (platform === "copy") {
      const copied = await copyTextToClipboard(pageUrl);
      showToast(copied ? t("linkCopied") : t("copyFailed"));
      return;
    }

    if (platform === "embed") {
      if (onEmbed) {
        onEmbed();
        return;
      }
      setEmbedOpen(true);
      return;
    }

    if (platform === "quote") {
      if (onQuote) {
        onQuote();
        return;
      }
      setQuoteOpen(true);
      return;
    }

    const shareTarget = buildShareUrl(platform, pageUrl, title || siteName);
    openShareWindow(shareTarget);
  };

  const handleFeedback = () => {
    if (onFeedback) {
      onFeedback();
      return;
    }
    const feedbackAnchor = document.getElementById("feedback");
    if (feedbackAnchor) {
      feedbackAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEmbedCopy = async () => {
    const copied = await copyTextToClipboard(embedCode);
    showToast(copied ? t("embedCopied") : t("copyFailed"));
  };

  const handleQuoteCopy = async () => {
    const selectedText =
      typeof window !== "undefined" ? window.getSelection()?.toString() : undefined;
    const text = buildQuoteText(title, siteName, pageUrl, excerpt, selectedText);
    const copied = await copyTextToClipboard(text);
    showToast(copied ? t("quoteCopied") : t("copyFailed"));
  };

  const handleEmbedButton = () => {
    if (onEmbed) {
      onEmbed();
      return;
    }
    setEmbedOpen(true);
  };

  const handleQuoteButton = () => {
    if (onQuote) {
      onQuote();
      return;
    }
    setQuoteOpen(true);
  };

  return (
    <div className="relative">
      <div className="flex items-stretch gap-4 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={[
            "inline-flex shrink-0 items-stretch overflow-hidden rounded-xl border border-[#CBD3E1] bg-[#F8FAFC]",
            sizing.shell,
          ].join(" ")}
          role="group"
          aria-label={t("reactionGroupLabel")}
        >
          <button
            type="button"
            onClick={onLike}
            title={t("likeTooltip")}
            aria-label={t("likeAria")}
            aria-pressed={liked}
            className={[
              "inline-flex items-center justify-center px-3 transition hover:bg-[#EEF2F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B82F6]",
              sizing.segment,
              liked ? "bg-[#E8F5EE] text-[#15803D]" : "text-[#30343B]",
            ].join(" ")}
          >
            <ThumbsUp className="h-5 w-5" aria-hidden="true" />
          </button>

          <span
            className={[
              "inline-flex items-center justify-center border-x border-[#CBD3E1] px-3 font-semibold text-[#30343B]",
              sizing.count,
            ].join(" ")}
            aria-label={t("likeCountLabel", { count: formattedLikeCount })}
          >
            {formattedLikeCount}
          </span>

          <button
            type="button"
            onClick={onDislike}
            title={t("dislikeTooltip")}
            aria-label={t("dislikeAria")}
            aria-pressed={disliked}
            className={[
              "inline-flex items-center justify-center px-3 transition hover:bg-[#EEF2F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B82F6]",
              sizing.segment,
              disliked ? "bg-[#FCEBEB] text-[#B91C1C]" : "text-[#30343B]",
            ].join(" ")}
          >
            <ThumbsDown className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleFeedback}
          title={t("feedbackTooltip")}
          aria-label={t("feedbackAria")}
          className={actionButtonClass}
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative shrink-0">
          <button
            ref={shareButtonRef}
            type="button"
            onClick={() => setShareOpen((open) => !open)}
            title={t("shareTooltip")}
            aria-label={t("shareAria")}
            aria-expanded={shareOpen}
            aria-controls={shareMenuId}
            className={actionButtonClass}
          >
            <Share2 className="h-5 w-5" aria-hidden="true" />
          </button>

          {shareOpen ? (
            <div
              ref={shareMenuRef}
              id={shareMenuId}
              role="menu"
              className="absolute left-0 top-[calc(100%+0.5rem)] z-30 min-w-[12rem] rounded-xl border border-[#CBD3E1] bg-white p-1 shadow-lg"
            >
              {SHARE_MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => void handleShareAction(item.id)}
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-[#30343B] transition hover:bg-[#F1F5F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#3B82F6]"
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleEmbedButton}
          title={t("embedTooltip")}
          aria-label={t("embedAria")}
          className={actionButtonClass}
        >
          <Code2 className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleQuoteButton}
          title={t("quoteTooltip")}
          aria-label={t("quoteAria")}
          className={actionButtonClass}
        >
          <Quote className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {toast ? (
        <p
          role="status"
          className="absolute left-0 top-[calc(100%+0.35rem)] text-xs font-medium text-[#15803D]"
        >
          {toast}
        </p>
      ) : null}

      {embedOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={closeOverlays}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="embed-dialog-title"
            className="w-full max-w-xl rounded-xl border border-[#CBD3E1] bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="embed-dialog-title" className="text-base font-semibold text-[#30343B]">
              {t("embedDialogTitle")}
            </h2>
            <textarea
              ref={embedTextareaRef}
              readOnly
              value={embedCode}
              rows={4}
              className="mt-3 w-full rounded-lg border border-[#CBD3E1] bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-[#30343B]"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeOverlays}
                className="rounded-lg border border-[#CBD3E1] px-3 py-2 text-sm text-[#30343B] hover:bg-[#F1F5F9]"
              >
                {t("close")}
              </button>
              <button
                type="button"
                onClick={() => void handleEmbedCopy()}
                className="rounded-lg bg-[#30343B] px-3 py-2 text-sm font-medium text-white hover:bg-[#1F2937]"
              >
                {t("copyCode")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {quoteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={closeOverlays}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-dialog-title"
            className="w-full max-w-xl rounded-xl border border-[#CBD3E1] bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="quote-dialog-title" className="text-base font-semibold text-[#30343B]">
              {t("quoteDialogTitle")}
            </h2>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-[#CBD3E1] bg-[#F8FAFC] px-3 py-2 text-sm text-[#30343B]">
              {quoteText}
            </pre>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeOverlays}
                className="rounded-lg border border-[#CBD3E1] px-3 py-2 text-sm text-[#30343B] hover:bg-[#F1F5F9]"
              >
                {t("close")}
              </button>
              <button
                type="button"
                onClick={() => void handleQuoteCopy()}
                className="rounded-lg bg-[#30343B] px-3 py-2 text-sm font-medium text-white hover:bg-[#1F2937]"
              >
                {t("copyQuote")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
