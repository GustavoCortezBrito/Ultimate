import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout } from "@/components/SubpageLayout";
import { ProductCard, spinningProduct } from "@/components/ProductCard";
import { spinningSlides } from "@/data/products";

export const Route = createFileRoute("/bicicleta-ergometrica-spinning")({
  head: () => ({
    meta: [
      { title: "Bicicleta Ergométrica Spinning Ultimate Fitness | Cardio em Casa" },
      { name: "description", content: "Bicicleta ergométrica spinning Ultimate Fitness para cardio em casa, condicionamento físico e treino residencial. Compra com envio Full pelo Mercado Livre." },
      { property: "og:title", content: "Bicicleta Ergométrica Spinning Ultimate Fitness" },
      { property: "og:description", content: "Bicicleta spinning para casa, com guidão ajustável e suporte para até 120 kg. Envio Full pelo Mercado Livre." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://ultimate-home-fitness.lovable.app/bicicleta-ergometrica-spinning" },
    ],
    links: [{ rel: "canonical", href: "https://ultimate-home-fitness.lovable.app/bicicleta-ergometrica-spinning" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Bicicleta Ergométrica Spinning Ultimate Fitness",
          description:
            "Bicicleta ergométrica spinning residencial, com guidão ajustável e suporte para até 120 kg, para cardio em casa.",
          brand: { "@type": "Brand", name: "Ultimate Fitness" },
          offers: {
            "@type": "Offer",
            url: spinningProduct.link,
            availability: "https://schema.org/InStock",
            priceCurrency: "BRL",
          },
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SubpageLayout title="Bicicleta Ergométrica Spinning">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Bicicleta Ergométrica Spinning Ultimate Fitness</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
        Uma bicicleta spinning para casa pensada para cardio em casa, condicionamento e treino residencial com mais intensidade.
      </p>
      <div className="mt-10 max-w-xl">
        <ProductCard {...spinningProduct} slides={spinningSlides} />
      </div>
      <div className="mt-12 prose max-w-none text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Cardio em casa com praticidade</h2>
        <p>
          A bicicleta ergométrica spinning Ultimate Fitness é uma opção robusta de equipamento fitness residencial
          para quem quer manter uma rotina cardiovascular sem sair de casa, com guidão ajustável e estrutura para
          suportar até 120 kg.
        </p>
      </div>
    </SubpageLayout>
  );
}
