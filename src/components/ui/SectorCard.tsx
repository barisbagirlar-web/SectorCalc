"use client";

import type { ReactNode } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

export type SectorCardBadge = "free" | "premium" | "new";

export interface SectorCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  badge?: SectorCardBadge;
  href: string;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

const badgeStyles: Record<SectorCardBadge, string> = {
  free: "bg-emerald/15 text-emerald dark:bg-emerald/20 dark:text-emerald",
  premium: "bg-amber/15 text-amber dark:bg-amber/20 dark:text-amber",
  new: "bg-professional-blue/10 text-professional-blue dark:bg-cyan/15 dark:text-cyan",
};

export function SectorCard({
  title,
  description,
  icon,
  badge,
  href,
  variant = "default",
  className,
}: SectorCardProps) {
  const t = useTranslations("sectorCard");

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-[44px] flex-col rounded-2xl border transition-all duration-200",
        "border-slate/15 bg-white shadow-sm hover:-translate-y-1 hover:shadow-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue focus-visible:ring-offset-2",
        "dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500",
        variant === "featured" && "ring-2 ring-amber/20 dark:ring-amber/30",
        variant === "compact" ? "p-4" : "p-6",
        className
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-professional-blue/10 text-professional-blue",
          "dark:bg-cyan/15 dark:text-cyan"
        )}
      >
        {icon}
      </div>

      <h3 className="sc-h3 mb-2 text-lg font-bold sm:text-xl">{title}</h3>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate dark:text-slate-300">
        {description}
      </p>

      {badge ? (
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            badgeStyles[badge]
          )}
        >
          {t(`badge.${badge}`)}
        </span>
      ) : null}

      <div className="mt-auto flex items-center pt-4 text-sm font-medium text-professional-blue opacity-0 transition-opacity group-hover:opacity-100 dark:text-cyan">
        {t("calculate")}
        <ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden />
      </div>
    </Link>
  );
}
