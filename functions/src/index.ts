import { onRequest } from "firebase-functions/v2/https";
import { handleUpdateLeadPipeline } from "./updateLeadPipelineHandler";

export const updateLeadPipeline = onRequest(
  {
    region: "us-central1",
    secrets: ["ADMIN_LEAD_UPDATE_SECRET"],
    invoker: "public",
  },
  (req, res) => {
    void handleUpdateLeadPipeline(req, res);
  }
);
