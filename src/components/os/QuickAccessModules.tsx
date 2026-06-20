import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HubLink } from "@/components/layout/HubLink";

const MODULES = [
  { key: "tools" as const, href: "/free-tools" },
  { key: "industries" as const, href: "/industries" },
  { key: "categories" as const, href: "/categories" },
  { key: "premium" as const, href: "/pro-tools" },
] as const;

export async function QuickAccessModules() {
  const t = await getTranslations("industrialHome");

  return (
    <section className="ind-os-section" aria-labelledby="quick-access-heading">
      <h2 id="quick-access-heading" className="ind-os-section-title">
        {t("quickAccess.title")}
      </h2>
      <div className="ind-os-module-grid">
        {MODULES.map((mod) => (
          <HubLink key={mod.key} href={mod.href} className="ind-os-module">
            <span className="ind-os-module__title">{t(`quickAccess.modules.${mod.key}`)}</span>
            <span className="ind-os-module__action">
              {t("quickAccess.open")}
              <ChevronRight className="h-3 w-3" aria-hidden />
            </span>
          </HubLink>
        ))}
      </div>
    </section>
  );
}
