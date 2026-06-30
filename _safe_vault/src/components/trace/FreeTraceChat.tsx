"use client";

import { TraceChatPanel } from "@/components/trace/TraceChatPanel";
import { useTraceChat } from "@/components/trace/useTraceChat";

type FreeTraceChatProps = {
  readonly onClose?: () => void;
};

export function FreeTraceChat({ onClose }: FreeTraceChatProps) {
  const chat = useTraceChat();

  return (
    <TraceChatPanel
      mode="free"
      messages={chat.messages}
      loading={chat.loading}
      error={chat.error}
      errorDetail={chat.errorDetail}
      input={chat.input}
      onInputChange={chat.setInput}
      onSend={(value) => void chat.send(value)}
      onClose={onClose}
      quickActions={chat.quickActions}
      messagesEndRef={chat.messagesEndRef}
      labels={chat.labels}
      showUpsell
    />
  );
}
