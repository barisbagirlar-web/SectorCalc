import { getUnitDefinition } from "@/lib/units/regional-unit-engine";

type UnitHintProps = {
  readonly unitId: string;
};

/** Small inline label showing a unit's human name and symbol. */
export function UnitHint({ unitId }: UnitHintProps) {
  const def = getUnitDefinition(unitId);
  if (!def) {
    return null;
  }
  return (
    <span className="text-xs text-body-charcoal">
      {def.label}
      {def.symbol ? ` (${def.symbol})` : ""}
    </span>
  );
}
