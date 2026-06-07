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

interface RegionContextValue {
  region: RegionCode;
  profile: RegionalComplianceProfile;
}

const RegionContext = createContext<RegionContextValue | null>(null);

interface RegionProviderProps {
  region: RegionCode;
  children: ReactNode;
}

/** Global OS state — region from middleware geo detection. */
export function RegionProvider({ region, children }: RegionProviderProps) {
  const value = useMemo(
    () => ({ region, profile: getRegionProfile(region) }),
    [region],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    return { region: "EN", profile: getRegionProfile("EN") };
  }
  return ctx;
}
