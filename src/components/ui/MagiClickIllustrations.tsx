import Image from "next/image";
import { BRAND_ASSETS } from "@/config/brand";

interface IllustrationProps {
  className?: string;
}

interface ProductImageProps extends IllustrationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

const PRODUCT_BASE = "/img/products";

function ProductImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`mc-product-image ${className}`.trim()}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 920px"
    />
  );
}

/** Homepage hero — SectorCalc platform architecture overview */
export function HeroPlatformIllustration({ className = "" }: IllustrationProps) {
  const hero = BRAND_ASSETS.heroDevices;
  return (
    <Image
      src={hero.src}
      alt="SectorCalc platform flow — dashboards, calculators, decision engine and sector reports"
      width={hero.width}
      height={hero.height}
      priority
      unoptimized
      className={`mc-hero-visual mc-product-image ${className}`.trim()}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 92vw, 1100px"
    />
  );
}

/** MagiClick trusted-by strip proportions — sector labels on cyan band */
export function TrustedIndustriesStrip({ className = "" }: IllustrationProps) {
  return (
    <svg
      className={`img-responsive margin-auto ${className}`}
      viewBox="0 0 1100 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Industries served"
    >
      <rect width="1100" height="72" fill="#07b6ef" />
      {[
        "Construction",
        "Cleaning",
        "Restaurant",
        "E-commerce",
        "CNC & Manufacturing",
      ].map((label, i) => (
        <text
          key={label}
          x={110 + i * 200}
          y="42"
          fill="#ffffff"
          fontSize="15"
          fontWeight="600"
          fontFamily="Open Sans, sans-serif"
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

export function ExtendablePlatformIllustration({ className = "" }: IllustrationProps) {
  return (
    <ProductImage
      src={`${PRODUCT_BASE}/Customizable-Extendable.png`}
      alt="Extendable sector calculation platform architecture"
      width={1315}
      height={731}
      className={className}
    />
  );
}

export function PillarEngineIllustration({ className = "" }: IllustrationProps) {
  return (
    <ProductImage
      src={`${PRODUCT_BASE}/Maximise-Efficiency-Standards.png`}
      alt="Efficient free sector estimators"
      width={274}
      height={295}
      className={className}
    />
  );
}

export function PillarReportIllustration({ className = "" }: IllustrationProps) {
  return (
    <ProductImage
      src={`${PRODUCT_BASE}/Robust-Architecture.png`}
      alt="Robust premium decision tool architecture"
      width={283}
      height={295}
      className={className}
    />
  );
}

export function PillarSecurityIllustration({ className = "" }: IllustrationProps) {
  return (
    <ProductImage
      src={`${PRODUCT_BASE}/Advanced-Security.png`}
      alt="Report-ready outputs with validated structure"
      width={274}
      height={295}
      className={className}
    />
  );
}

export function SplitReportIllustration({ className = "" }: IllustrationProps) {
  return (
    <ProductImage
      src={`${PRODUCT_BASE}/single-codebase.png`}
      alt="Unified calculation engine across sectors"
      width={290}
      height={533}
      className={className}
    />
  );
}

export function SplitValidationIllustration({ className = "" }: IllustrationProps) {
  return (
    <ProductImage
      src={`${PRODUCT_BASE}/Powerful-Onboarding.png`}
      alt="Structured decision report onboarding flow"
      width={428}
      height={511}
      className={className}
    />
  );
}

export function SplitScenarioIllustration({ className = "" }: IllustrationProps) {
  return (
    <ProductImage
      src={`${PRODUCT_BASE}/Gamification.png`}
      alt="Sector expansion and scenario modules"
      width={416}
      height={511}
      className={className}
    />
  );
}
