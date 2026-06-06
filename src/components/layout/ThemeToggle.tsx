"use client";

import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/cn";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");

  const options = [
    { value: "light" as const, icon: SunIcon, label: t("light") },
    { value: "system" as const, icon: ComputerDesktopIcon, label: t("system") },
    { value: "dark" as const, icon: MoonIcon, label: t("dark") },
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg bg-slate/10 p-1 dark:bg-slate-800",
        className
      )}
      role="group"
      aria-label={t("groupLabel")}
    >
      {options.map(({ value, icon: Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue/40",
              active
                ? "bg-white text-professional-blue shadow-sm dark:bg-slate-700 dark:text-cyan"
                : "text-slate hover:text-deep-navy dark:text-slate-400 dark:hover:text-slate-200"
            )}
            aria-label={label}
            aria-pressed={active}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
