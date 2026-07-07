import type { Metadata, Viewport } from "next";
import "../styles.css";

export const viewport: Viewport = {
  themeColor: "#FF5722",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ultimate Fitness | Mini Bike e Bicicleta Spinning para Casa",
  description: "Mini bike ergométrica e bicicleta spinning Ultimate Fitness de alta qualidade para otimizar sua rotina fitness. Envio expresso Full e compra protegida pelo Mercado Livre.",
  metadataBase: new URL("https://ultimate-3.vercel.app"),
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
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ultimate-3.vercel.app",
    title: "Ultimate Fitness | Equipamentos de Exercício para Casa",
    description: "Mini bike ergométrica e bicicleta spinning residenciais de alta qualidade. Adquira pelo Mercado Livre com envio Full.",
    siteName: "Ultimate Fitness",
    images: [
      {
        url: "https://ultimate-3.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ultimate Fitness | Equipamentos de Exercício para Casa"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Fitness | Equipamentos de Exercício para Casa",
    description: "Treine em casa com equipamentos de verdade. Mini bike e bicicleta spinning residenciais de alta qualidade.",
    images: ["https://ultimate-3.vercel.app/opengraph-image.png"],
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
