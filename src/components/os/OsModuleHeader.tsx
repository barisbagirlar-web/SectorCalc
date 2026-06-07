import { ProBadge } from "@/components/os/ProBadge";

export type OsModuleTier = "utility" | "intelligence";

interface OsModuleHeaderProps {
  title: string;
  tier: OsModuleTier;
}

export function OsModuleHeader({ title, tier }: OsModuleHeaderProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <h1 className="font-display text-base font-semibold tracking-tight text-premium-velvet">{title}</h1>
      {tier === "intelligence" ? <ProBadge /> : null}
    </div>
  );
}
