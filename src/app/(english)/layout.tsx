import "../site-styles";
import "../globals.css";
import { LocaleDocumentLayout } from "@/components/layout/LocaleDocumentLayout";

export const dynamic = "force-dynamic";

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleDocumentLayout locale="en">{children}</LocaleDocumentLayout>;
}
