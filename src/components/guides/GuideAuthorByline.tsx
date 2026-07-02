import { Link } from "@/i18n/routing";
import { useTranslations } from "@/lib/i18n-stub";
import { GUIDE_REFERENCE_AUTHOR } from "@/config/guide-reference-author";
import type { AppLocale } from "@/i18n/routing";

type GuideAuthorBylineProps = {
  readonly locale: AppLocale;
};

export function GuideAuthorByline({ locale }: GuideAuthorBylineProps) {
  const t = useTranslations("seoAuthority");
  const role = GUIDE_REFERENCE_AUTHOR.role[locale] ?? GUIDE_REFERENCE_AUTHOR.role.en;

  return (
    <div className="mt-3 text-sm text-body-charcoal">
      <span>{t("guideWrittenBy")} </span>
      <Link
        href={GUIDE_REFERENCE_AUTHOR.profilePath}
        rel="author"
        className="font-semibold text-deep-navy underline underline-offset-2"
      >
        {GUIDE_REFERENCE_AUTHOR.name}
      </Link>
      <span> · {role}</span>
    </div>
  );
}
