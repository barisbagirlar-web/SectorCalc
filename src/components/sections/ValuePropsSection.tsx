import { ScIcon } from "@/components/icons/ScIcon";
import {
  BanknotesIcon,
  BoltIcon,
  ClockIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";

const LOSS_DIMENSION_KEYS = [
  { icon: BanknotesIcon, titleKey: "valueProps.financial", trKey: "valueProps.financialTr", descKey: "valueProps.financialDesc" },
  { icon: CubeIcon, titleKey: "valueProps.material", trKey: "valueProps.materialTr", descKey: "valueProps.materialDesc" },
  { icon: ClockIcon, titleKey: "valueProps.time", trKey: "valueProps.timeTr", descKey: "valueProps.timeDesc" },
  { icon: BoltIcon, titleKey: "valueProps.energy", trKey: "valueProps.energyTr", descKey: "valueProps.energyDesc" },
] as const;

export async function ValuePropsSection() {
  const t = await getTranslations();

  return (
    <section
      className="border-t border-slate/10 bg-white py-14 sm:py-16"
      aria-labelledby="value-props-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-professional-blue">
            {t("valueProps.eyebrow")}
          </p>
          <h2
            id="value-props-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-deep-navy sm:text-3xl"
          >
            {t("valueProps.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">
            {t("valueProps.subtitle")}
          </p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LOSS_DIMENSION_KEYS.map((item) => (
            <li key={item.titleKey} className="sc-card h-full">
              <ScIcon icon={item.icon} size="feature" className="text-professional-blue" />
              <h3 className="mt-4 text-base font-bold text-deep-navy">{t(item.titleKey)}</h3>
              <p className="mt-1 text-xs font-medium text-slate">{t(item.trKey)}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate">{t(item.descKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
