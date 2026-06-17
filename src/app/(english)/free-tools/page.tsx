import type { Metadata } from "next";
import FreeToolsPage, {
  generateMetadata as generateFreeToolsMetadata,
} from "@/app/[locale]/free-tools/page";

export const revalidate = 3600;
export const dynamic = "force-static";

const englishParams = Promise.resolve({ locale: "en" });

export async function generateMetadata(): Promise<Metadata> {
  return generateFreeToolsMetadata({ params: englishParams });
}

export default async function EnglishFreeToolsPage() {
  return FreeToolsPage({ params: englishParams });
}
