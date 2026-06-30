import type { User } from "@/lib/firebase/auth";

export type PremiumAccessMode = "public-preview" | "signed-in-free" | "pro";

type ResolvePremiumAccessModeInput = {
  readonly user: User | null;
  readonly canAccessAnalyzer: boolean;
  readonly isSuperUser: boolean;
  readonly devPro: boolean;
};

export function resolvePremiumAccessMode({
  user,
  canAccessAnalyzer,
  isSuperUser,
  devPro,
}: ResolvePremiumAccessModeInput): PremiumAccessMode {
  if (devPro || isSuperUser || canAccessAnalyzer) {
    return "pro";
  }
  if (user) {
    return "signed-in-free";
  }
  return "public-preview";
}

export function canAccessPremiumFullFeatures(mode: PremiumAccessMode): boolean {
  return mode === "pro";
}
