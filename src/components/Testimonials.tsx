import { Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Fernanda R.",
    city: "São Paulo, SP",
    product: "Mini Bike Ergométrica",
    text: "Comprei com receio por ser mini bike, mas me surpreendi! Uso todos os dias enquanto trabalho em casa. Chegou rápido, a montagem é simples e a qualidade está acima do esperado. Super recomendo para quem tem pouco espaço.",
  },
  {
    name: "Marcos A.",
    city: "Curitiba, PR",
    product: "Mini Bike Ergométrica",
    text: "Comprei para minha mãe de 68 anos usar na fisioterapia em casa. Ela adorou — fica pedalando vendo TV sem esforço. Produto leve, fácil de guardar e de ótima qualidade. Voltaria a comprar sem dúvida.",
  },
  {
    name: "Juliana M.",
    city: "Belo Horizonte, MG",
    product: "Bicicleta Spinning",
    text: "A bicicleta chegou bem embalada e a montagem foi tranquila. Uso há dois meses para cardio em casa, pelo menos 40 minutos por dia. Está firme, sem barulho nenhum, e já sinto a diferença no condicionamento. Valeu muito a pena!",
  },
  {
    name: "Ricardo T.",
    city: "Porto Alegre, RS",
    product: "Bicicleta Spinning",
    text: "Excelente custo-benefício. Design bonito, estrutura robusta e o painel funciona perfeitamente. Moro em apartamento e não faz barulho nenhum — nem de madrugada incomoda. Nota 10 para a Ultimate Fitness!",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 sm:py-28 bg-[#111113]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24 space-y-5"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5722] bg-[#FF5722]/10 px-3.5 py-1.5 rounded-full">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Quem comprou, aprova e recomenda.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#18181b] rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/5 hover:border-[#FF5722]/20 hover:shadow-hover transition-all duration-300"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-5 select-none">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FF5722] text-[#FF5722]" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-white/55 font-medium leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              {/* Reviewer */}
              <div className="mt-8 pt-5 border-t border-white/10">
                <div className="font-bold text-sm text-white">
                  {t.name}
                </div>
                <div className="text-[10px] font-semibold text-white/40 mt-1">
                  {t.city} · {t.product}
                </div>
                
                {/* Verified */}
                <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold text-[#00a650] uppercase tracking-wider bg-[#00a650]/10 px-2.5 py-1 rounded-full w-max select-none">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />
                  <span>Compra verificada</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
