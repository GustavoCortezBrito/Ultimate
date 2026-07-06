import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Ultimate Fitness | Mini Bike e Bicicleta Spinning para Casa",
  description: "Mini bike ergométrica e bicicleta spinning Ultimate Fitness para treino em casa. Envio Full e compra protegida pelo Mercado Livre.",
  openGraph: {
    type: "website",
    siteName: "Ultimate Fitness",
  },
  twitter: {
    card: "summary_large_image",
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
