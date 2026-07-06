import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Ultimate Fitness | Mini Bike e Bicicleta Spinning para Casa",
  description: "Mini bike ergométrica e bicicleta spinning Ultimate Fitness de alta qualidade para otimizar sua rotina fitness. Envio expresso Full e compra protegida pelo Mercado Livre.",
  metadataBase: new URL("https://ultimate-home-fitness.lovable.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ultimate-home-fitness.lovable.app",
    title: "Ultimate Fitness | Equipamentos de Exercício para Casa",
    description: "Mini bike ergométrica e bicicleta spinning residenciais de alta qualidade. Adquira pelo Mercado Livre com envio Full.",
    siteName: "Ultimate Fitness",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Fitness | Equipamentos de Exercício para Casa",
    description: "Treine em casa com equipamentos de verdade. Mini bike e bicicleta spinning residenciais de alta qualidade.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Antic+Slab&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
