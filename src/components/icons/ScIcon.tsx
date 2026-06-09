import type { ReactNode } from "react";
import { ICON_SIZE_CLASS, ICON_STROKE, type ScIconSize } from "@/lib/icons/constants";
import {
 STATUS_COLOR_CLASS,
 STATUS_ICON,
 type HeroIcon,
} from "@/lib/icons/icon-registry";

type ScIconProps = {
 icon: HeroIcon;
 size?: ScIconSize;
 className?: string;
 label?: string;
};

export function ScIcon({ icon: Icon, size = "default", className = "", label }: ScIconProps) {
 return (
 <Icon
 className={`${ICON_SIZE_CLASS[size]} shrink-0 ${className}`}
 strokeWidth={ICON_STROKE}
 aria-hidden={label ? undefined : true}
 {...(label ? { "aria-label": label } : {})}
 />
 );
}

type IconListItemProps = {
 icon: HeroIcon;
 iconClassName?: string;
 children: ReactNode;
 className?: string;
};

export function IconListItem({
 icon,
 iconClassName = "text-deep-navy",
 children,
 className = "",
}: IconListItemProps) {
 return (
 <li className={`flex gap-2.5 text-sm text-text-secondary ${className}`}>
 <ScIcon icon={icon} size="compact" className={`mt-0.5 ${iconClassName}`} />
 <span>{children}</span>
 </li>
 );
}

type FeatureIconHeaderProps = {
 icon: HeroIcon;
 iconClassName?: string;
 title: string;
 subtitle?: string;
};

export function FeatureIconHeader({
 icon,
 iconClassName = "text-deep-navy",
 title,
 subtitle,
}: FeatureIconHeaderProps) {
 return (
 <div className="flex items-start gap-3">
 <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border-subtle bg-bg-subtle text-deep-navy">
 <ScIcon icon={icon} size="feature" className={iconClassName} />
 </span>
 <div>
 <p className="font-semibold text-text-primary">{title}</p>
 {subtitle ? (
 <p className="mt-1 text-sm leading-relaxed text-text-secondary">{subtitle}</p>
 ) : null}
 </div>
 </div>
 );
}

type StatusBadgeProps = {
 status: keyof typeof STATUS_ICON;
 label: string;
 className?: string;
};

export function StatusIconBadge({ status, label, className = "" }: StatusBadgeProps) {
 const Icon = STATUS_ICON[status];
 const color = STATUS_COLOR_CLASS[status];

 return (
 <span
 className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${color} ${className}`}
 >
 <ScIcon icon={Icon} size="compact" className={color} />
 {label}
 </span>
 );
}

export type { HeroIcon, ScIconSize };
