import type { ReactNode } from "react";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
}

/** Shared MagiClick green/cyan hero — same height and typography on every page */
export function PageHero({ title, subtitle, eyebrow, children }: PageHeroProps) {
  return (
    <section className="mc-page-hero">
      <div className="container text-center">
        <div className="mc-page-hero-head">
          <header>
            {eyebrow ? <p className="mc-page-eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
