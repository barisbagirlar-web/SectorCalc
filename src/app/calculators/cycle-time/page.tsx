import type { Metadata } from "next";
import {
  createLeanMetricMetadata,
  LeanMetricHubPage,
} from "@/components/calculators/lean/LeanMetricHubPage";

export async function generateMetadata(): Promise<Metadata> {
  return createLeanMetricMetadata("cycle-time");
}

export default function Page() {
  return <LeanMetricHubPage slug="cycle-time" />;
}
