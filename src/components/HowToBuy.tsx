import { motion } from "framer-motion";
import { Search, MousePointerClick, CreditCard, Package } from "lucide-react";

const steps = [
  { icon: Search, step: "01", title: "Encontre o produto", desc: "Acesse a página do produto no Mercado Livre através de nossos links." },
  { icon: MousePointerClick, step: "02", title: "Clique em Comprar", desc: "Selecione a opção de compra rápida e adicione ao seu carrinho." },
  { icon: CreditCard, step: "03", title: "Escolha o pagamento", desc: "Selecione Pix, cartão de crédito ou boleto — tudo processado pelo ML." },
  { icon: Package, step: "04", title: "Receba com Envio Full", desc: "Entrega expressa pelo Mercado Envios direto do centro logístico para sua casa." },
];

export function HowToBuy() {
  return (
    <section id="como-comprar" className="py-20 sm:py-28 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24 space-y-3"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF683C] bg-[#FF683C]/8 px-3.5 py-1.5 rounded-full">
            Processo de Compra
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1d1d1f] tracking-tight">
            Comprar é rápido e 100% seguro.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-3xl p-7 flex flex-col justify-between shadow-card border border-[#e8e8ed]/60 hover:shadow-hover transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-[#A61713]/8 rounded-2xl flex items-center justify-center text-[#A61713]">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <span className="text-3xl font-bold text-gray-200 select-none">{step}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-[#1d1d1f] font-bold text-lg leading-snug group-hover:text-[#A61713] transition-colors">
                  {title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#A61713] hover:bg-[#8f1210] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-colors shadow-sm text-center"
          >
            Ver Mini Bike no Mercado Livre
          </a>
          <a
            href="https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-sm px-8 py-3.5 rounded-full transition-colors shadow-sm text-center"
          >
            Ver Spinning no Mercado Livre
          </a>
        </motion.div>
      </div>
    </section>
  );
}
