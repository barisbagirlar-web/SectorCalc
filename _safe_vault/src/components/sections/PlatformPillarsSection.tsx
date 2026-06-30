import {
 PillarEngineIllustration,
 PillarReportIllustration,
 PillarSecurityIllustration,
} from "@/components/ui/MagiClickIllustrations";

const PILLARS = [
 {
 Illustration: PillarEngineIllustration,
 titleLines: ["Free", "Estimators"],
 description:
 "Quick tools for fast cost, margin and capacity estimates. Use them when you need a directional number before a meeting, bid or menu change.",
 },
 {
 Illustration: PillarReportIllustration,
 titleLines: ["Premium", "Decision Tools"],
 description:
 "Advanced analyzers that turn inputs into risk levels, scenario paths and recommendations — designed for decisions that affect profit or operational risk.",
 },
 {
 Illustration: PillarSecurityIllustration,
 titleLines: ["Report-Ready", "Outputs"],
 description:
 "Premium flows are designed around PDF, Excel and Word report packaging. In the MVP, export is preview-only; report structure and lead intent are live today.",
 },
] as const;

export function PlatformPillarsSection() {
 return (
 <section className="fourth-tab">
 <div className="container text-center">
 <div className="row">
 {PILLARS.map((pillar) => (
 <article key={pillar.titleLines.join("-")} className="col-sm-4">
 <div className="fourth-tab-box-area">
 <figure className="fourth-tab-image">
 <pillar.Illustration />
 <figcaption className="fourth-tab-title">
 <h4>
 {pillar.titleLines.map((line, index) => (
 <span key={line}>
 {line}
 {index < pillar.titleLines.length - 1 ? <br /> : null}
 </span>
 ))}
 </h4>
 </figcaption>
 </figure>
 <div className="fourth-tab-content">
 <p>{pillar.description}</p>
 </div>
 </div>
 </article>
 ))}
 </div>
 </div>
 </section>
 );
}
