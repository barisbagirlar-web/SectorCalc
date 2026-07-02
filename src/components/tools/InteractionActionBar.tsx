"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/lib/i18n-stub";
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
  getSelectedPageText,
  isExternalSharePlatform,
  type SharePlatform,
} from "@/components/tools/interaction-action-bar-utils";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export type { SharePlatform };

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
  /** Premium catalog / industry premium tools: embed disabled. */
  readonly showEmbed?: boolean;
};

type ShareMenuItem = {
  readonly id: SharePlatform;
  readonly labelKey: string;
};

const SHARE_MENU_ITEMS: readonly ShareMenuItem[] = [
  { id: "copy", labelKey: "shareCopyLink" },
  { id: "linkedin", labelKey: "shareLinkedIn" },
  { id: "x", labelKey: "shareX" },
  { id: "reddit", labelKey: "shareReddit" },
  { id: "facebook", labelKey: "shareFacebook" },
  { id: "pinterest", labelKey: "sharePinterest" },
  { id: "embed", labelKey: "shareEmbed" },
  { id: "quote", labelKey: "shareQuote" },
] as const;

type ShareMenuPosition = {
  readonly top: number;
  readonly left: number;
};

const shareMenuItemClass =
  "flex w-full rounded-lg px-3 py-2 text-left text-sm text-[#1A1915] hover:bg-kil-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1A1915]";

const iconClass = "h-4 w-4";

const actionButtonClass =
  "inline-flex h-10 min-h-10 w-10 min-w-10 shrink-0 items-center justify-center rounded-lg border border-[rgba(26,25,21,0.10)] bg-kil-surface text-[#1A1915] transition hover:border-[#696764] hover:bg-kil-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1915]";

const reactionGroupClass =
  "inline-flex h-10 shrink-0 items-stretch overflow-hidden rounded-lg border border-[rgba(26,25,21,0.10)] bg-[#F0EEE6]";

