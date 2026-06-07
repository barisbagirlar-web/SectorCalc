import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  action?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "left",
  action,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-4 ${alignClass} ${align === "center" ? "max-w-3xl" : "max-w-2xl"}`}>
      {eyebrow ? <p className="label-badge mb-1 text-body-charcoal">{eyebrow}</p> : null}
      <div className={action ? "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between" : ""}>
        <div>
          <h2 className="font-display text-lg font-semibold text-premium-velvet sm:text-xl">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm leading-relaxed text-body-charcoal">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
    </div>
  );
}
