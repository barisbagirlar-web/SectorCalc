"use client";

import type { ReactNode } from "react";
import { useGuidanceFieldFocus } from "@/components/guidance/GuidanceContext";

type GuidanceFieldFocusProps = {
  readonly fieldKey: string;
  readonly children: (handlers: { onFocus: () => void; onBlur: () => void }) => ReactNode;
};

export function GuidanceFieldFocus({ fieldKey, children }: GuidanceFieldFocusProps) {
  const handlers = useGuidanceFieldFocus(fieldKey);
  return <>{children(handlers)}</>;
}
