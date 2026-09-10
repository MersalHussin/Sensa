import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import Header from './components/sections/Header';
import Footer from './components/sections/Footer';
import MainWrapper from './components/sections/MainWrapper';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Sensa | سينسا',
  description: 'Sensa - Premium Skincare & Cosmetics | سينسا - حلول متقدمة للعناية بالبشرة والجمال',
  icons: {
    icon: '/images/Sensa.png',
    apple: '/images/Sensa.png',
  },
  openGraph: {
    title: 'Sensa | سينسا',
    description: 'Sensa - Premium Skincare & Cosmetics | سينسا - حلول متقدمة للعناية بالبشرة والجمال',
    images: [{ url: '/images/Sensa.png' }],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("i18nextLng");
  const lang = langCookie ? langCookie.value : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className="scroll-smooth">
      <body className="font-sans antialiased overflow-x-hidden flex flex-col min-h-screen">
        <Header />
        <MainWrapper>
          {children}
        </MainWrapper>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
