import { Link } from "@/i18n/routing";
import { ScIcon } from "@/components/icons/ScIcon";
import { resolveNavIcon } from "@/lib/icons/icon-registry";
import { stripLocalePrefix } from "@/i18n/routing";

type NavLinkWithIconProps = {
 href: string;
 label: string;
 className?: string;
 onClick?: () => void;
 showIcon?: boolean;
 prefetch?: boolean;
};

export function NavLinkWithIcon({
 href,
 label,
 className = "",
 onClick,
 showIcon = true,
 prefetch = false,
}: NavLinkWithIconProps) {
 const Icon = resolveNavIcon(stripLocalePrefix(href));

 return (
 <Link
   href={href}
   prefetch={prefetch}
   onClick={onClick}
   className={`inline-flex items-center gap-2 ${className}`}
 >
 {showIcon && Icon ? (
 <ScIcon icon={Icon} size="compact" className="text-current opacity-80" />
 ) : null}
 {label}
 </Link>
 );
}
