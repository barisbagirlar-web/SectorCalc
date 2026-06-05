import Image from "next/image";
import { BRAND_ASSETS } from "@/config/brand";

export function HeroDeviceMockup() {
  const hero = BRAND_ASSETS.heroDevices;

  return (
    <div className="mc-hero-device-mockup relative z-[2] mx-auto mt-6 w-full max-w-[980px] px-4 pb-2 sm:mt-8">
      <Image
        src={hero.src}
        alt="SectorCalc dashboards on laptop, tablet and mobile devices"
        width={hero.width}
        height={hero.height}
        priority
        unoptimized
        sizes="(max-width: 768px) 96vw, (max-width: 1200px) 82vw, 980px"
        className="mc-hero-device-img mx-auto h-auto w-full object-contain"
      />
    </div>
  );
}
