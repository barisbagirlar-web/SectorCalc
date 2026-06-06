import { onRequest } from "firebase-functions/v2/https";
import { ADMIN_FUNCTION_REGION } from "./constants";
import { REVENUE_FUNCTION_REGION } from "./regions";
import { handleUpdateLeadPipeline } from "./updateLeadPipelineHandler";
import { handleUpdateLeadTestClassification } from "./updateLeadTestClassificationHandler";
import { handleCreateStripeCheckout } from "./createStripeCheckout";
import { handleStripeWebhook } from "./stripeWebhook";

/** Admin — frozen region; do not migrate without explicit approval. */
export const updateLeadPipeline = onRequest(
  {
    region: ADMIN_FUNCTION_REGION,
    secrets: ["ADMIN_LEAD_UPDATE_SECRET"],
    invoker: "public",
  },
  (req, res) => {
    void handleUpdateLeadPipeline(req, res);
  }
);

export const updateLeadTestClassification = onRequest(
  {
    region: ADMIN_FUNCTION_REGION,
    invoker: "public",
  },
  (req, res) => {
    void handleUpdateLeadTestClassification(req, res);
  }
);

/** Revenue Flow — use REVENUE_FUNCTION_REGION for all new billing/report functions. */
export const createStripeCheckout = onRequest(
  {
    region: REVENUE_FUNCTION_REGION,
    invoker: "public",
  },
  (req, res) => {
    void handleCreateStripeCheckout(req, res);
  }
);

export const stripeWebhook = onRequest(
  {
    region: REVENUE_FUNCTION_REGION,
    invoker: "public",
  },
  (req, res) => {
    void handleStripeWebhook(req, res);
  }
);
