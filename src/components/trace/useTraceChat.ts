"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { sendFreeTraceMessage } from "@/components/trace/trace-api";
import type { TraceChatMessage } from "@/components/trace/trace-chat-shared";

const QUICK_KEYS = [
  "findTool",
  "explainInputs",
  "premiumHint",
  "pricing",
] as const;

export function useTraceChat() {
  const t = useTranslations("trace");
  const locale = useLocale();
  const pathname = usePathname();
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

  const quickActions = QUICK_KEYS.map((key) => ({
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

      try {
        const freeReply = await sendFreeTraceMessage(
          message,
          { locale, pathname, messages },
          nextId,
        );

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
    [loading, locale, messages, nextId, pathname, t],
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
      placeholder: t("inputPlaceholder"),
      send: t("send"),
      freeTagline: t("freeTagline"),
      freeTaglineLink: t("freeTaglineLink"),
      disclaimer: t("disclaimer"),
      title: t("title"),
      tagline: t("tagline"),
      close: t("close"),
    },
  };
}
