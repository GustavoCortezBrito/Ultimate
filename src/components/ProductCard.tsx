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
};

type Tab = "desc" | "specs" | "for";

export function ProductCard({ title, subtitle, description, badges, tag, specs, audience, rating, link, slides }: ProductCardProps) {
  const [tab, setTab] = useState<Tab>("desc");

  const tabs: { id: Tab; label: string }[] = [
    { id: "desc", label: "Produto" },
    { id: "specs", label: "Ficha" },
    { id: "for", label: "Indicação" },
  ];

  return (
    <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border border-[#e8e8ed]/60 flex flex-col h-full hover:shadow-hover transition-all duration-300 relative">
      {/* Tag */}
      {tag && (
        <div className="absolute top-8 left-8 z-20 bg-[#A61713] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
          {tag}
        </div>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden rounded-3xl mb-6">
        <ProductCarousel slides={slides} />
      </div>

      <div className="flex flex-col flex-1 px-1">
        {/* Header */}
        <h3 className="font-bold text-[#1d1d1f] text-2xl tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-[#FF683C] text-[11px] font-bold uppercase tracking-wider mt-1">{subtitle}</p>

        {/* Rating */}
        {rating?.stars && (
          <div className="flex items-center gap-3 mt-4 pb-4 border-b border-[#e8e8ed]">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 fill-[#FF683C]" viewBox="0 0 20 20"><path d="M10 1l2.4 7H19l-5.7 4.1 2.2 7L10 15.4 4.5 19.1l2.2-7L1 8h6.6z"/></svg>
              ))}
            </div>
            <span className="text-xs font-bold text-[#1d1d1f]">{rating.stars}</span>
            {rating.reviews && <span className="text-xs text-gray-400">({rating.reviews} avaliações)</span>}
            {rating.sales && <span className="text-xs font-bold text-[#A61713] bg-[#A61713]/8 px-2.5 py-0.5 rounded-full">{rating.sales} vendidos</span>}
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex bg-[#f5f5f7] rounded-full p-1 mt-5 select-none relative">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer relative rounded-full z-10 ${
                tab === t.id ? "text-[#A61713]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <motion.div
                  layoutId={`tab-bg-${title}`}
                  className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 min-h-[160px] mt-6">
          <AnimatePresence mode="wait">
            {tab === "desc" && (
              <motion.div key="desc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {badges.map(b => (
                    <span key={b} className="text-[10px] font-bold text-gray-500 bg-[#f5f5f7] px-3 py-1.5 rounded-full">{b}</span>
                  ))}
                </div>
              </motion.div>
            )}
            {tab === "specs" && (
              <motion.div key="specs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                {specs?.length ? (
                  <div className="divide-y divide-[#e8e8ed] font-medium">
                    {specs.map(s => (
                      <div key={s.label} className="flex justify-between items-center py-2.5 text-xs">
                        <span className="text-gray-400">{s.label}</span>
                        <span className="font-bold text-[#1d1d1f] text-right">{s.value}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">Ficha técnica indisponível.</p>}
              </motion.div>
            )}
            {tab === "for" && (
              <motion.div key="for" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                {audience ? (
                  <ul className="space-y-3 font-medium">
                    {audience.items.map(item => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                        <div className="w-5 h-5 bg-[#A61713]/8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#A61713]" strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-gray-400">Sem informações adicionais.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        <div className="mt-6 space-y-4 pt-5 border-t border-[#e8e8ed]">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-[#00a650]" />
            Compra Protegida pelo Mercado Livre
          </div>

          <motion.a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#A61713] to-[#FF683C] text-white font-bold text-sm px-6 py-4 rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg w-full"
          >
            <ShoppingCart className="w-5 h-5" />
            Comprar no Mercado Livre
          </motion.a>

          <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1 font-semibold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-[#00a650]" /> Envio Full · Todo o Brasil
          </p>
        </div>
      </div>
    </article>
  );
}

export const miniBikeProduct: ProductCardProps = {
  title: "Mini Bike Ergométrica",
  subtitle: "Ultimate Fitness — Portátil · Dobrável · LCD",
  description: "Mini bike ergométrica premium. Compacta, portátil e dobrável. Ideal para se exercitar enquanto trabalha, idosos ou fisioterapia. Acompanha painel LCD de controle.",
  tag: "Destaque",
  badges: ["Envio Full", "+5 mil vendidos", "4.8★", "Portátil", "Painel LCD"],
  specs: [
    { label: "Dimensões", value: "40 × 38 × 30 cm" },
    { label: "Carga Máxima", value: "100 kg" },
    { label: "Painel LCD", value: "Tempo, distância, calorias" },
    { label: "Garantia", value: "3 meses" },
  ],
  audience: {
    title: "Indicado para:",
    items: [
      "Treinar mobilidade de pernas e braços em casa",
      "Movimento ativo de baixo impacto sentado",
      "Melhorar a circulação sanguínea no escritório",
      "Uso prático por idosos ou em fisioterapia",
    ],
  },
  rating: { stars: "4.8/5", sales: "+5 mil", reviews: "2.000" },
  link: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  slides: [],
};

export const spinningProduct: ProductCardProps = {
  title: "Bicicleta Spinning",
  subtitle: "Ultimate Fitness — Silenciosa · Cardio · Robusta",
  description: "Bicicleta de spinning residencial de alta performance. Guidão ajustável, assento confortável, sistema de resistência mecânico e monitor completo.",
  tag: "Novidade",
  badges: ["Envio Full", "Resistência ajustável", "Silenciosa", "Até 120kg", "Painel Digital"],
  specs: [
    { label: "Dimensões", value: "100 × 50 × 110 cm" },
    { label: "Carga Máxima", value: "120 kg" },
    { label: "Resistência", value: "Mecânica microajustável" },
    { label: "Garantia", value: "3 meses" },
  ],
  audience: {
    title: "Indicado para:",
    items: [
      "Exercícios cardiovasculares intensos em casa",
      "Queima calórica acelerada e ganho de fôlego",
      "Simular treinos de ciclismo indoor",
      "Uso em apartamentos por ser extremamente silenciosa",
    ],
  },
  rating: { stars: "4.8/5", sales: "+200", reviews: "45" },
  link: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  slides: [],
};
