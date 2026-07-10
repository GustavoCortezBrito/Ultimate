import type { Metadata, Viewport } from "next";
import "../styles.css";
import GoogleTags from "@/components/GoogleTags";

export const viewport: Viewport = {
  themeColor: "#FF5722",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ultimate Fitness | Mini Bike e Bicicleta Spinning para Casa",
  description: "Mini bike e bicicleta spinning Ultimate Fitness de alta qualidade. Adquira com envio expresso Full e compra protegida no Mercado Livre.",
  metadataBase: new URL("https://www.ultimatefitness.com.br"),
  keywords: [
    "mini bike",
    "bicicleta spinning",
    "fitness em casa",
    "exercício residencial",
    "Ultimate Fitness",
    "mini bike ergométrica",
    "cardio em casa",
    "equipamentos de ginástica",
    "bicicleta ergométrica"
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.ultimatefitness.com.br",
    title: "Ultimate Fitness | Equipamentos de Exercício para Casa",
    description: "Mini bike e bicicleta spinning de alta qualidade. Adquira com envio expresso Full e compra protegida no Mercado Livre.",
    siteName: "Ultimate Fitness",
    images: [
      {
        url: "https://www.ultimatefitness.com.br/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ultimate Fitness | Equipamentos de Exercício para Casa"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Fitness | Equipamentos de Exercício para Casa",
    description: "Treine em casa com equipamentos de verdade. Mini bike e bicicleta spinning de alta qualidade no Mercado Livre.",
    images: ["https://www.ultimatefitness.com.br/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Antic+Slab&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GoogleTags />
        {children}
      </body>
    </html>
  );
}
