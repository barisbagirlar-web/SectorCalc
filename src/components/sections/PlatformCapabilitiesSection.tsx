import { useTranslations } from "@/lib/i18n-stub";
import Link from "@/lib/ui-shared/navigation/next-link";
import { industryRegistry } from "@/lib/features/tools/industry-registry";

type FeatureItem = {
 label: string;
 href?: string;
};

const CAPABILITIES_KEYS = [
 "validatedInputs",
 "transparentFormulas",
 "riskSignals",
 "scenarioCalculation",
 "reportPreview",
 "leadIntentFlow",
] as const;

export function PlatformCapabilitiesSection() {
 const t = useTranslations("platformCapabilities");
 return (
 <section className="ninth-tab animation-element">
 <div className="container">
 <div className="row">
 <article className="col-xs-12">
 <h1>{t("title")}</h1>
 <p>
 {t("description", { sectorCount: industryRegistry.length })}
 </p>
 </article>
 {CAPABILITIES_KEYS.map((key) => (
 <article key={key} className="col-xs-12 col-sm-6 col-md-4">
 <h4>{t(`${key}.title`)}</h4>
 <p className="mc-capability-summary">{t(`${key}.summary`)}</p>
 <ul className={`true-list ico-${key}`}>
 {t.raw(`${key}.items`).map((item: { label: string; href?: string }) => (
 <li key={item.label}>
 {item.href ? (
 <Link href={item.href}>{item.label}</Link>
 ) : (
 item.label
 )}
 </li>
 ))}
 </ul>
 </article>
 ))}
 </div>
 </div>
 </section>
 );
}
