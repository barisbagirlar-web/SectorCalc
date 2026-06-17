import FreeToolsPage, { generateMetadata } from "@/app/[locale]/free-tools/page";

export { generateMetadata };

export const revalidate = 3600;
export const dynamic = "force-static";

const englishParams = Promise.resolve({ locale: "en" });
const englishSearchParams = Promise.resolve({});

export default function EnglishFreeToolsPage() {
  return FreeToolsPage({ params: englishParams, searchParams: englishSearchParams });
}
