"use client";

import { useTranslations } from "next-intl";
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

const BADGE_ICONS = [
  ShieldCheckIcon,
  LockClosedIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
] as const;

const BADGE_KEYS = ["refund", "ssl", "instant", "support"] as const;

export function TrustBadgeStrip() {
  const t = useTranslations("trust");

  return (
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      {BADGE_KEYS.map((key, index) => {
        const Icon = BADGE_ICONS[index];
        return (
          <div key={key} className="flex items-center gap-2 text-xs text-slate">
            <Icon className="h-4 w-4 shrink-0 text-emerald" aria-hidden />
            <span className="font-medium">{t(key)}</span>
          </div>
        );
      })}
    </div>
  );
}
