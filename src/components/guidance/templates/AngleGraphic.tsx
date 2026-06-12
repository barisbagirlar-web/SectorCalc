import {
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function AngleGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const angleActive = isGraphicFieldActive("angle", activeFieldKey, fieldMap);
  const riseActive = isGraphicFieldActive("rise", activeFieldKey, fieldMap);
  const runActive = isGraphicFieldActive("run", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <line x1="50" y1="170" x2="250" y2="170" className={dimClass(runActive)} strokeWidth="2" />
      <text x="140" y="192" className={labelClass(runActive)}>{labelFor("run")}</text>
      <line x1="50" y1="170" x2="50" y2="60" className={dimClass(riseActive)} strokeWidth="2" />
      <text x="18" y="120" className={labelClass(riseActive)}>{labelFor("rise")}</text>
      <line x1="50" y1="170" x2="170" y2="60" className={dimClass(angleActive)} strokeWidth="2" strokeDasharray="5 3" />
      <path d="M50 150 A40 40 0 0 0 85 125" fill="none" className={dimClass(angleActive)} strokeWidth="2" />
      <text x="95" y="145" className={labelClass(angleActive)}>{labelFor("angle")}</text>
    </svg>
  );
}
