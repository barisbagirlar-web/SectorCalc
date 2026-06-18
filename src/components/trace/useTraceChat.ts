"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { useUser } from "@/hooks/useUser";
import { getCurrentUserIdToken } from "@/lib/firebase/auth";
import { sendFreeTraceMessage } from "@/components/trace/trace-api";
import { sendProTraceMessage } from "@/components/trace/trace-api";
import type { TraceChatMessage } from "@/components/trace/trace-chat-shared";

export type TraceChatMode = "free" | "pro";

const FREE_QUICK_KEYS = [
  "findTool",
  "explainInputs",
  "premiumHint",
  "pricing",
] as const;

const PRO_QUICK_KEYS = [
  "decisionSummary",
  "compareScenario",
  "reportHelp",
  "multiTool",
] as const;

export function useTraceChat(mode: TraceChatMode) {
  const t = useTranslations("trace");
  const locale = useLocale();
  const pathname = usePathname();
  const { user, userRole } = useUser();
  const isPremium = userRole === "premium";
  const idRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const nextId = useCallback(() => {
    idRef.current += 1;
    return idRef.current;
  }, []);

  const [messages, setMessages] = useState<TraceChatMessage[]>(() => [
    {
      id: nextId(),
      role: "assistant",
      text: t("welcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | undefined>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickActions = (mode === "pro" ? PRO_QUICK_KEYS : FREE_QUICK_KEYS).map((key) => ({
    key,
    label: t(`quickActions.${key}`),
    message: t(`quickMessages.${key}`),
  }));

  const send = useCallback(
    async (rawMessage: string) => {
      const message = rawMessage.trim();
      if (!message || loading) {
        return;
      }

      setError(false);
      setErrorDetail(undefined);
      setInput("");

      const userMessage: TraceChatMessage = {
        id: nextId(),
        role: "user",
        text: message,
      };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      const context = {
        locale,
        pathname,
        messages,
        isPremium,
      };

      try {
        if (mode === "pro" && user) {
          const idToken = await getCurrentUserIdToken(true);
          const proResult = await sendProTraceMessage(
            message,
            { ...context, idToken },
            nextId,
          );

          if (proResult.message) {
            setMessages((prev) => [...prev, proResult.message!]);
            return;
          }

          if (proResult.errorText === "auth_required") {
            setError(true);
            setErrorDetail(t("errors.authRequired"));
            return;
          }

          if (proResult.errorText) {
            setError(true);
            setErrorDetail(proResult.errorText);
            return;
          }
        }

        const freeReply = await sendFreeTraceMessage(message, context, nextId);
        if (freeReply) {
          setMessages((prev) => [...prev, freeReply]);
          return;
        }

        setError(true);
        setErrorDetail(t("error"));
      } catch {
        setError(true);
        setErrorDetail(t("errors.connection"));
      } finally {
        setLoading(false);
      }
    },
    [isPremium, loading, locale, messages, mode, nextId, pathname, t, user],
  );

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    errorDetail,
    send,
    quickActions,
    messagesEndRef,
    labels: {
      loading: t("loading"),
      error: t("error"),
      placeholder: mode === "pro" ? t("placeholderPro") : t("inputPlaceholder"),
      send: t("send"),
      proBadge: t("proBadge"),
      freeTagline: t("freeTagline"),
      freeTaglineLink: t("freeTaglineLink"),
      disclaimer: t("disclaimer"),
      title: t("title"),
      tagline: t("tagline"),
      close: t("close"),
    },
    isPremium,
  };
}
