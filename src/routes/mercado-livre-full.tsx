import { createFileRoute, Link } from "@tanstack/react-router";
import { SubpageLayout } from "@/components/SubpageLayout";
import { Truck, MapPin, ShieldCheck, PackageSearch, Home, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/mercado-livre-full")({
  head: () => ({
    meta: [
      { title: "Mercado Livre Full | Ultimate Fitness" },
      { name: "description", content: "Produtos fitness Ultimate Fitness com envio Full pelo Mercado Livre: rastreamento, prazo pelo CEP e compra em ambiente seguro." },
      { property: "og:title", content: "Mercado Livre Full | Ultimate Fitness" },
      { property: "og:description", content: "Produto fitness com envio Full, prazo conforme CEP e rastreamento dentro do Mercado Livre." },
      { property: "og:url", content: "https://ultimate-home-fitness.lovable.app/mercado-livre-full" },
    ],
    links: [{ rel: "canonical", href: "https://ultimate-home-fitness.lovable.app/mercado-livre-full" }],
  }),
  component: Page,
});

const items = [
  { icon: Truck, title: "Logística do Mercado Livre", text: "Produto enviado pela estrutura logística do Mercado Livre." },
  { icon: PackageSearch, title: "Rastreamento", text: "Acompanhe o pedido dentro da própria plataforma." },
  { icon: MapPin, title: "Prazo pelo CEP", text: "O prazo de entrega é calculado conforme o seu endereço." },
  { icon: ShieldCheck, title: "Compra segura", text: "Compra realizada em ambiente seguro do Mercado Livre." },
  { icon: Home, title: "Mais comodidade", text: "Receba os produtos fitness Ultimate Fitness em casa." },
];

function Page() {
  return (
    <SubpageLayout title="Mercado Livre Full">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Por que comprar com envio Full?</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
        Com o Mercado Livre Full, os produtos Ultimate Fitness são processados e enviados pela estrutura
        logística do Mercado Livre, oferecendo mais praticidade para sua compra — do clique à entrega.
      </p>
      <ul className="mt-10 grid sm:grid-cols-2 gap-4">
        {items.map((b) => (
          <li key={b.title} className="bg-card p-5 rounded-xl border border-border flex items-start gap-3 shadow-card">
            <div className="w-10 h-10 rounded-lg bg-gradient-cta grid place-items-center text-primary-foreground flex-shrink-0">
              <b.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">{b.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{b.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          to="/"
          hash="produtos"
          className="inline-flex items-center gap-2 bg-gradient-cta text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-cta hover:scale-[1.02] transition-transform"
        >
          <ShoppingBag className="w-5 h-5" /> Ver produtos com envio Full
        </Link>
        <p className="text-xs text-muted-foreground text-center max-w-xl">
          Prazo, frete, estoque e condições de compra são informados diretamente no anúncio do Mercado Livre.
        </p>
      </div>
    </SubpageLayout>
  );
}
