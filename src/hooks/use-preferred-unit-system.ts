"use client";

import { useEffect, useState } from "react";
import type { UnitSystemPreference } from "@/config/measurement";
import { readUnitSystemCookie } from "@/lib/regional/unit-system-client";

export function usePreferredUnitSystem(): UnitSystemPreference {
  const [unitSystem, setUnitSystem] = useState<UnitSystemPreference>("metric");

  useEffect(() => {
    setUnitSystem(readUnitSystemCookie() ?? "metric");
  }, []);

  return unitSystem;
}
