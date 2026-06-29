import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout } from "@/components/SubpageLayout";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Ultimate Fitness" },
      {
        name: "description",
        content:
          "Política de Privacidade da Ultimate Fitness — entenda como coletamos, usamos e protegemos seus dados pessoais.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ultimate-home-fitness.lovable.app/politica-de-privacidade" }],
  }),
  component: PoliticaDePrivacidade,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-[#1d1d1f]">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2 font-medium">{children}</div>
    </div>
  );
}

function PoliticaDePrivacidade() {
  return (
    <SubpageLayout title="Política de Privacidade">
      {/* Header */}
      <div className="flex items-start gap-4 mb-10 pb-8 border-b border-[#e8e8ed]">
        <div className="w-12 h-12 bg-[#D11919]/8 rounded-2xl flex items-center justify-center shrink-0 mt-1">
          <Shield className="w-6 h-6 text-[#D11919]" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-2 uppercase tracking-wider">
            Última atualização: Junho de 2025
          </p>
        </div>
      </div>

      <div className="space-y-10 max-w-3xl">
        <p className="text-sm text-gray-500 leading-relaxed font-medium bg-[#f8f8fa] rounded-2xl p-5 border border-[#e8e8ed]">
          A sua privacidade é muito importante para nós. Esta política descreve como a{" "}
          <strong className="text-[#1d1d1f]">ULTIMATE POWER DO BRASIL LTDA</strong> ("Ultimate Fitness",
          "nós", "nosso") coleta, usa e protege as informações pessoais dos visitantes e clientes do
          nosso site.
        </p>

        <Section title="1. Informações que Coletamos">
          <p>
            Podemos coletar as seguintes categorias de informação:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de acesso.</li>
            <li><strong>Dados de contato:</strong> nome, telefone e e-mail quando você nos contata via WhatsApp ou formulários.</li>
            <li><strong>Dados de transação:</strong> informações relacionadas às compras realizadas pelo Mercado Livre. Esses dados são processados diretamente pela plataforma do Mercado Livre e estão sujeitos à política de privacidade deles.</li>
          </ul>
        </Section>

        <Section title="2. Como Usamos seus Dados">
          <p>Utilizamos os dados coletados para:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Responder a dúvidas e solicitações de suporte;</li>
            <li>Melhorar a experiência de navegação no site;</li>
            <li>Analisar métricas de acesso para aprimorar nossos conteúdos;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </Section>

        <Section title="3. Compartilhamento de Dados">
          <p>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins
            comerciais. Seus dados podem ser compartilhados apenas:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Com o <strong>Mercado Livre</strong>, nossa plataforma de vendas, para processamento de pedidos;</li>
            <li>Com autoridades competentes quando exigido por lei;</li>
            <li>Com prestadores de serviço tecnológico que nos auxiliam na operação do site, sob obrigação de confidencialidade.</li>
          </ul>
        </Section>

        <Section title="4. Cookies e Tecnologias de Rastreamento">
          <p>
            Nosso site pode usar cookies de sessão e de análise para melhorar a experiência do
            usuário e mensurar o tráfego. Você pode configurar seu navegador para recusar cookies,
            mas isso pode afetar a funcionalidade de certas áreas do site.
          </p>
        </Section>

        <Section title="5. Segurança">
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra
            acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum sistema
            de transmissão de dados pela internet é 100% seguro.
          </p>
        </Section>

        <Section title="6. Seus Direitos (LGPD)">
          <p>
            Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Confirmar a existência de tratamento de seus dados;</li>
            <li>Acessar seus dados pessoais;</li>
            <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a eliminação dos dados;</li>
            <li>Revogar seu consentimento a qualquer momento.</li>
          </ul>
          <p className="mt-2">
            Para exercer esses direitos, entre em contato conosco pelo WhatsApp disponível no site.
          </p>
        </Section>

        <Section title="7. Retenção de Dados">
          <p>
            Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta
            política, ou conforme exigido por lei.
          </p>
        </Section>

        <Section title="8. Links Externos">
          <p>
            Nosso site contém links para o Mercado Livre. Não nos responsabilizamos pelas práticas
            de privacidade de outros sites. Recomendamos que você leia a política de privacidade de
            cada site que visitar.
          </p>
        </Section>

        <Section title="9. Alterações nesta Política">
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente
            estará sempre disponível nesta página, com a data de última atualização indicada no topo.
          </p>
        </Section>

        <Section title="10. Contato">
          <p>
            Para dúvidas ou solicitações relacionadas à privacidade de dados, entre em contato:
          </p>
          <div className="bg-[#f8f8fa] rounded-2xl p-4 border border-[#e8e8ed] mt-2">
            <p><strong>Empresa:</strong> ULTIMATE POWER DO BRASIL LTDA</p>
            <p><strong>CNPJ:</strong> 57.491.644/0001-47</p>
            <p><strong>Localização:</strong> Florianópolis / SC</p>
            <p><strong>Canal:</strong> WhatsApp (disponível no site)</p>
          </div>
        </Section>
      </div>
    </SubpageLayout>
  );
}
