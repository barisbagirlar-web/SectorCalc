import HomePage, { generateMetadata } from "@/app/[locale]/page";

export { generateMetadata };

const englishParams = Promise.resolve({ locale: "en" });

export default function EnglishRootHomePage() {
  return HomePage({ params: englishParams });
}
