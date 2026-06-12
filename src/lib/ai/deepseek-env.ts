import "server-only";

export type DeepSeekRepairEnv = {
  apiKey: string;
  flashModel: string;
  proModel: string;
  repairProvider: "openai" | "deepseek";
  routingMode: "balanced-pro" | "flash-only" | "pro-only";
  escalationEnabled: boolean;
  maxInputChars: number;
};

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server env: ${name}`);
  }

  return value;
}

export function getDeepSeekRepairEnv(): DeepSeekRepairEnv {
  const provider = process.env.AI_REPAIR_PROVIDER || "deepseek";
  const routingMode = process.env.AI_REPAIR_ROUTING_MODE || "balanced-pro";

  if (provider !== "openai" && provider !== "deepseek") {
    throw new Error(`Invalid AI_REPAIR_PROVIDER: ${provider}`);
  }

  if (
    routingMode !== "balanced-pro" &&
    routingMode !== "flash-only" &&
    routingMode !== "pro-only"
  ) {
    throw new Error(`Invalid AI_REPAIR_ROUTING_MODE: ${routingMode}`);
  }

  return {
    apiKey: required("DEEPSEEK_API_KEY"),
    flashModel: process.env.DEEPSEEK_REPAIR_MODEL || "deepseek-v4-flash",
    proModel: process.env.DEEPSEEK_REPAIR_PRO_MODEL || "deepseek-v4-pro",
    repairProvider: provider,
    routingMode,
    escalationEnabled: process.env.AI_REPAIR_ESCALATION_ENABLED !== "false",
    maxInputChars: Number(process.env.AI_MAX_INPUT_CHARS || 12000),
  };
}

export function getAiRepairProvider() {
  return getDeepSeekRepairEnv().repairProvider;
}
