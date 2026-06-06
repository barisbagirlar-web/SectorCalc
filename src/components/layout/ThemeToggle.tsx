"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/components/providers/ThemeProvider";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate/20 text-slate transition hover:border-professional-blue/30 hover:text-professional-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-professional-blue/40 dark:border-slate-600 dark:text-slate-300 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <SunIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      ) : (
        <MoonIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
