export type MachineRecord = {
  readonly id: string;
  readonly name: string;
  readonly hourlyRate: number;
  readonly amortization: number;
  readonly energyCost: number;
  readonly maintenanceCost: number;
  readonly currency: string;
};

export type MachineRecordField = keyof Omit<MachineRecord, "id" | "name" | "currency">;

export const DEMO_MACHINE_RECORDS: readonly MachineRecord[] = [
  {
    id: "cnc-1",
    name: "CNC Torna",
    hourlyRate: 45,
    amortization: 12,
    energyCost: 8,
    maintenanceCost: 5,
    currency: "USD",
  },
  {
    id: "frez-1",
    name: "3 Eksen Freze",
    hourlyRate: 55,
    amortization: 15,
    energyCost: 10,
    maintenanceCost: 6,
    currency: "USD",
  },
  {
    id: "worker-1",
    name: "Usta (8 yıl)",
    hourlyRate: 30,
    amortization: 0,
    energyCost: 0,
    maintenanceCost: 0,
    currency: "USD",
  },
] as const;
