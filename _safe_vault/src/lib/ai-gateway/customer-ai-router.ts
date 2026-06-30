import "server-only";
import { runDeepSeekCustomerAssistant } from "./deepseek-customer-client";
import { validateCustomerAiResponse } from "./customer-ai-validator";
import type { CustomerAiGatewayResult, CustomerAiRequest } from "./customer-ai-types";

export async function handleCustomerAiRequest(
  request: CustomerAiRequest,
): Promise<CustomerAiGatewayResult> {
  const modelResponse = await runDeepSeekCustomerAssistant(request);
  const safeResponse = validateCustomerAiResponse(request, modelResponse);

  return {
    ...safeResponse,
    modelTier: modelResponse.modelTier,
    modelUsed: modelResponse.modelUsed,
  };
}
