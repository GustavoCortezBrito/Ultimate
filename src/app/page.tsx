"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home, ShieldCheck, ShoppingBag, Menu, X, Truck, Zap, Trophy, Flag,
  ArrowRight, Check, MapPin, Phone, Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroImg from "@/assets/product_real.png";
import brandOfficeImg from "@/assets/brand_office.png";
import logoAsset from "@/assets/ultimate-fitness-logo.png";
import { FullShippingBanner } from "@/components/FullShippingBanner";
import { ProductCard, miniBikeProduct, spinningProduct } from "@/components/ProductCard";
import { miniBikeSlides, spinningSlides } from "@/data/products";
import { SocialProofCounter } from "@/components/SocialProofCounter";
import { Testimonials } from "@/components/Testimonials";
import { FAQ, faqs } from "@/components/FAQ";
import { HowToBuy } from "@/components/HowToBuy";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LoadingScreen } from "@/components/LoadingScreen";
import { HeroParticles } from "@/components/HeroParticles";

const features = [
  { icon: Trophy, title: "Qualidade de Ponta", text: "Equipamentos fitness altamente duráveis selecionados com critério." },
  { icon: Home, title: "Exercícios no Lar", text: "Soluções práticas e compactas feitas sob medida para sua rotina diária." },
  { icon: ShieldCheck, title: "Compra Protegida", text: "Toda a segurança operacional e financeira fornecida pelo Mercado Livre." },
  { icon: Flag, title: "Envio Nacional", text: "Suporte e estoque local no Brasil para um despacho ágil e sem complicações." },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  const nav = [
    { href: "#inicio", label: "Início" },
    { href: "#produtos", label: "Produtos" },
    { href: "#como-comprar", label: "Como Comprar" },
    { href: "#faq", label: "FAQ" },
    { href: "#sobre", label: "Sobre" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollPos = window.scrollY + 160;
      for (const item of nav) {
        const sectionId = item.href.replace("#", "");
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white overflow-x-hidden font-sans">
      <HeroParticles />
      <LoadingScreen />

      {/* Header */}
      <header className={`fixed inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "top-0 bg-[#111113]/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-lg"
          : "top-0 bg-transparent py-5"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a href="#inicio" className="shrink-0 select-none transition-transform hover:scale-[1.01] flex items-center gap-2">
            <Image src={logoAsset} alt="Logo Ultimate Fitness" className="h-8 sm:h-9 w-auto" priority />
          </a>
          <nav className="hidden md:flex items-center gap-1 select-none">
            {nav.map((n) => {
              const sectionId = n.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a key={n.href} href={n.href}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive ? "text-[#FF5722]" : "text-white/70 hover:text-white"
                  }`}>
                  {n.label}
                </a>
              );
            })}
          </nav>
          <button className="md:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-[#111113]/95 backdrop-blur-xl">
              <div className="px-4 py-4 flex flex-col gap-1">
                {nav.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                    className="text-xs font-bold uppercase tracking-widest py-3 px-4 hover:bg-white/10 rounded-2xl text-white/70 hover:text-white transition-colors">
                    {n.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* HERO */}
        <section id="inicio" className="relative min-h-screen flex items-center bg-transparent overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#D11919]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] bg-[#FF5722]/6 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-7">
                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                  Treine em casa com<br />
                  <span className="text-[#FF5722]">equipamentos de verdade.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg text-white/55 max-w-xl leading-relaxed font-medium">
                  Mini bikes ergométricas e bicicletas spinning de alta qualidade para otimizar sua rotina fitness com a segurança do Mercado Livre.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.28 }} className="space-y-2.5">
                  {["Mais performance para seus treinos", "Melhore seu condicionamento físico", "Estrutura forte, estável e durável"].map((b) => (
                    <div key={b} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                      <div className="w-5 h-5 bg-[#D11919]/20 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#FF5722]" strokeWidth={3} />
                      </div>
                      {b}
                    </div>
                  ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.36 }}
                  className="flex flex-wrap gap-4 pt-2 select-none">
                  <a href="#produtos"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D11919] to-[#FF5722] text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    <ShoppingBag className="w-5 h-5 shrink-0" /> Ver Produtos <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href="#sobre"
                    className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white/80 font-bold px-8 py-4 rounded-full hover:bg-white/15 transition-all">
                    Sobre a Ultimate
                  </a>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, x: 30, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                  <Image src={heroImg} alt="Bicicleta Spinning Ultimate Fitness e Embalagem Oficial"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" fill />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <SocialProofCounter />

        {/* PRODUCTS */}
        <section id="produtos" className="py-20 sm:py-28 bg-[#111113]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-24 space-y-5">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5722] bg-[#FF5722]/10 px-3.5 py-1.5 rounded-full">
                Equipamentos em Destaque
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Compactos, Resistentes e Silenciosos
              </h2>
              <p className="text-xs sm:text-sm text-white/50 font-medium">
                Adquira diretamente pela plataforma do Mercado Livre com envio expresso e suporte nacional completo.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              <ProductCard {...miniBikeProduct} slides={miniBikeSlides} />
              <ProductCard {...spinningProduct} slides={spinningSlides} />
            </div>
          </div>
        </section>

        <FullShippingBanner />
        <HowToBuy />

        {/* FEATURES */}
        <section className="py-20 sm:py-28 bg-[#0e0e10]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-24 space-y-5">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5722] bg-[#FF5722]/10 px-3.5 py-1.5 rounded-full">
                Nossos Diferenciais
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Por que escolher a Ultimate Fitness?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div key={f.title}
                  className="bg-[#18181b] rounded-3xl p-7 flex flex-col gap-6 hover:shadow-hover transition-all duration-300 group border border-white/5 hover:border-[#FF5722]/30">
                  <div className="w-12 h-12 bg-[#FF5722]/10 rounded-2xl flex items-center justify-center text-[#FF5722] shrink-0">
                    <f.icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-white text-base group-hover:text-[#FF5722] transition-colors">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-semibold">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />
        <FAQ />

        {/* ABOUT */}
        <section id="sobre" className="py-20 sm:py-28 bg-[#111113] border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[420px] rounded-3xl overflow-hidden shadow-card border border-white/10 bg-[#18181b] p-2">
                  <Image src={brandOfficeImg} alt="Showroom Ultimate Fitness" className="w-full h-auto rounded-2xl block" />
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF5722]/10 text-[#FF5722] text-[10px] font-bold tracking-wider uppercase border border-[#FF5722]/20">
                  Quem Somos
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">A marca Ultimate Fitness</h2>
                <p className="text-sm sm:text-base text-white/55 leading-relaxed font-semibold">
                  A Ultimate Fitness é uma marca da <strong className="text-white">ULTIMATE POWER DO BRASIL LTDA</strong>, loja fitness em Florianópolis/SC.
                </p>
                <p className="text-sm sm:text-base text-white/55 leading-relaxed font-semibold">
                  Nosso foco é oferecer equipamentos fitness compactos, práticos e funcionais para quem deseja melhorar o condicionamento físico.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Razão Social</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1">ULTIMATE POWER DO BRASIL LTDA</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">CNPJ</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1">57.491.644/0001-47</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Sede Corporativa</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1">Florianópolis / SC</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Canal Logístico</div>
                    <div className="text-xs sm:text-sm font-bold text-[#FF5722] mt-1">Mercado Livre Full</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contato" className="bg-[#111113] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Image src={logoAsset} alt="Ultimate Fitness" className="h-9 w-auto brightness-0 invert opacity-90 mb-4" />
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Equipamentos fitness compactos e duráveis para exercícios em casa. Vendas pela plataforma Mercado Livre com logística Full e compra protegida.
                </p>
              </motion.div>
              <div className="flex gap-3 pt-1">
                {[
                  { label: "Instagram", href: "https://instagram.com", hover: "hover:bg-pink-600", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { label: "WhatsApp", href: "https://wa.me/5548999998358", hover: "hover:bg-green-600", d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" },
                ].map((s, i) => (
                  <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.08 * i }} whileHover={{ scale: 1.18 }}
                    className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center ${s.hover} transition-all duration-300`}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d={s.d} /></svg>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Links Rápidos</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Início", href: "#inicio" }, { label: "Produtos", href: "#produtos" },
                  { label: "Como Comprar", href: "#como-comprar" }, { label: "FAQ", href: "#faq" },
                  { label: "Sobre a Ultimate", href: "#sobre" },
                ].map((link, i) => (
                  <motion.li key={link.label} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.05 * i }}>
                    <a href={link.href} className="text-gray-400 hover:text-[#FF5722] transition-colors text-sm font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D11919] rounded-full shrink-0" />{link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Páginas</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
                  { label: "Termos de Serviço", href: "/termos-de-servico" },
                ].map((link, i) => (
                  <motion.li key={link.label} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.05 * i }}>
                    <Link href={link.href} className="text-gray-400 hover:text-[#FF5722] transition-colors text-sm font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D11919] rounded-full shrink-0" />{link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contato</h4>
              <ul className="space-y-4">
                <motion.li initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="flex items-start gap-3 text-gray-400 text-sm font-medium">
                  <MapPin size={18} className="text-[#D11919] shrink-0 mt-0.5" />
                  <span>Florianópolis / SC<br />
                    <span className="text-xs text-gray-500">ULTIMATE POWER DO BRASIL LTDA<br />CNPJ: 57.491.644/0001-47</span>
                  </span>
                </motion.li>
                <motion.li initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                  <Phone size={18} className="text-[#D11919] shrink-0" />
                  <a href="https://wa.me/5548999998358" className="hover:text-[#FF5722] transition-colors">
                    WhatsApp: (48) 99999-8358
                  </a>
                </motion.li>
              </ul>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs font-medium text-center md:text-left">
                © {new Date().getFullYear()} Ultimate Fitness · Todos os direitos reservados.
              </p>
              <div className="flex gap-6 text-xs">
                <Link href="/politica-de-privacidade" className="text-gray-500 hover:text-[#FF5722] transition-colors font-medium">
                  Política de Privacidade
                </Link>
                <Link href="/termos-de-servico" className="text-gray-500 hover:text-[#FF5722] transition-colors font-medium">
                  Termos de Serviço
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      <WhatsAppFloat />
    </div>
  );
}
