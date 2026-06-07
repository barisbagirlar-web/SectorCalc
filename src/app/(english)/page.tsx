import HomePage, { generateMetadata } from "@/app/[locale]/page";

export { generateMetadata };

export const dynamic = "force-static";

const englishParams = Promise.resolve({ locale: "en" });

export default function EnglishRootHomePage() {
  return HomePage({ params: englishParams });
}
