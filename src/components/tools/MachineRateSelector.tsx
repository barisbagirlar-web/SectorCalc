"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { ShopRateCalculatorModal } from "@/components/tools/ShopRateCalculatorModal";
import type { MachineRecord, MachineRecordField } from "@/lib/machine-rate/types";
import { DEMO_MACHINE_RECORDS } from "@/lib/machine-rate/types";
import {
  mapMachineToFormValues,
  mapShopRateRatesToFormValues,
} from "@/lib/machine-rate/input-mapping";
import type { ShopRateSavedRates } from "@/lib/shop-rate/types";
import { getFirestoreDb } from "@/lib/firebase/client";

export type MachineRateSelectorProps = {
  readonly onSelect: (values: Record<string, number>) => void;
  readonly currentValues?: Readonly<Record<string, unknown>>;
  readonly inputMapping: Readonly<Record<string, MachineRecordField>>;
};

function normalizeMachineRecord(
  id: string,
  data: Record<string, unknown>,
): MachineRecord | null {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const hourlyRate = Number(data.hourlyRate);
  const amortization = Number(data.amortization);
  const energyCost = Number(data.energyCost);
  const maintenanceCost = Number(data.maintenanceCost);
  const currency =
    typeof data.currency === "string" && data.currency.trim().length > 0
      ? data.currency.trim()
      : "USD";

  if (!name || !Number.isFinite(hourlyRate) || hourlyRate < 0) {
    return null;
  }

  return {
    id,
    name,
    hourlyRate,
    amortization: Number.isFinite(amortization) ? amortization : 0,
    energyCost: Number.isFinite(energyCost) ? energyCost : 0,
    maintenanceCost: Number.isFinite(maintenanceCost) ? maintenanceCost : 0,
    currency,
  };
}

export function MachineRateSelector({
  onSelect,
  inputMapping,
}: MachineRateSelectorProps) {
  const t = useTranslations("generatedTool.machineRateSelector");
  const [machines, setMachines] = useState<MachineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachineId, setSelectedMachineId] = useState("");
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMachines() {
      setLoading(true);

      const db = getFirestoreDb();
      if (!db) {
        if (!cancelled) {
          setMachines([...DEMO_MACHINE_RECORDS]);
          setUsingDemoData(true);
          setLoading(false);
        }
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "machines"));
        const records = querySnapshot.docs
          .map((docSnapshot) =>
            normalizeMachineRecord(docSnapshot.id, docSnapshot.data() as Record<string, unknown>),
          )
          .filter((record): record is MachineRecord => record !== null);

        if (!cancelled) {
          if (records.length === 0) {
            setMachines([...DEMO_MACHINE_RECORDS]);
            setUsingDemoData(true);
          } else {
            setMachines(records);
            setUsingDemoData(false);
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setMachines([...DEMO_MACHINE_RECORDS]);
          setUsingDemoData(true);
          setLoading(false);
        }
      }
    }

    void fetchMachines();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleMachineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const machineId = event.target.value;
    setSelectedMachineId(machineId);

    const machine = machines.find((entry) => entry.id === machineId);
    if (!machine) {
      return;
    }

    const mappedValues = mapMachineToFormValues(machine, inputMapping);
    if (Object.keys(mappedValues).length === 0) {
      return;
    }

    onSelect(mappedValues);
  };

  const handleShopRateCalculated = (rates: ShopRateSavedRates) => {
    const mappedValues = mapShopRateRatesToFormValues(rates, inputMapping);
    if (Object.keys(mappedValues).length === 0) {
      return;
    }
    onSelect(mappedValues);
  };

  if (Object.keys(inputMapping).length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div>
        <label htmlFor="machine-rate-selector" className="text-sm font-semibold text-premium-velvet">
          {t("label")}
        </label>
        <p className="mt-1 text-sm text-body-charcoal">{t("description")}</p>
      </div>

      <select
        id="machine-rate-selector"
        value={selectedMachineId}
        onChange={handleMachineChange}
        disabled={loading || machines.length === 0}
        className="min-h-[44px] w-full rounded-lg border border-technical-gray bg-white px-3 py-2 text-sm text-body-charcoal"
      >
        <option value="">{loading ? t("loading") : t("selectPlaceholder")}</option>
        {machines.map((machine) => (
          <option key={machine.id} value={machine.id}>
            {machine.name} ({t("rateLabel", { rate: machine.hourlyRate, currency: machine.currency })})
          </option>
        ))}
      </select>

      {loading ? <p className="text-xs text-body-charcoal/80">{t("loading")}</p> : null}

      {usingDemoData ? (
        <p className="text-xs text-body-charcoal/80">{t("sourceDemo")}</p>
      ) : (
        <p className="text-xs text-body-charcoal/80">{t("sourceFirestore")}</p>
      )}

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="min-h-[44px] w-full rounded-lg border border-premium-copper bg-white px-3 py-2 text-sm font-semibold text-premium-copper hover:bg-surface-cream"
      >
        {t("calculateShopRate")}
      </button>

      <ShopRateCalculatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleShopRateCalculated}
      />
    </div>
  );
}
