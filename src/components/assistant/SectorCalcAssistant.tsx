"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import type { AssistantResult, AssistantSuggestion } from "@/lib/assistant/types";
import type { CustomerAiSafeResponse } from "@/lib/ai-gateway/customer-ai-types";

type ChatMessage = {
  readonly id: number;
  readonly role: "user" | "assistant";
  readonly text: string;
  readonly suggestions?: readonly AssistantSuggestion[];
};

const QUICK_ACTIONS = [
  { key: "findTool", message: "Which tool should I use for my job?" },
  { key: "explainInputs", message: "What inputs do I need to enter?" },
  { key: "decisionSummary", message: "What is a premium decision summary?" },
  { key: "enterprise", message: "Tell me about enterprise and team usage." },
] as const;

function extractToolSlug(pathname: string): string {
  const match = pathname.match(/\/tools\/(?:free|premium)\/([^/]+)/);
  return match?.[1] ?? "";
}

function gatewayFallbackMessage(locale: string): string {
  return "The AI assistant could not generate a response. Check the calculation fields and try again.";
}

function buildGatewaySuggestion(result: CustomerAiSafeResponse): AssistantSuggestion | null {
  if (!result.suggestedToolSlug || !result.suggestedToolPath) {
    return null;
  }

  return {
    slug: result.suggestedToolSlug,
    label: result.suggestedToolSlug,
    href: result.suggestedToolPath,
  };
}

export function SectorCalcAssistant() {
  const t = useTranslations("assistant");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const idRef = useRef(0);

  const nextId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  async function requestDeterministicAssistant(message: string): Promise<ChatMessage | null> {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { ok: boolean; result?: AssistantResult };
    const result = data.result;
    if (!result) {
      return null;
    }

    const replyKey = `reply.${result.topic}` as const;
    return {
      id: nextId(),
      role: "assistant",
      text: t(replyKey),
      suggestions: result.suggestions,
    };
  }

  async function send(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || loading) {
      return;
    }
    setError(false);
    setInput("");
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: message }]);
    setLoading(true);

    try {
      const gatewayRes = await fetch("/api/ai-gateway/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          message,
          currentPath: pathname,
          currentToolSlug: extractToolSlug(pathname),
        }),
      });

      if (gatewayRes.ok) {
        const gatewayData = (await gatewayRes.json()) as {
          ok: boolean;
          result?: CustomerAiSafeResponse;
        };
        const result = gatewayData.result;

        if (result?.answer) {
          const suggestion = buildGatewaySuggestion(result);
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              text: result.answer,
              suggestions: suggestion ? [suggestion] : undefined,
            },
          ]);
          return;
        }
      }

      const fallbackMessage = await requestDeterministicAssistant(message);
      if (fallbackMessage) {
        setMessages((prev) => [...prev, fallbackMessage]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: gatewayFallbackMessage(locale),
        },
      ]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-sectorcalc-assistant="true" className="sc-assistant">
      <button
        type="button"
        data-assistant-launcher="true"
        className="sc-assistant__launcher"
        aria-expanded={open}
        aria-label={t("title")}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "×" : t("launcher")}
      </button>

      <section
        data-assistant-panel="true"
        className="sc-assistant__panel"
        role="dialog"
        aria-label={t("title")}
        hidden={!open}
      >
        <header className="sc-assistant__header">
          <p className="sc-assistant__title">{t("title")}</p>
          <p className="sc-assistant__subtitle">{t("subtitle")}</p>
        </header>

        <div className="sc-assistant__body">
          {messages.length === 0 ? (
            <div className="sc-assistant__quick">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  className="sc-assistant__quick-btn"
                  onClick={() => send(action.message)}
                >
                  {t(`quickActions.${action.key}`)}
                </button>
              ))}
            </div>
          ) : (
            <ul className="sc-assistant__messages">
              {messages.map((msg) => (
                <li key={msg.id} className={`sc-assistant__msg sc-assistant__msg--${msg.role}`}>
                  <p>{msg.text}</p>
                  {msg.suggestions && msg.suggestions.length > 0 ? (
                    <ul className="sc-assistant__suggestions">
                      {msg.suggestions.map((suggestion) => (
                        <li key={suggestion.slug}>
                          <Link href={suggestion.href} className="sc-assistant__suggestion">
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
          {loading ? <p className="sc-assistant__status">{t("loading")}</p> : null}
          {error ? <p className="sc-assistant__status sc-assistant__status--error">{t("error")}</p> : null}
        </div>

        <form
          className="sc-assistant__form"
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
        >
          <input
            type="text"
            className="sc-assistant__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            maxLength={1000}
          />
          <button type="submit" className="sc-assistant__send" disabled={loading}>
            {t("send")}
          </button>
        </form>

        <p className="sc-assistant__disclaimer">{t("disclaimer")}</p>
      </section>
    </div>
  );
}
