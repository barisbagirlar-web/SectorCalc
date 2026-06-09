import { ScIcon } from "@/components/icons/ScIcon";
import { resolveSectorIcon } from "@/lib/icons/icon-registry";
import type { IndustryIcon } from "@/lib/tools/industry-registry";
import type { IndustrySlug } from "@/lib/tools/industry-registry";

type SectorIconProps = {
 slug: IndustrySlug | string;
 iconType: IndustryIcon;
 size?: "compact" | "default" | "feature";
 className?: string;
};

export function SectorIcon({
 slug,
 iconType,
 size = "feature",
 className = "text-ink-black",
}: SectorIconProps) {
 const Icon = resolveSectorIcon(slug, iconType);
 return <ScIcon icon={Icon} size={size} className={className} />;
}
