import { motion } from "framer-motion";
import { Truck, ShieldCheck, RotateCcw, Zap } from "lucide-react";

const perks = [
  { icon: Truck, title: "Envio Expresso Full", desc: "Entrega prioritária realizada diretamente pelo centro de distribuição do Mercado Livre." },
  { icon: ShieldCheck, title: "Compra 100% Protegida", desc: "Seu dinheiro fica protegido pela plataforma até o produto chegar na sua residência." },
  { icon: Zap, title: "Pagamentos Seguros", desc: "Pix instantâneo, boleto bancário ou parcelamento facilitado em até 12x no cartão." },
  { icon: RotateCcw, title: "Devolução sem Custo", desc: "Trocas e devoluções gratuitas garantidas pelas diretrizes do Mercado Livre." },
];

export function FullShippingBanner() {
  return (
    <section className="bg-white py-20 sm:py-24 border-t border-[#e8e8ed]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24 space-y-3"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF683C] bg-[#FF683C]/8 px-3.5 py-1.5 rounded-full">
            Garantia & Logística
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
            Toda a segurança do Mercado Livre.
          </h2>
        </motion.div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-[#f5f5f7] rounded-3xl p-6 sm:p-7 flex flex-col gap-4 hover:shadow-card hover:bg-white transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-[#A61713]/8 rounded-xl flex items-center justify-center text-[#A61713] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-[#1d1d1f] group-hover:text-[#A61713] transition-colors">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
