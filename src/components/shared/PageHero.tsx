type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export default function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
}: PageHeroProps) {
  const isCenter = align === "center";

  return (
    <section
      className="relative isolate overflow-hidden border-b border-border-subtle"
      aria-labelledby="page-hero-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,#81c13c_0%,#81c13c_50%,#07b6ef_50%,#07b6ef_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.14),transparent_34%)]"
      />

      <div className="relative mx-auto flex min-h-[280px] max-w-7xl items-center px-6 py-14 sm:min-h-[300px] lg:min-h-[320px] lg:px-8">
        <div
          className={
            isCenter
              ? "mx-auto w-full max-w-[920px] text-center"
              : "w-full max-w-[860px] text-left"
          }
        >
          {eyebrow ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-white/80 sm:text-sm">
              {eyebrow}
            </p>
          ) : null}

          <h1
            id="page-hero-title"
            className="text-balance text-4xl font-semibold tracking-[-0.035em] text-white drop-shadow-sm sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]"
          >
            {title}
          </h1>

          {description ? (
            <p className="mx-auto mt-5 line-clamp-3 max-w-3xl text-pretty text-base leading-7 text-white/90 sm:line-clamp-2 sm:text-lg sm:leading-8">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
