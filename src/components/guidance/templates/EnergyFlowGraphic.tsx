import {
  GUIDANCE_COLORS,
  dimClass,
  isGraphicFieldActive,
  labelClass,
  type TemplateGraphicProps,
} from "@/components/guidance/templates/template-shared";

export function EnergyFlowGraphic({ fieldMap, activeFieldKey, labelFor }: TemplateGraphicProps) {
  const powerActive = isGraphicFieldActive("power", activeFieldKey, fieldMap);
  const energyActive = isGraphicFieldActive("energy", activeFieldKey, fieldMap);
  const runtimeActive = isGraphicFieldActive("runtime", activeFieldKey, fieldMap);
  const pressureActive = isGraphicFieldActive("pressure", activeFieldKey, fieldMap);
  const flowActive = isGraphicFieldActive("flow", activeFieldKey, fieldMap);
  const carbonActive = isGraphicFieldActive("carbon", activeFieldKey, fieldMap);

  return (
    <svg viewBox="0 0 320 220" className="grg-svg" role="img">
      <rect x="40" y="85" width="60" height="50" rx="4" fill={powerActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.surface} stroke={powerActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border} />
      <text x="52" y="115" className={labelClass(powerActive)}>{labelFor("power")}</text>
      <path d="M100 110 H150" className={dimClass(flowActive)} strokeWidth="2" markerEnd="url(#grg-energy)" />
      <rect x="150" y="75" width="70" height="70" rx="6" fill={energyActive ? GUIDANCE_COLORS.softFill : GUIDANCE_COLORS.softOrange} stroke={energyActive ? GUIDANCE_COLORS.active : GUIDANCE_COLORS.border} />
      <text x="162" y="118" className={labelClass(energyActive)}>{labelFor("energy")}</text>
      <text x="240" y="90" className={labelClass(runtimeActive)}>{labelFor("time")}</text>
      <text x="240" y="120" className={labelClass(pressureActive)}>{labelFor("pressure")}</text>
      <text x="240" y="150" className={labelClass(carbonActive)}>{labelFor("energy")}</text>
      <text x="52" y="155" className={labelClass(flowActive)}>{labelFor("flow")}</text>
      <defs>
        <marker id="grg-energy" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}
