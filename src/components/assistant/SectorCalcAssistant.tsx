// @ts-nocheck
"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "@/lib/i18n-stub";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { getCurrentUserIdToken } from "@/lib/infrastructure/firebase/auth";
import type { AssistantSuggestion } from "@/lib/features/assistant/types";
import type { CustomerAiSafeResponse } from "@/lib/features/ai-gateway/customer-ai-types";

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

const GATEWAY_FALLBACK: Record<string, string> = {
  en: "The AI assistant could not generate a response. Check the calculation fields and try again.",
  tr: "AI assistant could not generate a response. Check the calculation fields and try again.",
  de: "Der KI-Assistent konnte keine Antwort generieren. Uberprufen Sie die Eingabefelder und versuchen Sie es erneut.",
  fr: "L'assistant IA n'a pas pu générer de réponse. Vérifiez les champs de calcul et réessayez.",
  es: "El asistente de IA no pudo generar una respuesta. Verifique los campos de cálculo e intente de nuevo.",
  ar: "لم يتمكن المساعد الذكي من إنشاء رد. تحقق من حقول الحساب وحاول مرة أخرى.",
};

function gatewayFallbackMessage(locale: string): string {
  return GATEWAY_FALLBACK[locale] ?? GATEWAY_FALLBACK.en;
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
  const { userRole } = useUser();
  const isPremium = userRole === "premium";
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

  async function requestChatAssistant(
    message: string,
    idToken: string,
  ): Promise<ChatMessage | null> {
    const conversation = [
      ...messages.map((entry) => ({
        role: entry.role,
        content: entry.text,
      })),
      { role: "user" as const, content: message },
    ];

    const res = await fetch("/api/assistant/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        locale,
        role: isPremium ? "premium" : "free",
        isTrace: true,
        messages: conversation,
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { reply?: string };
    if (!data.reply) {
      return null;
    }

    return {
      id: nextId(),
      role: "assistant",
      text: data.reply,
    };
  }

  async function requestSlugRouterAssistant(message: string): Promise<ChatMessage | null> {
    const priorMessages = messages.map((entry) => ({
      role: entry.role,
      content: entry.text,
    }));

    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        messages: [...priorMessages, { role: "user", content: message }],
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as {
      ok: boolean;
      message?: string;
      suggestion?: AssistantSuggestion;
    };

    if (!data.ok || !data.message) {
      return null;
    }

    return {
      id: nextId(),
      role: "assistant",
      text: data.message,
      suggestions: data.suggestion ? [data.suggestion] : undefined,
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
      // ── Unauthenticated path: try slug router (no auth required) ──
      const idToken = await getCurrentUserIdToken(true);

      if (!idToken) {
        const fallbackMessage = await requestSlugRouterAssistant(message);
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
        return;
      }

      const priorMessages = messages.map((entry) => ({
        role: entry.role,
        content: entry.text,
      }));

      const gatewayRes = await fetch("/api/ai-gateway/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          locale,
          message,
          messages: priorMessages,
          currentPath: pathname,
          currentToolSlug: extractToolSlug(pathname),
          isPremium,
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

      const fallbackChat = await requestChatAssistant(message, idToken);
      if (fallbackChat) {
        setMessages((prev) => [...prev, fallbackChat]);
        return;
      }

      const fallbackMessage = await requestSlugRouterAssistant(message);
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
