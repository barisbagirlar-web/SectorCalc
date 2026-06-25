import { DinamikKanbanKartiVeWipTamponBoyutlandirmaCalculator53InputSchema, type DinamikKanbanKartiVeWipTamponBoyutlandirmaCalculator53Input } from "./dinamik-kanban-karti-ve-wip-tampon-boyutlandirma-calculator-53-validation";

export const calculateDinamikKanbanKartiVeWipTamponBoyutlandirmaCalculator53Contract: any = {
  id: "dinamik-kanban-karti-ve-wip-tampon-boyutlandirma-calculator-53",
  version: "1.0.0",
  category: "cost",
  inputSchema: DinamikKanbanKartiVeWipTamponBoyutlandirmaCalculator53InputSchema,
  
  execute: async (input: any) => {
    try {
      const dailyDemand = Number(input.dailyDemand);
      const waitTime = Number(input.waitTime);
      const processTime = Number(input.processTime);
      const transportTime = Number(input.transportTime);
      const containerCap = Number(input.containerCap);
      const safetyFactor = Number(input.safetyFactor);

      if (dailyDemand <= 0 || waitTime <= 0 || processTime <= 0 || transportTime <= 0 || containerCap <= 0) {
        throw new Error("All input values must be positive numbers.");
      }

      // Lead_Time_Total = wait_time + process_time + transport_time
      const leadTimeTotal = waitTime + processTime + transportTime;

      // Raw_Kanban_Count = (daily_demand * Lead_Time_Total * (1 + safety_factor)) / container_cap
      const rawKanbanCount = (dailyDemand * leadTimeTotal * (1 + safetyFactor)) / containerCap;

      // Kanban_Cards = CEILING(Raw_Kanban_Count)
      const kanbanCards = Math.ceil(rawKanbanCount);

      // Max_WIP_Units = Kanban_Cards * container_cap
      const maxWIPUnits = kanbanCards * containerCap;

      // WIP_Days_Coverage = Max_WIP_Units / daily_demand
      const wIPDaysCoverage = maxWIPUnits / dailyDemand;

      // Theoretical_Min_WIP = daily_demand * process_time
      const theoreticalMinWIP = dailyDemand * processTime;

      return {
        leadTimeTotal: Math.round(leadTimeTotal * 100) / 100,
        rawKanbanCount: Math.round(rawKanbanCount * 100) / 100,
        kanbanCards,
        maxWIPUnits,
        wIPDaysCoverage: Math.round(wIPDaysCoverage * 100) / 100,
        theoreticalMinWIP
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};