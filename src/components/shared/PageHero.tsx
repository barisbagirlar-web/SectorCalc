import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  statusSlot?: ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
  statusSlot,
}: PageHeroProps) {
  const isCenter = align === "center";

  return (
    <section className="ind-page-hero" aria-labelledby="page-hero-title">
      <div className={`ind-page-hero-inner ${isCenter ? "text-center" : "text-left"}`}>
        <div className={isCenter ? "mx-auto w-full max-w-4xl" : "w-full max-w-3xl"}>
          {eyebrow ? <p className="label-badge mb-3 text-body-charcoal">{eyebrow}</p> : null}

          <h1
            id="page-hero-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-premium-velvet sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          >
            {title}
          </h1>

          {statusSlot ? (
            <div className={`mt-3 flex flex-wrap gap-2 ${isCenter ? "justify-center" : ""}`}>
              {statusSlot}
            </div>
          ) : null}

          {description ? (
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-body-charcoal sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
