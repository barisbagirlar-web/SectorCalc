export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ToolsIndexPage({ params }: PageProps) {
  redirect("/tools/generated");
}
