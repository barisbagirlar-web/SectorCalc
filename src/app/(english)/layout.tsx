import { LocaleDocumentLayout } from "@/components/layout/LocaleDocumentLayout";

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleDocumentLayout locale="en">{children}</LocaleDocumentLayout>;
}
