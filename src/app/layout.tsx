import { PaddleProvider } from '@/lib/paddle-provider'

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
    <PaddleProvider>
      {children}
    </PaddleProvider>
 );
}
