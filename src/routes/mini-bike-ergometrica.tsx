import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout } from "@/components/SubpageLayout";
import { ProductCard, miniBikeProduct } from "@/components/ProductCard";
import { miniBikeSlides } from "@/data/products";

export const Route = createFileRoute("/mini-bike-ergometrica")({
  head: () => ({
    meta: [
      { title: "Mini Bike Ergométrica Ultimate Fitness | Portátil e Dobrável" },
      { name: "description", content: "Mini bike ergométrica Ultimate Fitness: portátil, dobrável, com tela LCD. Ideal para exercícios em casa, exercício sentado para pernas e rotinas leves. Envio Full." },
      { property: "og:title", content: "Mini Bike Ergométrica Ultimate Fitness" },
      { property: "og:description", content: "Mini bicicleta ergométrica portátil e dobrável para exercícios em casa, com envio Full pelo Mercado Livre." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://ultimate-home-fitness.lovable.app/mini-bike-ergometrica" },
    ],
    links: [{ rel: "canonical", href: "https://ultimate-home-fitness.lovable.app/mini-bike-ergometrica" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Mini Bike Ergométrica Ultimate Fitness",
          description:
            "Mini bike ergométrica portátil e dobrável com tela LCD para exercícios em casa.",
          brand: { "@type": "Brand", name: "Ultimate Fitness" },
          offers: {
            "@type": "Offer",
            url: miniBikeProduct.link,
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
    <SubpageLayout title="Mini Bike Ergométrica">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Mini Bike Ergométrica Ultimate Fitness</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
        A mini bike ergométrica portátil e dobrável da Ultimate Fitness é uma opção compacta para
        exercícios em casa, exercício sentado para pernas e rotinas de movimento leve. Possui tela LCD e ocupa pouco espaço.
      </p>
      <div className="mt-10 max-w-xl">
        <ProductCard {...miniBikeProduct} slides={miniBikeSlides} />
      </div>
      <div className="mt-12 prose max-w-none text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Por que escolher uma mini bicicleta ergométrica</h2>
        <p>
          A mini bike portátil é uma escolha prática de equipamento fitness residencial: pode ser usada
          embaixo da mesa, na sala ou no escritório. É indicada para quem busca uma rotina ativa em casa,
          adultos e idosos ativos, e também para atividades orientadas por profissionais.
        </p>
      </div>
    </SubpageLayout>
  );
}
