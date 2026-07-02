import Link from "next/link";
import { getTranslations } from "@/lib/i18n-stub";
import { FeatureIconHeader, IconListItem, ScIcon, StatusIconBadge } from "@/components/icons/ScIcon";
import {
 PAIN_RISK_ICONS,
 STATUS_ICON,
 TOOL_CATEGORY_ICON,
 UI_ICON,
} from "@/lib/ui-shared/icons/icon-registry";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { industryRegistry } from "@/lib/features/tools/industry-registry";

const SECTOR_COUNT = industryRegistry.length;

const PAIN_ITEM_CONFIG = [
 {
 key: "material",
 icon: PAIN_RISK_ICONS.material,
 iconClass: "text-deep-navy",
 },
 {
 key: "labor",
 icon: PAIN_RISK_ICONS.labor,
 iconClass: "text-amber",
 },
 {
 key: "overhead",
 icon: PAIN_RISK_ICONS.overhead,
 iconClass: "text-amber",
 },
] as const;

export async function HomeTrustStrip() {
 const t = await getTranslations("home");
 return (
 <p className="mc-hero-trust-strip">
 {t("hero.trustStrip", { count: SECTOR_COUNT })}
 </p>
 );
}

export async function HomePainSection() {
 const t = await getTranslations("home");

 return (
 <section className="mc-home-conversion mc-home-pain" aria-labelledby="home-pain-heading">
 <div className="container">
 <p className="mc-home-conversion-eyebrow">{t("pain.eyebrow")}</p>
 <h2 id="home-pain-heading">{t("pain.title")}</h2>
 <p className="mc-home-conversion-lead">{t("pain.subtitle")}</p>
 <ul className="mc-home-pain-list mt-8 grid gap-4 md:grid-cols-3">
 {PAIN_ITEM_CONFIG.map((item) => (
 <li key={item.key} className="sc-card">
 <FeatureIconHeader
 icon={item.icon}
 iconClassName={item.iconClass}
 title={t(`pain.items.${item.key}.title`)}
 subtitle={t(`pain.items.${item.key}.text`)}
 />
 </li>
 ))}
 </ul>
 </div>
 </section>
 );
}

export async function HomeFreeCheckSection() {
 const t = await getTranslations("home");

 return (
 <section className="mc-home-conversion mc-home-free" aria-labelledby="home-free-heading">
 <div className="container">
 <div className="mc-home-conversion-grid">
 <div>
 <p className="mc-home-conversion-eyebrow mc-home-conversion-eyebrow--free">
 {t("freeCheck.eyebrow")}
 </p>
 <h2 id="home-free-heading">{t("freeCheck.title")}</h2>
 <p className="mc-home-conversion-lead">
 {t("freeCheck.subtitle", { count: SECTOR_COUNT })}
 </p>
 <Link href="/free-tools" className="sc-btn-primary mc-home-conversion-cta">
 {t("freeCheck.cta")}
 </Link>
 </div>
 <div className="mc-home-conversion-card">
 <StatusIconBadge status="free" label={t("freeCheck.cardLabel")} />
 <p className="mt-3 text-lg font-bold text-text-primary">
 {t("freeCheck.cardRisk")}
 </p>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 {t("freeCheck.cardBody")}
 </p>
 </div>
 </div>
 </div>
 </section>
 );
}

export async function HomePremiumVerdictSection() {
 const t = await getTranslations("home");

 return (
 <section className="mc-home-conversion mc-home-premium" aria-labelledby="home-premium-heading">
 <div className="container">
 <div className="mc-home-conversion-grid mc-home-conversion-grid--reverse">
 <div className="mc-home-conversion-card mc-home-conversion-card--premium">
 <p className="text-xs font-bold uppercase tracking-wider text-amber">
 {t("premiumStep.cardEyebrow")}
 </p>
 <p className="mt-3 text-lg font-bold text-text-primary">
 {t("premiumStep.cardTitle")}
 </p>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 {t("premiumStep.cardBody")}
 </p>
 </div>
 <div>
 <p className="mc-home-conversion-eyebrow mc-home-conversion-eyebrow--premium">
 {t("premiumStep.eyebrow")}
 </p>
 <h2 id="home-premium-heading">{t("premiumStep.title")}</h2>
 <p className="mc-home-conversion-lead">{t("premiumStep.subtitle")}</p>
 <Link href="/pro-tools" className="mc-btn-hero-secondary mc-home-conversion-cta">
 {t("premiumStep.cta")}
 </Link>
 </div>
 </div>
 </div>
 </section>
 );
}

