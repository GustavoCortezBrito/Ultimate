"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const faqs = [
  {
    q: "Mini bike ergométrica emagrece?",
    a: "Sim! O uso regular da mini bike ajuda na queima de calorias, melhora a circulação e contribui para o condicionamento físico geral. Combinada a uma alimentação equilibrada, é uma ótima aliada no processo de emagrecimento. Estudos indicam que atividades aeróbicas moderadas, como pedalar, queimam entre 150 e 300 calorias por hora dependendo do esforço e peso do usuário.",
  },
  {
    q: "Qual a diferença entre mini bike e bicicleta spinning?",
    a: "A mini bike é compacta e portátil — você usa sentado em qualquer cadeira ou sofá, movimentando pernas (ou braços). Já a bicicleta spinning é um equipamento completo, com estrutura, guidão e assento próprios, voltado para treinos cardiovasculares mais intensos. A mini bike é ideal para quem busca movimento leve no dia a dia; a spinning, para quem quer treinos mais intensos em casa.",
  },
  {
    q: "A mini bike serve para idosos ou pessoas em fisioterapia?",
    a: "Sim, é um dos públicos que mais se beneficia! A mini bike é indicada para exercícios de baixo impacto, mobilidade articular e recuperação física. Por ser leve, silenciosa e fácil de usar, pode ser utilizada sentado no sofá ou em uma cadeira confortável. Recomendamos sempre consultar um médico ou fisioterapeuta antes de iniciar qualquer rotina de exercícios.",
  },
  {
    q: "Quanto tempo por dia devo usar a mini bike?",
    a: "Para iniciantes, recomenda-se começar com 15 a 20 minutos por dia e ir aumentando gradualmente. O ideal para obter resultados consistentes é pedalar entre 30 e 45 minutos diários, pelo menos 4 vezes por semana. Por ser um exercício de baixo impacto, pode ser praticado diariamente sem sobrecarregar as articulações.",
  },
  {
    q: "Os produtos da Ultimate Fitness têm garantia?",
    a: "Sim! Todos os nossos produtos são vendidos pelo Mercado Livre e contam com a garantia do fabricante e a proteção da Compra Garantida do Mercado Livre. Em caso de qualquer problema com o produto, o comprador está protegido pela plataforma. Entre em contato conosco diretamente pelo Mercado Livre para suporte pós-venda.",
  },
  {
    q: "Como faço para comprar com segurança?",
    a: 'Todas as nossas vendas são realizadas exclusivamente pelo Mercado Livre, a maior plataforma de e-commerce da América Latina. Isso garante pagamento seguro, rastreamento da entrega, Compra Garantida e suporte em caso de qualquer problema. Basta clicar em "Comprar no Mercado Livre" no produto desejado e seguir o processo seguro da plataforma.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#0e0e10] border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24 space-y-5"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5722] bg-[#FF5722]/10 px-3.5 py-1.5 rounded-full">
            Dúvidas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Perguntas Frequentes
          </h2>
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="bg-[#18181b] rounded-3xl overflow-hidden border border-white/5 hover:border-[#FF5722]/20 transition-all duration-300"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 p-6 text-left cursor-pointer select-none group font-medium"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-white text-sm sm:text-base leading-snug">
                    {f.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-white/30 group-hover:text-[#FF5722] shrink-0"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-white/50 leading-relaxed font-semibold">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
