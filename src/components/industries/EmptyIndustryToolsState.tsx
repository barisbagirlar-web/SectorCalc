import { Link } from "@/i18n/routing";

type EmptyIndustryToolsStateProps = {
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly href: string;
};

export function EmptyIndustryToolsState({
  title,
  description,
  ctaLabel,
  href,
}: EmptyIndustryToolsStateProps) {
  return (
    <div className="rounded-sm border border-dashed border-technical-gray bg-industrial-matte px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-premium-velvet">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-body-charcoal">{description}</p>
      <Link
        href={href}
        prefetch={false}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-sc-copper px-5 text-sm font-semibold text-white transition-colors hover:bg-sc-copper-hover"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
