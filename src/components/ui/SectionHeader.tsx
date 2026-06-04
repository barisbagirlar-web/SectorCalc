import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  dark?: boolean;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "left",
  dark = false,
  action,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = dark ? "text-white" : "text-deep-navy";
  const subtitleColor = dark ? "text-slate-300" : "text-slate";
  const eyebrowColor = dark ? "text-cyan" : "text-professional-blue";

  return (
    <div
      className={`mb-12 md:mb-14 ${alignClass} ${align === "center" ? "max-w-3xl" : "max-w-2xl"}`}
    >
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      )}
      <div
        className={
          action ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" : ""
        }
      >
        <div>
          <h2
            className={`text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2.5rem] lg:leading-tight ${titleColor}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={`mt-4 text-base leading-relaxed sm:text-lg ${subtitleColor}`}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
