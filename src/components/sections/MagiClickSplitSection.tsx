import type { ReactNode } from "react";
import {
 SplitReportIllustration,
 SplitScenarioIllustration,
 SplitValidationIllustration,
} from "@/components/ui/MagiClickIllustrations";

type TabClass = "fifth-tab" | "sixth-tab" | "eigth-tab";
type VisualKind = "report" | "validation" | "scenario";
type LayoutVariant = "7-5" | "8-4";

interface MagiClickSplitSectionProps {
 tabClass: TabClass;
 imageClass: string;
 title: ReactNode;
 paragraphs: readonly string[];
 visual: VisualKind;
 layout?: LayoutVariant;
}

const VISUALS = {
 report: SplitReportIllustration,
 validation: SplitValidationIllustration,
 scenario: SplitScenarioIllustration,
} as const;

export function MagiClickSplitSection({
 tabClass,
 imageClass,
 title,
 paragraphs,
 visual,
 layout = "7-5",
}: MagiClickSplitSectionProps) {
 const Visual = VISUALS[visual];
 const textCol = layout === "8-4" ? "col-xs-12 col-sm-8" : "col-xs-12 col-sm-7";
 const visualCol =
 layout === "8-4" ? "col-xs-12 col-sm-4 text-center" : "col-xs-12 col-sm-5 text-center";

 return (
 <section className={tabClass}>
 <div className="container">
 <div className="row">
 <div className={textCol}>
 <h1>{title}</h1>
 {paragraphs.map((text) => (
 <p key={text.slice(0, 48)}>{text}</p>
 ))}
 </div>
 <div className={visualCol}>
 <figure className={`${imageClass} spaceRightArea`}>
 <Visual />
 </figure>
 </div>
 </div>
 </div>
 </section>
 );
}
