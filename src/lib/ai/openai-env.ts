import "server-only";

export type OpenAiRepairEnv = {
  apiKey: string;
  repairModel: string;
  maxInputChars: number;
};

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server env: ${name}`);
  }

  return value;
}

export function getOpenAiRepairEnv(): OpenAiRepairEnv {
  return {
    apiKey: required("OPENAI_API_KEY"),
    repairModel: process.env.OPENAI_REPAIR_MODEL || "gpt-5.5",
    maxInputChars: Number(process.env.AI_MAX_INPUT_CHARS || 12000),
  };
}
