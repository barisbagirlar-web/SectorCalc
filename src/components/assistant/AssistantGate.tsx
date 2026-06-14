"use client";

import { usePathname } from "@/i18n/routing";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import { SectorCalcAssistant } from "@/components/assistant/SectorCalcAssistant";

export function AssistantGate() {
  const { user, loading } = useUserSubscription();
  const pathname = usePathname();

  if (loading || !user) {
    return null;
  }

  if (pathname.includes("/print")) {
    return null;
  }

  return <SectorCalcAssistant />;
}
