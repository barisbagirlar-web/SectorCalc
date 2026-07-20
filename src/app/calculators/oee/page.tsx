import type { Metadata } from "next";
import {
  createLeanMetricMetadata,
  LeanMetricHubPage,
} from "@/components/calculators/lean/LeanMetricHubPage";

export async function generateMetadata(): Promise<Metadata> {
  return createLeanMetricMetadata("oee");
}

export default function Page() {
  return <LeanMetricHubPage slug="oee" />;
}
