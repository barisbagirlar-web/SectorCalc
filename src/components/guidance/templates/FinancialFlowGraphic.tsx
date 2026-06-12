import {
  GUIDANCE_COLORS,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function FinancialFlowGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const costActive = isGraphicFieldActive("cost", activeFieldKey, fieldMap);
  const priceActive = isGraphicFieldActive("price", activeFieldKey, fieldMap);
  const marginActive = isGraphicFieldActive("margin", activeFieldKey, fieldMap);
  const taxActive = isGraphicFieldActive("tax", activeFieldKey, fieldMap);
  const paymentActive = isGraphicFieldActive("payment", activeFieldKey, fieldMap);
  const revenueActive = isGraphicFieldActive("revenue", activeFieldKey, fieldMap);
  const profitActive = isGraphicFieldActive("profit", activeFieldKey, fieldMap);

  const box = (x: number, y: number, active: boolean, label: string) => (
    <g key={`${x}-${y}`}>
      <rect
        x={x}
        y={y}
        width="72"
        height="36"
        rx="4"
        fill={active ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface}
        stroke={active ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border}
        className={active ? "grg-region grg-region--active" : "grg-region"}
      />
      <text x={x + 8} y={y + 22} className={labelClass(active)}>{label}</text>
    </g>
  );

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      {box(30, 80, costActive, labelFor("cost"))}
      {box(120, 50, priceActive, labelFor("price"))}
      {box(210, 80, marginActive, labelFor("margin"))}
      {box(80, 150, taxActive, labelFor("tax"))}
      {box(170, 150, paymentActive, labelFor("payment"))}
      <path d="M102 98 H120 M192 68 H210 M102 116 Q160 140 170 150" stroke={GUIDANCE_COLORS.mutedLine} fill="none" />
      <text x="30" y="40" className={labelClass(revenueActive)}>{labelFor("price")}</text>
      <text x="230" y="40" className={labelClass(profitActive)}>{labelFor("margin")}</text>
    </svg>
  );
}
