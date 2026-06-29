export const dynamic = "force-dynamic";
import { redirect } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ToolsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  redirect({ href: "/tools/generated", locale });
}
