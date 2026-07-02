"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  getRegionProfile,
  type RegionCode,
  type RegionalComplianceProfile,
} from "@/config/regions";
import type { RegionSource } from "@/lib/features/compliance/detect-region";

interface RegionContextValue {
  region: RegionCode;
  profile: RegionalComplianceProfile;
  source: RegionSource;
}

const RegionContext = createContext<RegionContextValue | null>(null);

interface RegionProviderProps {
  region: RegionCode;
  source: RegionSource;
  children: ReactNode;
}

/** Global OS state - region from middleware geo detection. */
export function RegionProvider({ region, source, children }: RegionProviderProps) {
  const value = useMemo(
    () => ({ region, profile: getRegionProfile(region), source }),
    [region, source],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    return { region: "EN", profile: getRegionProfile("EN"), source: "global-default" };
  }
  return ctx;
}
