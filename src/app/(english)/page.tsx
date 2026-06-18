import type { Metadata } from "next";
import HomePage, { generateMetadata as generateHomeMetadata } from "@/app/[locale]/page";

export const dynamic = "force-dynamic";

const englishParams = Promise.resolve({ locale: "en" });

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata({ params: englishParams });
}

export default async function EnglishRootHomePage() {
  return await HomePage({ params: englishParams });
}
