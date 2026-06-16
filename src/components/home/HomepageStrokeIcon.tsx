import type { LucideIcon } from "lucide-react";

type HomepageStrokeIconProps = {
  icon: LucideIcon;
  className?: string;
  size?: number;
};

export function HomepageStrokeIcon({
  icon: Icon,
  className = "sc-home-omni__stroke-icon",
  size = 18,
}: HomepageStrokeIconProps) {
  return <Icon className={className} size={size} strokeWidth={1.5} aria-hidden />;
}
