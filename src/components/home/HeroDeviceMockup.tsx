import Image from "next/image";

export function HeroDeviceMockup() {
  return (
    <div className="mc-hero-device-mockup relative mx-auto mt-8 w-full max-w-5xl px-4 pb-3 sm:mt-10">
      <Image
        src="/images/sectorcalc-devices-hero.png"
        alt="SectorCalc dashboard, calculator and decision report screens"
        width={1672}
        height={941}
        priority
        unoptimized
        sizes="(max-width: 768px) 96vw, (max-width: 1200px) 82vw, 980px"
        className="relative z-10 mx-auto h-auto w-full max-w-[980px] object-contain"
      />
    </div>
  );
}
