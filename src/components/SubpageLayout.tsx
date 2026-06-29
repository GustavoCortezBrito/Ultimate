import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import logoAsset from "@/assets/ultimate-fitness-logo.png";

export function SubpageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoAsset} alt="Ultimate Fitness" className="h-8 sm:h-9 w-auto" />
          </Link>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Início
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">Ultimate Fitness</Link> &nbsp;/&nbsp; {title}
          </p>
          {children}
        </div>
      </main>

      <footer className="bg-foreground text-background py-10 text-center text-xs text-background/70">
        <p>Ultimate Fitness · ULTIMATE POWER DO BRASIL LTDA · CNPJ 57.491.644/0001-47 · Florianópolis/SC</p>
      </footer>
    </div>
  );
}
