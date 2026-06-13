import { ProBadge } from "@/components/os/ProBadge";
import { FormulaGateToolStatus } from "@/components/formula/FormulaGateToolStatus";

export type OsModuleTier = "utility" | "intelligence";

interface OsModuleHeaderProps {
  title: string;
  tier: OsModuleTier;
  slug?: string;
  locale?: string;
  surface?: "free" | "premium";
}

export function OsModuleHeader({ title, tier, slug, locale, surface }: OsModuleHeaderProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <h1 className="font-display text-base font-semibold tracking-tight text-premium-velvet">{title}</h1>
      {tier === "intelligence" ? <ProBadge /> : null}
      {slug && locale ? (
        <FormulaGateToolStatus slug={slug} locale={locale} surface={surface} />
      ) : null}
    </div>
  );
}
