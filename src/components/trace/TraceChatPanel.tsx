"use client";

import type { RefObject } from "react";
import { Route, Send, Sparkles, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import { TraceLivingAvatar } from "@/components/trace/TraceLivingAvatar";
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
    readonly sectorAssistant: string;
    readonly tagline: string;
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
  const hasUserMessages = messages.some((entry) => entry.role === "user");
  const latestSuggestions = [...messages]
    .reverse()
    .find((entry) => entry.role === "assistant" && entry.suggestions?.length)?.suggestions;

  return (
    <div className="sc-trace__shell">
      <header className="sc-trace__header">
        <div className="sc-trace__header-main">
          {mode === "pro" ? (
            <Sparkles className="sc-trace__header-icon" aria-hidden />
          ) : (
            <TraceLivingAvatar size="sm" className="sc-trace__header-avatar" />
          )}
          <div className="sc-trace__header-copy">
            <span className="sc-trace__header-title">{labels.title}</span>
            <span className="sc-trace__header-meta">{labels.sectorAssistant}</span>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            className="sc-trace__header-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="sc-trace__header-close-icon" aria-hidden />
          </button>
        ) : null}
      </header>

      {mode === "pro" ? <p className="sc-trace__pro-badge">{labels.proBadge}</p> : null}

      <div className="sc-trace__body">
        {!hasUserMessages ? (
          <div className="sc-trace__quick">
            <WelcomeMessage text={messages[0]?.text ?? ""} />
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
        ) : (
          <ul className="sc-trace__messages">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`sc-trace__msg-row sc-trace__msg-row--${msg.role}`}
              >
                <div className={`sc-trace__bubble sc-trace__bubble--${msg.role}`}>
                  <p>{msg.text}</p>
                </div>
                {msg.suggestions && msg.suggestions.length > 0 ? (
                  <ul className="sc-trace__suggestions-inline">
                    {msg.suggestions.map((suggestion) => (
                      <li key={`${suggestion.slug}-${suggestion.href}`}>
                        <Link href={suggestion.href} className="sc-trace__suggestion">
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

        {loading ? (
          <div className="sc-trace__typing" aria-live="polite">
            <span className="sc-trace__typing-dot" />
            <span className="sc-trace__typing-dot sc-trace__typing-dot--delay-1" />
            <span className="sc-trace__typing-dot sc-trace__typing-dot--delay-2" />
          </div>
        ) : null}

        {error ? (
          <p className="sc-trace__status sc-trace__status--error">
            {errorDetail ?? labels.error}
          </p>
        ) : null}

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

      <div className="sc-trace__composer">
        <form
          className="sc-trace__form"
          onSubmit={(event) => {
            event.preventDefault();
            onSend(input);
          }}
        >
          <input
            type="text"
            className="sc-trace__input"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend(input);
              }
            }}
            placeholder={labels.placeholder}
            aria-label={labels.placeholder}
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

export function TraceFabIcon({ open }: { readonly open: boolean }) {
  if (open) {
    return <X className="sc-trace__fab-icon" aria-hidden />;
  }
  return <Route className="sc-trace__fab-icon" aria-hidden />;
}

function WelcomeMessage({ text }: { readonly text: string }) {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return null;
  }

  const [lead, ...rest] = lines;

  return (
    <div className="sc-trace__welcome-block">
      <p className="sc-trace__welcome-lead">{lead}</p>
      {rest.length > 0 ? <p className="sc-trace__welcome">{rest.join("\n")}</p> : null}
    </div>
  );
}