export async function HomeSampleVerdictSection() {
 const t = await getTranslations("home");

 return (
 <section
 className="mc-home-conversion mc-home-sample sc-section"
 aria-labelledby="home-sample-heading"
 >
 <div className="container">
 <p className="mc-home-conversion-eyebrow flex items-center justify-center gap-2">
 <ScIcon icon={DocumentMagnifyingGlassIcon} size="compact" className="text-deep-navy" />
 {t("sample.eyebrow")}
 </p>
 <h2 id="home-sample-heading" className="sc-h2">
 {t("sample.title")}
 </h2>
 <p className="mc-home-conversion-lead">{t("sample.subtitle")}</p>
 <article className="mc-home-sample-verdict sc-card sc-reveal mx-auto max-w-3xl">
 <div className="mc-home-sample-verdict-row">
 <span className="mc-home-sample-label">{t("sample.verdictLabel")}</span>
 <strong className="mc-home-sample-value mc-home-sample-value--alert">
 {t("sample.verdictValue")}
 </strong>
 </div>
 <div className="mc-home-sample-verdict-row">
 <span className="mc-home-sample-label flex items-center gap-1.5">
 <ScIcon icon={STATUS_ICON.highRisk} size="compact" className="text-amber" />
 {t("sample.riskLabel")}
 </span>
 <strong className="mc-home-sample-value">{t("sample.riskValue")}</strong>
 </div>
 <div className="mc-home-sample-verdict-row">
 <span className="mc-home-sample-label">{t("sample.leakLabel")}</span>
 <strong className="mc-home-sample-value">{t("sample.leakValue")}</strong>
 </div>
 <div className="mc-home-sample-verdict-row">
 <span className="mc-home-sample-label">{t("sample.actionLabel")}</span>
 <strong className="mc-home-sample-value">{t("sample.actionValue")}</strong>
 </div>
 </article>
 <div className="mc-home-sample-actions">
 <Link href="/reports/sample-decision-report" className="sc-btn-primary">
 {t("sample.primaryCta")}
 </Link>
 <Link href="/tools/premium-schema/cnc-oee-loss" className="sc-btn-secondary">
 {t("sample.secondaryCta")}
 </Link>
 </div>
 </div>
 </section>
 );
}

export async function HomeFreeVsProSection() {
 const t = await getTranslations("home");

 return (
 <section
 className="mc-home-conversion mc-home-free-vs-pro sc-section"
 aria-labelledby="home-compare-heading"
 >
 <div className="container">
 <p className="mc-home-conversion-eyebrow">{t("compare.eyebrow")}</p>
 <h2 id="home-compare-heading" className="sc-h2">
 {t("compare.title")}
 </h2>
 <div className="mt-10 grid gap-6 md:grid-cols-2">
 <article className="sc-card sc-card-interactive">
 <StatusIconBadge status="free" label={t("compare.freeLabel")} className="mb-4" />
 <ul className="space-y-3 text-sm leading-relaxed text-text-secondary">
 <IconListItem icon={STATUS_ICON.free} iconClassName="text-deep-navy">
 {t("compare.freeItem1")}
 </IconListItem>
 <IconListItem icon={TOOL_CATEGORY_ICON.margin} iconClassName="text-deep-navy">
 {t("compare.freeItem2")}
 </IconListItem>
 <IconListItem icon={UI_ICON.exclude} iconClassName="text-text-secondary">
 {t("compare.freeItem3")}
 </IconListItem>
 <IconListItem icon={UI_ICON.exclude} iconClassName="text-text-secondary">
 {t("compare.freeItem4")}
 </IconListItem>
 </ul>
 <Link href="/free-tools" className="sc-btn-secondary mt-6 w-full sm:w-auto">
 {t("freeCheck.cta")}
 </Link>
 </article>
 <article className="sc-card sc-card-interactive border-amber/30">
 <StatusIconBadge status="premium" label={t("compare.proLabel")} className="mb-4" />
 <ul className="space-y-3 text-sm leading-relaxed text-text-secondary">
 <IconListItem icon={TOOL_CATEGORY_ICON.safePrice} iconClassName="text-amber">
 {t("compare.proItem1")}
 </IconListItem>
 <IconListItem icon={TOOL_CATEGORY_ICON.risk} iconClassName="text-amber">
 {t("compare.proItem2")}
 </IconListItem>
 <IconListItem icon={TOOL_CATEGORY_ICON.quote} iconClassName="text-amber">
 {t("compare.proItem3")}
 </IconListItem>
 <IconListItem icon={TOOL_CATEGORY_ICON.export} iconClassName="text-amber">
 {t("compare.proItem4")}
 </IconListItem>
 </ul>
 <Link href="/pro-tools" className="sc-btn-primary mt-6 w-full sm:w-auto">
 {t("compare.proCta")}
 </Link>
 </article>
 </div>
 </div>
 </section>
 );
}

const TRUST_ITEM_KEYS = ["erp", "freeSetup", "premiumVerdicts", "stripe", "privacy"] as const;

export async function HomeTrustSection() {
 const t = await getTranslations("home");

 return (
 <section className="mc-home-conversion mc-home-trust sc-section" aria-labelledby="home-trust-heading">
 <div className="container">
 <h2 id="home-trust-heading" className="sc-h2 text-center">
 {t("trust.title", { count: SECTOR_COUNT })}
 </h2>
 <ul className="mc-home-trust-grid mt-10">
 {TRUST_ITEM_KEYS.map((key) => (
 <li key={key}>
 <strong>{t(`trust.items.${key}.title`)}</strong>
 <span>{t(`trust.items.${key}.text`, { count: SECTOR_COUNT })}</span>
 </li>
 ))}
 </ul>
 </div>
 </section>
 );
}
