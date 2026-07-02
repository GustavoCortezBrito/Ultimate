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
    <section id="como-comprar" className="py-20 sm:py-28 bg-[#0e0e10]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24 space-y-5"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5722] bg-[#FF5722]/10 px-3.5 py-1.5 rounded-full">
            Processo de Compra
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
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
              className="bg-[#18181b] rounded-3xl p-7 flex flex-col justify-between border border-white/5 hover:border-[#FF5722]/30 hover:shadow-hover transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-[#FF5722]/10 rounded-2xl flex items-center justify-center text-[#FF5722]">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <span className="text-3xl font-bold text-[#FF5722]/30 select-none">{step}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-lg leading-snug group-hover:text-[#FF5722] transition-colors">
                  {title}
                </h3>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed font-medium">
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
            className="bg-gradient-to-r from-[#D11919] to-[#FF5722] hover:opacity-90 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-sm text-center"
          >
            Ver Mini Bike no Mercado Livre
          </a>
          <a
            href="https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 border border-white/15 hover:bg-white/10 text-white/80 font-bold text-sm px-8 py-3.5 rounded-full transition-all text-center"
          >
            Ver Spinning no Mercado Livre
          </a>
        </motion.div>
      </div>
    </section>
  );
}
