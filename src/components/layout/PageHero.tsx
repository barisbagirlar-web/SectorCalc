import type { ReactNode } from "react";

export type PageHeroVariant = "compact" | "home";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
  /** Compact band for inner pages; home keeps room for marketing CTAs on the homepage only */
  variant?: PageHeroVariant;
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
  children,
  variant = "compact",
}: PageHeroProps) {
  return (
    <section
      className={`mc-page-hero${variant === "home" ? " mc-page-hero--home" : " mc-page-hero--compact"}`}
    >
      <div className="container text-center">
        <div className="mc-page-hero-head">
          <header>
            {eyebrow ? <p className="mc-page-eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {subtitle ? (
              <div className="mc-page-hero-lead">
                <span className="mc-page-hero-lead-rule" aria-hidden />
                <p className="mc-page-hero-lead-text">{subtitle}</p>
              </div>
            ) : null}
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
