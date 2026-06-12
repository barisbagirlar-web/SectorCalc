import {
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function StairGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const stepsActive = isGraphicFieldActive("steps", activeFieldKey, fieldMap);
  const riseActive = isGraphicFieldActive("rise", activeFieldKey, fieldMap);
  const runActive = isGraphicFieldActive("run", activeFieldKey, fieldMap);
  const angleActive = isGraphicFieldActive("angle", activeFieldKey, fieldMap);
  const thicknessActive = isGraphicFieldActive("thickness", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <polyline points="50,170 90,170 90,140 130,140 130,110 170,110 170,80 210,80 210,50" fill="none" stroke="currentColor" strokeWidth="2" className="grg-dim" />
      <line x1="90" y1="140" x2="90" y2="170" className={dimClass(riseActive)} strokeWidth="2" />
      <text x="58" y="158" className={labelClass(riseActive)}>{labelFor("rise")}</text>
      <line x1="90" y1="170" x2="130" y2="170" className={dimClass(runActive)} strokeWidth="2" />
      <text x="98" y="188" className={labelClass(runActive)}>{labelFor("run")}</text>
      <text x="225" y="60" className={labelClass(stepsActive)}>{labelFor("steps")}</text>
      <line x1="50" y1="170" x2="210" y2="50" className={dimClass(angleActive)} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="235" y="115" className={labelClass(angleActive)}>{labelFor("angle")}</text>
      <rect x="48" y="168" width="164" height="6" className={thicknessActive ? "grg-region grg-region--active" : "grg-region"} />
      <text x="235" y="170" className={labelClass(thicknessActive)}>{labelFor("thickness")}</text>
    </svg>
  );
}