const reactionSideButtonClass =
  "inline-flex h-10 min-h-10 min-w-10 items-center justify-center px-2 text-[#1A1915] transition hover:bg-kil-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1A1915]";

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
  showEmbed = false,
}: InteractionActionBarProps) {
  const t = useTranslations("generatedTool.interactionActionBar");
  const shareMenuId = useId();
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const embedDialogRef = useRef<HTMLDivElement>(null);
  const quoteDialogRef = useRef<HTMLDivElement>(null);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareMenuPosition, setShareMenuPosition] = useState<ShareMenuPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  const [quoteText, setQuoteText] = useState("");
  const [localLiked, setLocalLiked] = useState(false);
  const [localDisliked, setLocalDisliked] = useState(false);

  const isControlled = onLike !== undefined || onDislike !== undefined;
  const isLiked = isControlled ? Boolean(liked) : localLiked;
  const isDisliked = isControlled ? Boolean(disliked) : localDisliked;

  const formattedLikeCount = formatCount(likeCount);
  const resolvedEmbedUrl = embedUrl ?? resolvedUrl;
  const embedCode = buildEmbedCode(resolvedEmbedUrl, title || siteName);
  const shareMenuItems = useMemo(
    () => (showEmbed ? SHARE_MENU_ITEMS : SHARE_MENU_ITEMS.filter((item) => item.id !== "embed")),
    [showEmbed],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (url) {
      setResolvedUrl(url);
      return;
    }
    setResolvedUrl(getCurrentUrl());
  }, [url]);

  const updateShareMenuPosition = useCallback(() => {
    const rect = shareButtonRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    setShareMenuPosition({
      top: rect.bottom + 8,
      left: Math.max(8, rect.left),
    });
  }, []);

  const toggleShareMenu = useCallback(() => {
    setShareOpen((current) => {
      if (current) {
        return false;
      }
      updateShareMenuPosition();
      return true;
    });
  }, [updateShareMenuPosition]);

  useEffect(() => {
    if (!shareOpen) {
      return;
    }

    updateShareMenuPosition();
    const handleReposition = () => updateShareMenuPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [shareOpen, updateShareMenuPosition]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  const closeAllOverlays = useCallback(() => {
    setShareOpen(false);
    setEmbedOpen(false);
    setQuoteOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      closeAllOverlays();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeAllOverlays]);

  useEffect(() => {
    if (!shareOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
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
    if (!embedOpen) {
      return;
    }
    embedDialogRef.current?.querySelector<HTMLElement>("textarea")?.focus();
  }, [embedOpen]);

  useEffect(() => {
    if (!quoteOpen) {
      return;
    }
    quoteDialogRef.current?.querySelector<HTMLElement>("textarea")?.focus();
  }, [quoteOpen]);

  useFocusTrap(embedOpen, embedDialogRef);
  useFocusTrap(quoteOpen, quoteDialogRef);

  const handleLikeClick = () => {
    if (onLike) {
      onLike();
      return;
    }
    setLocalLiked(true);
    setLocalDisliked(false);
  };

  const handleDislikeClick = () => {
    if (onDislike) {
      onDislike();
      return;
    }
    setLocalDisliked(true);
    setLocalLiked(false);
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

  const openEmbedModal = () => {
    if (onEmbed) {
      onEmbed();
      return;
    }
    setEmbedOpen(true);
  };

  const openQuoteModal = () => {
    const nextQuote = buildQuoteText(
      title || siteName,
      siteName,
      resolvedUrl,
      excerpt,
      getSelectedPageText(),
    );
    setQuoteText(nextQuote);

    if (onQuote) {
      onQuote();
      return;
    }

    setQuoteOpen(true);
  };

  const handleShareItem = async (platform: SharePlatform) => {
    onShare?.(platform);
    setShareOpen(false);

    if (platform === "copy") {
      const shareUrl = resolvedUrl.trim() || getCurrentUrl();
      const copied = await copyTextToClipboard(shareUrl);
      if (copied) {
        showToast(t("linkCopied"));
      }
      return;
    }

    if (platform === "embed") {
      openEmbedModal();
      return;
    }

    if (platform === "quote") {
      openQuoteModal();
      return;
    }
  };

  const shareTitle = title || siteName;
  const sharePageUrl = resolvedUrl.trim() || getCurrentUrl();

  const handleCopyEmbed = async () => {
    const copied = await copyTextToClipboard(embedCode);
    if (copied) {
      showToast(t("embedCopied"));
    }
  };

  const handleCopyQuote = async () => {
    const copied = await copyTextToClipboard(quoteText);
    if (copied) {
      showToast(t("quoteCopied"));
      setQuoteOpen(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-wrap items-center gap-2">
        <div className={reactionGroupClass} role="group" aria-label={t("reactionGroupLabel")}>
          <button
            type="button"
            className={[
              reactionSideButtonClass,
              isLiked ? "bg-sky-50 text-sky-700" : "",
            ].join(" ")}
            title={t("likeTooltip")}
            aria-label={t("likeAria")}
            aria-pressed={isLiked}
            onClick={handleLikeClick}
          >
            <ThumbsUp className={iconClass} aria-hidden="true" />
          </button>

          <span
            className="flex min-w-[2.5rem] items-center justify-center border-x border-[#CBD3E1] px-2 text-xs font-semibold text-[#1A1915]"
            aria-hidden="true"
          >
            {formattedLikeCount}
          </span>

          <button
            type="button"
            className={[
              reactionSideButtonClass,
              isDisliked ? "bg-rose-50 text-rose-700" : "",
            ].join(" ")}
            title={t("dislikeTooltip")}
            aria-label={t("dislikeAria")}
            aria-pressed={isDisliked}
            onClick={handleDislikeClick}
          >
            <ThumbsDown className={iconClass} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className={actionButtonClass}
          title={t("feedbackTooltip")}
          aria-label={t("feedbackAria")}
          onClick={handleFeedback}
        >
          <MessageSquare className={iconClass} aria-hidden="true" />
        </button>

        <div className="relative shrink-0">
          <button
            ref={shareButtonRef}
            type="button"
            className={[
              actionButtonClass,
              shareOpen ? "border-slate-500 bg-slate-50" : "",
            ].join(" ")}
            title={t("shareTooltip")}
            aria-label={t("shareAria")}
            aria-haspopup="menu"
            aria-expanded={shareOpen}
            aria-controls={shareMenuId}
            onClick={toggleShareMenu}
          >
            <Share2 className={iconClass} aria-hidden="true" />
          </button>

          {shareOpen && mounted && shareMenuPosition
            ? createPortal(
                <div
                  ref={shareMenuRef}
                  id={shareMenuId}
                  role="menu"
                  aria-label={t("shareMenuLabel")}
                  className="sc-interaction-share-menu"
                  style={{
                    top: shareMenuPosition.top,
                    left: shareMenuPosition.left,
                  }}
                >
                  {shareMenuItems.map((item) => {
                    if (isExternalSharePlatform(item.id)) {
                      const href = buildShareUrl(item.id, sharePageUrl, shareTitle);
                      if (!href) {
                        return null;
                      }
                      return (
                        <a
                          key={item.id}
                          href={href}
                          role="menuitem"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={shareMenuItemClass}
                          onClick={() => {
                            onShare?.(item.id);
                            setShareOpen(false);
                          }}
                        >
                          {t(item.labelKey)}
                        </a>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        className={shareMenuItemClass}
                        onClick={() => void handleShareItem(item.id)}
                      >
                        {t(item.labelKey)}
                      </button>
                    );
                  })}
                </div>,
                document.body,
              )
            : null}
        </div>

        {showEmbed ? (
          <button
            type="button"
            className={actionButtonClass}
            title={t("embedTooltip")}
            aria-label={t("embedAria")}
            onClick={openEmbedModal}
          >
            <Code2 className={iconClass} aria-hidden="true" />
          </button>
        ) : null}

        <button
          type="button"
          className={actionButtonClass}
          title={t("quoteTooltip")}
          aria-label={t("quoteAria")}
          onClick={openQuoteModal}
        >
          <Quote className={iconClass} aria-hidden="true" />
        </button>
      </div>

      {toast ? (
        <p className="mt-2 text-xs text-slate-600" role="status" aria-live="polite">
          {toast}
        </p>
      ) : null}

      {embedOpen && showEmbed ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="interaction-embed-title"
          onClick={() => setEmbedOpen(false)}
        >
          <div
            ref={embedDialogRef}
            className="w-full max-w-xl rounded-xl border border-[#CBD3E1] bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="interaction-embed-title" className="text-sm font-semibold text-[#1A1915]">
              {t("embedModalTitle")}
            </h3>
            <textarea
              readOnly
              value={embedCode}
              rows={4}
              className="mt-3 w-full rounded-lg border border-[#CBD3E1] bg-[#F8FAFC] p-3 font-mono text-xs text-[#1A1915]"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-[#CBD3E1] px-3 py-2 text-sm text-[#1A1915] hover:bg-kil-bg"
                onClick={() => setEmbedOpen(false)}
              >
                {t("close")}
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#30343B] px-3 py-2 text-sm text-white hover:bg-slate-800"
                onClick={() => void handleCopyEmbed()}
              >
                {t("embedCopyCode")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {quoteOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="interaction-quote-title"
          onClick={() => setQuoteOpen(false)}
        >
          <div
            ref={quoteDialogRef}
            className="w-full max-w-xl rounded-xl border border-[#CBD3E1] bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="interaction-quote-title" className="text-sm font-semibold text-[#1A1915]">
              {t("quoteModalTitle")}
            </h3>
            <textarea
              readOnly
              value={quoteText}
              rows={5}
              className="mt-3 w-full rounded-lg border border-[#CBD3E1] bg-[#F8FAFC] p-3 text-sm text-[#1A1915]"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-[#CBD3E1] px-3 py-2 text-sm text-[#1A1915] hover:bg-kil-bg"
                onClick={() => setQuoteOpen(false)}
              >
                {t("close")}
              </button>
              <button
                type="button"
                className="rounded-lg bg-[#30343B] px-3 py-2 text-sm text-white hover:bg-slate-800"
                onClick={() => void handleCopyQuote()}
              >
                {t("quoteCopy")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
