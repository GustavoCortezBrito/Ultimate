"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 5000, suffix: "+", label: "Pedidos Entregues" },
  { value: 4.8, suffix: "", label: "Avaliação Média", decimals: 1 },
  { value: 2000, suffix: "+", label: "Avaliações Verificadas" },
];

function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1500;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = t * (2 - t);
      setVal(parseFloat((to * ease).toFixed(decimals)));
      if (t < 1) requestAnimationFrame(animate);
      else setVal(to);
    };
    requestAnimationFrame(animate);
  }, [inView, to, decimals]);

  const display = decimals > 0 ? val.toFixed(decimals).replace(".", ",") : Math.floor(val).toLocaleString("pt-BR");
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

export function SocialProofCounter() {
  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-[#18181b] rounded-3xl p-8 sm:p-10 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center py-4 first:pt-0 last:pb-0 md:py-0 md:px-6"
            >
              <div className="text-3xl sm:text-4xl font-bold text-[#FF5722] tracking-tight">
                <CountUp to={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="text-[10px] sm:text-xs font-semibold text-white/40 mt-2 tracking-wide uppercase">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
