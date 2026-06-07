import { ExtendablePlatformIllustration } from "@/components/ui/MagiClickIllustrations";

export function PlatformIntroSection() {
 return (
 <section className="third-tab">
 <div className="text-center">
 <div className="row">
 <div className="col-xs-12">
 <h2>From quick estimates to structured business decisions</h2>
 <p>
 SectorCalc is not a generic calculator directory. It is a structured sector
 calculation and decision-report platform. Start with a simple estimate, then move
 into sector-specific analysis when a number affects margin, pricing, capacity or
 operational risk.
 </p>
 </div>
 <div className="col-xs-12">
 <figure className="third-tab-image">
 <ExtendablePlatformIllustration />
 </figure>
 </div>
 </div>
 </div>
 </section>
 );
}
