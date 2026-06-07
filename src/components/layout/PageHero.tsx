import type { ReactNode } from "react";

export type PageHeroVariant = "compact" | "home";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  variant?: PageHeroVariant;
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
  children,
  variant = "compact",
}: PageHeroProps) {
  const isHome = variant === "home";

  return (
    <section className="ind-page-hero" aria-labelledby="layout-page-hero-title">
      <div className={`ind-page-hero-inner text-center ${isHome ? "py-12 lg:py-16" : ""}`}>
        {eyebrow ? <p className="label-badge mb-3 text-body-charcoal">{eyebrow}</p> : null}
        <h1
          id="layout-page-hero-title"
          className={`font-display mx-auto max-w-4xl font-semibold tracking-tight text-premium-velvet ${
            isHome ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-body-charcoal sm:text-base">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
