"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { Route, Send, Sparkles, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { TraceLivingAvatar } from "@/components/trace/TraceLivingAvatar";
import { SectorCalcLogo } from "@/components/ui/SectorCalcLogo";
import type { TraceChatMessage } from "@/components/trace/trace-chat-shared";

type TraceChatPanelProps = {
  readonly mode: "free" | "pro";
  readonly messages: readonly TraceChatMessage[];
  readonly loading: boolean;
  readonly error: boolean;
  readonly errorDetail?: string;
  readonly input: string;
  readonly onInputChange: (value: string) => void;
  readonly onSend: (message: string) => void;
  readonly onClose?: () => void;
  readonly quickActions: readonly {
    readonly key: string;
    readonly label: string;
    readonly message: string;
  }[];
  readonly messagesEndRef: RefObject<HTMLDivElement | null>;
  readonly labels: {
    readonly loading: string;
    readonly error: string;
    readonly placeholder: string;
    readonly send: string;
    readonly proBadge: string;
    readonly freeTagline: string;
    readonly freeTaglineLink: string;
    readonly disclaimer: string;
    readonly title: string;
    readonly tagline: string;
    readonly close: string;
  };
  readonly showUpsell: boolean;
};

export function TraceChatPanel({
  mode,
  messages,
  loading,
  error,
  errorDetail,
  input,
  onInputChange,
  onSend,
  onClose,
  quickActions,
  messagesEndRef,
  labels,
  showUpsell,
}: TraceChatPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const hasUserMessages = messages.some((entry) => entry.role === "user");

  const latestSuggestions = [...messages]
    .reverse()
    .find((entry) => entry.role === "assistant" && entry.suggestions?.length)
    ?.suggestions;

  // ── Auto-focus input on mount ──
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ── Scroll anchoring: snap to bottom on new content ──
  useEffect(() => {
    const el = messagesEndRef.current?.parentElement;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, messagesEndRef]);

  // ── Send handler ──
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSend(input);
    },
    [input, onSend],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend(input);
      }
      // Escape closes the panel
      if (e.key === "Escape" && onClose) {
        e.stopPropagation();
        onClose();
      }
    },
    [input, onClose, onSend],
  );

  return (
    <div
      ref={shellRef}
      className="sc-trace__shell"
      id="trace-chat-panel"
    >
      {/* ── Header ── */}
      <header className="sc-trace__header">
        <div className="sc-trace__header-main">
          <SectorCalcLogo
            width={28}
            height={28}
            inverted
            className="sc-trace__header-logo"
          />
          {mode === "pro" ? (
            <Sparkles className="sc-trace__header-icon" aria-hidden />
          ) : (
            <TraceLivingAvatar size="sm" className="sc-trace__header-avatar" />
          )}
          <div className="sc-trace__header-copy">
            <span className="sc-trace__header-title">{labels.title}</span>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            className="sc-trace__header-close"
            onClick={onClose}
            aria-label={labels.close}
          >
            <X className="sc-trace__header-close-icon" aria-hidden />
          </button>
        ) : null}
      </header>

      {mode === "pro" ? (
        <p className="sc-trace__pro-badge">{labels.proBadge}</p>
      ) : null}

      {/* ── Body / Messages ── */}
      <div className="sc-trace__body" role="log" aria-live="polite" aria-relevant="additions">
        {!hasUserMessages ? (
          <div className="sc-trace__quick">
            <WelcomeMessage text={messages[0]?.text ?? ""} />
            <div className="sc-trace__quick-actions" role="group" aria-label="Quick actions">
              {quickActions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  className="sc-trace__quick-btn"
                  onClick={() => onSend(action.message)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="sc-trace__messages">
            {messages.map((msg, idx) => (
              <li
                key={msg.id}
                className={`sc-trace__msg-row sc-trace__msg-row--${msg.role}`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div
                  className={`sc-trace__bubble sc-trace__bubble--${msg.role}`}
                >
                  <p>{msg.text}</p>
                </div>
                {msg.suggestions && msg.suggestions.length > 0 ? (
                  <ul className="sc-trace__suggestions-inline">
                    {msg.suggestions.map((suggestion) => (
                      <li key={`${suggestion.slug}-${suggestion.href}`}>
                        <Link
                          href={suggestion.href}
                          className="sc-trace__suggestion"
                        >
                          {suggestion.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {/* ── Typing indicator ── */}
        {loading ? (
          <div className="sc-trace__typing" aria-label={labels.loading}>
            <span className="sc-trace__typing-dot" />
            <span className="sc-trace__typing-dot sc-trace__typing-dot--delay-1" />
            <span className="sc-trace__typing-dot sc-trace__typing-dot--delay-2" />
          </div>
        ) : null}

        {/* ── Error state ── */}
        {error ? (
          <div className="sc-trace__status sc-trace__status--error" role="alert">
            <p>{errorDetail ?? labels.error}</p>
          </div>
        ) : null}

        {/* ── Suggestions bar ── */}
        {latestSuggestions && latestSuggestions.length > 0 && hasUserMessages ? (
          <ul className="sc-trace__suggestions-bar">
            {latestSuggestions.map((suggestion) => (
              <li key={`${suggestion.slug}-${suggestion.href}`}>
                <Link href={suggestion.href} className="sc-trace__suggestion">
                  {suggestion.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Composer ── */}
      <div className="sc-trace__composer">
        <form className="sc-trace__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="sc-trace__input"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={labels.placeholder}
            aria-label={labels.placeholder}
            autoComplete="off"
            maxLength={mode === "pro" ? 2000 : 1000}
          />
          <button
            type="submit"
            className={`sc-trace__send ${mode === "pro" ? "sc-trace__send--pro" : ""}`}
            disabled={loading || !input.trim()}
            aria-label={labels.send}
          >
            <Send className="sc-trace__send-icon" aria-hidden />
          </button>
        </form>

        {showUpsell ? (
          <p className="sc-trace__footer-note">
            {labels.freeTagline}{" "}
            <Link href="/login" className="sc-trace__footer-link">
              {labels.freeTaglineLink}
            </Link>
          </p>
        ) : null}

        <p className="sc-trace__disclaimer">{labels.disclaimer}</p>
      </div>
    </div>
  );
}

function WelcomeMessage({ text }: { readonly text: string }) {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) return null;

  const [lead, ...rest] = lines;

  return (
    <div className="sc-trace__welcome-block">
      <p className="sc-trace__welcome-lead">{lead}</p>
      {rest.length > 0 ? (
        <p className="sc-trace__welcome">{rest.join("\n")}</p>
      ) : null}
    </div>
  );
}
