import { ScIcon } from "@/components/icons/ScIcon";
import { resolveSectorIcon } from "@/lib/ui-shared/icons/icon-registry";
import type { IndustryIcon } from "@/lib/features/tools/industry-registry";
import type { IndustrySlug } from "@/lib/features/tools/industry-registry";

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
 className = "text-deep-navy",
}: SectorIconProps) {
 const Icon = resolveSectorIcon(slug, iconType);
 return <ScIcon icon={Icon} size={size} className={className} />;
}
