import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildSoftwareApplicationJsonLd, buildWebsiteJsonLd, buildEntityGraph } from "@/lib/seo/schema-mesh";
import { THEME_COLOR } from "@/config/organization-trust";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SectorCalc",
  description: "Industrial calculation platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": 160,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: THEME_COLOR,
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
   <html
     lang="en"
     dir="ltr"
     className={`${inter.variable} ${jetbrainsMono.variable}`.trim()}
   >
     <head>
       {/* DNS Preconnects */}
       <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
       <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />
     </head>
     <body className="min-w-0 overflow-x-hidden bg-industrial-matte font-sans text-[17px] leading-[1.47059] text-premium-velvet antialiased">
       <JsonLd
         data={[
           buildEntityGraph(),
           buildWebsiteJsonLd(),
           buildSoftwareApplicationJsonLd(),
         ]}
       />
       {children}
     </body>
   </html>
 );
}
