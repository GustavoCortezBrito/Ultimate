import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import logoAsset from "@/assets/ultimate-fitness-logo.png";

export function SubpageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0e0e10]/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logoAsset} alt="Ultimate Fitness" className="h-8 sm:h-9 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#FF5722] hover:opacity-90 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-full transition-all shadow-md cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Página Principal
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-white/30 mb-2">
            <Link to="/" className="hover:text-[#FF5722] transition-colors">Ultimate Fitness</Link> &nbsp;/&nbsp; {title}
          </p>
          {children}
        </div>
      </main>

      <footer className="bg-[#111113] border-t border-white/5 text-white/40 py-10 text-center text-xs">
        <p>Ultimate Fitness · ULTIMATE POWER DO BRASIL LTDA · CNPJ 57.491.644/0001-47 · Florianópolis/SC</p>
      </footer>
    </div>
  );
}
