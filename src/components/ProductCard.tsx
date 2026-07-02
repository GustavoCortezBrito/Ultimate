import { useState } from "react";
import { Check, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { ProductCarousel, type CarouselSlide } from "./ProductCarousel";
import { motion, AnimatePresence } from "framer-motion";

export type ProductCardProps = {
  title: string;
  subtitle: string;
  description: string;
  badges: string[];
  tag?: string;
  specs?: { label: string; value: string }[];
  audience?: { title: string; items: string[] };
  rating?: { stars?: string; sales?: string; reviews?: string };
  link: string;
  slides: CarouselSlide[];
  price?: string;
  originalPrice?: string;
  installments?: string;
  discountBadge?: string;
};

type Tab = "desc" | "specs" | "for";

export function ProductCard({
  title,
  subtitle,
  description,
  badges,
  tag,
  specs,
  audience,
  rating,
  link,
  slides,
  price,
  originalPrice,
  installments,
  discountBadge,
}: ProductCardProps) {
  const [tab, setTab] = useState<Tab>("desc");

  const tabs: { id: Tab; label: string }[] = [
    { id: "desc", label: "Produto" },
    { id: "specs", label: "Ficha" },
    { id: "for", label: "Indicação" },
  ];

  return (
    <article className="bg-[#18181b] rounded-[28px] flex flex-col h-full hover:shadow-[0_0_40px_rgba(255,87,34,0.08)] transition-all duration-500 relative overflow-hidden border border-white/[0.06]">
      {/* Tag */}
      {tag && (
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#D11919] to-[#FF5722] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
          {tag}
        </div>
      )}

      {/* Carousel — full width, no padding */}
      <div className="overflow-hidden rounded-t-[28px] flex-shrink-0">
        <ProductCarousel slides={slides} />
      </div>

      {/* Thin orange accent line */}
      <div className="h-[2px] bg-gradient-to-r from-[#D11919] via-[#FF5722] to-transparent flex-shrink-0" />

      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-4">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-bold text-white text-xl sm:text-2xl tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-[#FF5722] text-[11px] font-bold uppercase tracking-wider opacity-80">{subtitle}</p>

          {price && (
            <div className="pt-1.5 flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                {originalPrice && (
                  <span className="text-xs text-white/30 line-through font-medium">
                    {originalPrice}
                  </span>
                )}
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {price}
                </span>
                {discountBadge && (
                  <span className="text-[10px] font-bold text-[#00a650] bg-[#00a650]/10 px-2 py-0.5 rounded border border-[#00a650]/20 uppercase tracking-wide">
                    {discountBadge}
                  </span>
                )}
              </div>
              {installments && (
                <p className="text-[11px] text-white/50 font-medium">
                  ou <span className="text-[#FF5722] font-semibold">{installments}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rating */}
        {rating?.stars && (
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, idx) => (
                <svg key={idx} className="w-3.5 h-3.5 fill-[#FF5722]" viewBox="0 0 20 20"><path d="M10 1l2.4 7H19l-5.7 4.1 2.2 7L10 15.4 4.5 19.1l2.2-7L1 8h6.6z"/></svg>
              ))}
            </div>
            <span className="text-xs font-bold text-white/80">{rating.stars}</span>
            {rating.reviews && <span className="text-xs text-white/30">({rating.reviews} avaliações)</span>}
            {rating.sales && (
              <span className="ml-auto text-[10px] font-bold text-[#FF5722] bg-[#FF5722]/10 px-2.5 py-1 rounded-full border border-[#FF5722]/20">
                {rating.sales} vendidos
              </span>
            )}
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex bg-[#0e0e10] rounded-2xl p-1 select-none relative gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-bold transition-all cursor-pointer relative rounded-xl z-10 ${
                tab === t.id ? "text-white" : "text-white/30 hover:text-white/60"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <motion.div
                  layoutId={`tab-bg-${title}`}
                  className="absolute inset-0 bg-gradient-to-r from-[#D11919] to-[#FF5722] rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 min-h-[140px]">
          <AnimatePresence mode="wait">
            {tab === "desc" && (
              <motion.div key="desc" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="space-y-3">
                <p className="text-sm text-white/50 leading-relaxed">{description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {badges.map(b => (
                    <span key={b} className="text-[10px] font-bold text-white/40 bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-full">{b}</span>
                  ))}
                </div>
              </motion.div>
            )}
            {tab === "specs" && (
              <motion.div key="specs" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                {specs?.length ? (
                  <div className="divide-y divide-white/[0.06]">
                    {specs.map(s => (
                      <div key={s.label} className="flex justify-between items-center py-2.5 text-xs">
                        <span className="text-white/35 font-medium">{s.label}</span>
                        <span className="font-bold text-white/80">{s.value}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-white/30">Ficha técnica indisponível.</p>}
              </motion.div>
            )}
            {tab === "for" && (
              <motion.div key="for" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                {audience ? (
                  <ul className="space-y-2.5">
                    {audience.items.map(item => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                        <div className="w-4 h-4 bg-[#FF5722]/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#FF5722]" strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-white/30">Sem informações adicionais.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer CTA */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-white/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00a650]" />
            Compra Protegida pelo Mercado Livre
          </div>

          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D11919] to-[#FF5722] text-white font-bold text-sm px-6 py-4 rounded-2xl w-full shadow-[0_4px_20px_rgba(255,87,34,0.3)] hover:shadow-[0_4px_28px_rgba(255,87,34,0.5)] transition-shadow cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 shrink-0" />
            Comprar no Mercado Livre
          </motion.a>

          <p className="text-[10px] text-center text-white/25 flex items-center justify-center gap-1.5 font-semibold uppercase tracking-wider">
            <Truck className="w-3 h-3 text-[#00a650]" /> Envio Full · Todo o Brasil
          </p>
        </div>
      </div>
    </article>
  );
}

export const miniBikeProduct: ProductCardProps = {
  title: "Mini Bike Bicicleta Ergométrica",
  subtitle: "Ultimate Fitness — Portátil · Dobrável",
  description: "Mini bike ergométrica premium. Compacta, portátil e dobrável. Ideal para exercícios de membros inferiores e superiores, reabilitação e ganho de mobilidade.",
  tag: "Destaque",
  badges: ["Envio Full", "+5 mil vendidos", "4.8★", "Portátil", "Aço e ABS"],
  price: "R$ 164,90",
  installments: "12x de R$ 16,30",
  specs: [
    { label: "Finalidade", value: "Para exercício, reabilitação" },
    { label: "Material", value: "De Aço, ABS" },
    { label: "Peso do Aparelho", value: "2.6 kg" },
    { label: "Dimensões", value: "32cm (A) × 20cm (L) × 40cm (C)" },
    { label: "Garantia", value: "3 meses" },
  ],
  audience: {
    title: "Indicado para:",
    items: [
      "Exercícios físicos e reabilitação motora",
      "Treinar mobilidade de pernas e braços",
      "Movimento ativo de baixo impacto sentado",
      "Fácil de transportar e guardar no lar",
    ],
  },
  rating: { stars: "4.8/5", sales: "+5 mil", reviews: "2.429" },
  link: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  slides: [],
};

export const spinningProduct: ProductCardProps = {
  title: "Bicicleta Ergométrica Spinning",
  subtitle: "Ultimate Fitness — Silenciosa · Regulável",
  description: "Bicicleta de spinning residencial de alta qualidade. Com guidão ajustável, assento confortável, e estrutura forte para suportar seus treinos de cardio em casa.",
  tag: "Novidade",
  badges: ["Envio Full", "+25 vendidos", "4.6★", "Suporta até 120kg", "Painel Digital"],
  price: "R$ 581,22",
  originalPrice: "R$ 749,00",
  discountBadge: "22% OFF",
  installments: "12x de R$ 56,20",
  specs: [
    { label: "Carga Suportada", value: "Suporta até 120 kg" },
    { label: "Guidão", value: "Adaptável às necessidades do usuário" },
    { label: "Benefício", value: "Treino sem impacto e melhora da saúde" },
    { label: "Cor", value: "Vermelho" },
    { label: "Alimentação do Painel", value: "Pilhas" },
    { label: "Garantia", value: "3 meses" },
  ],
  audience: {
    title: "Indicado para:",
    items: [
      "Exercícios cardiovasculares intensos em casa",
      "Treinar sem impacto e melhorar a saúde integral",
      "Simular treinos de ciclismo indoor",
      "Uso em apartamentos por ser extremamente silenciosa",
    ],
  },
  rating: { stars: "4.6/5", sales: "+25", reviews: "7" },
  link: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  slides: [],
};
