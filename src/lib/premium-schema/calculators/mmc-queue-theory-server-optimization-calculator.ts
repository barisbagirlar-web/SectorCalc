import { MmcKuyrukTeorisiVeSunucuOptimizasyonuCalculator57InputSchema, type MmcKuyrukTeorisiVeSunucuOptimizasyonuCalculator57Input } from "./mmc-kuyruk-teorisi-ve-sunucu-optimizasyonu-calculator-57-validation";

export const calculateMmcKuyrukTeorisiVeSunucuOptimizasyonuCalculator57Contract: any = {
  id: "mmc-kuyruk-teorisi-ve-sunucu-optimizasyonu-calculator-57",
  version: "1.0.0",
  category: "cost",
  inputSchema: MmcKuyrukTeorisiVeSunucuOptimizasyonuCalculator57InputSchema,
  
  execute: async (input: any) => {
    try {
      const { arrivalRate, serviceRate, servers, waitCostHr, serverCostHr } = input;

      // Validate inputs
      if (arrivalRate <= 0 || serviceRate <= 0 || servers <= 0 || waitCostHr <= 0 || serverCostHr <= 0) {
        throw new Error("All input values must be greater than zero.");
      }

      // Rho Utilization: ρ = λ / (c * μ)
      const rhoUtilization = arrivalRate / (servers * serviceRate);

      if (rhoUtilization >= 1) {
        throw new Error("System is unstable: Utilization (ρ) must be less than 1 for queue to be finite.");
      }

      // P0 Prob Empty: P0 = 1 - ρ (for M/M/1, simplified approximation for general c)
      // For M/M/c, we use the Erlang B approximation for P0
      // P0 = 1 / [ Σ ( (cρ)^k / k! ) + ( (cρ)^c / (c! * (1 - ρ)) ) ] from k=0 to c-1
      let sum = 0;
      for (let k = 0; k < servers; k++) {
        sum += Math.pow(servers * rhoUtilization, k) / factorial(k);
      }
      const lastTerm = Math.pow(servers * rhoUtilization, servers) / (factorial(servers) * (1 - rhoUtilization));
      const p0ProbEmpty = 1 / (sum + lastTerm);

      // Lq Queue Length for M/M/c:
      // Lq = (P0 * (cρ)^c * ρ) / (c! * (1 - ρ)^2)
      const lqQueueLength = (p0ProbEmpty * Math.pow(servers * rhoUtilization, servers) * rhoUtilization) / (factorial(servers) * Math.pow(1 - rhoUtilization, 2));

      // Ls System Length: Ls = Lq + cρ
      const lsSystemLength = lqQueueLength + (servers * rhoUtilization);

      // Wq Wait Time (hours): Wq = Lq / λ
      const wqWaitTimeHrs = lqQueueLength / arrivalRate;

      // Ws System Time (hours): Ws = Ls / λ
      const wsSystemTimeHrs = lsSystemLength / arrivalRate;

      // Total Wait Cost: Total_Wait_Cost = Lq * waitCostHr
      const totalWaitCost = lqQueueLength * waitCostHr;

      // Total Server Cost: Total_Server_Cost = servers * serverCostHr
      const totalServerCost = servers * serverCostHr;

      // Total System Cost: Total_System_Cost = Total_Wait_Cost + Total_Server_Cost
      const totalSystemCost = totalWaitCost + totalServerCost;

      return {
        rhoUtilization: Math.round(rhoUtilization * 10000) / 10000,
        p0ProbEmpty: Math.round(p0ProbEmpty * 10000) / 10000,
        lqQueueLength: Math.round(lqQueueLength * 10000) / 10000,
        lsSystemLength: Math.round(lsSystemLength * 10000) / 10000,
        wqWaitTimeHrs: Math.round(wqWaitTimeHrs * 10000) / 10000,
        wsSystemTimeHrs: Math.round(wsSystemTimeHrs * 10000) / 10000,
        totalWaitCost: Math.round(totalWaitCost * 10000) / 10000,
        totalServerCost: Math.round(totalServerCost * 10000) / 10000,
        totalSystemCost: Math.round(totalSystemCost * 10000) / 10000
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};

// Helper function for factorial calculation
function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}