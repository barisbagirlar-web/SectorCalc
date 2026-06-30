"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ResolvedReferenceGraphic } from "@/lib/content/guidance/reference-graphic-types";

type GuidanceContextValue = {
  readonly activeFieldKey: string | null;
  readonly setActiveFieldKey: (key: string | null) => void;
  readonly resolvedGraphic: ResolvedReferenceGraphic | null;
  readonly fieldLabels: Readonly<Record<string, string>>;
};

const GuidanceContext = createContext<GuidanceContextValue | null>(null);

export type GuidanceProviderProps = {
  readonly resolvedGraphic?: ResolvedReferenceGraphic | null;
  readonly fieldLabels?: Readonly<Record<string, string>>;
  readonly children: ReactNode;
};

export function GuidanceProvider({
  resolvedGraphic = null,
  fieldLabels = {},
  children,
}: GuidanceProviderProps) {
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const value = useMemo(
    () => ({ activeFieldKey, setActiveFieldKey, resolvedGraphic, fieldLabels }),
    [activeFieldKey, resolvedGraphic, fieldLabels],
  );
  return <GuidanceContext.Provider value={value}>{children}</GuidanceContext.Provider>;
}

export function useGuidanceContext(): GuidanceContextValue | null {
  return useContext(GuidanceContext);
}

export function useGuidanceFieldFocus(fieldKey: string) {
  const ctx = useGuidanceContext();
  const onFocus = useCallback(() => {
    ctx?.setActiveFieldKey(fieldKey);
  }, [ctx, fieldKey]);
  const onBlur = useCallback(() => {
    ctx?.setActiveFieldKey(null);
  }, [ctx]);
  return { onFocus, onBlur };
}
