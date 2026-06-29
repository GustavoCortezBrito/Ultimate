import { createFileRoute } from "@tanstack/react-router";
import { SubpageLayout } from "@/components/SubpageLayout";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/termos-de-servico")({
  head: () => ({
    meta: [
      { title: "Termos de Serviço | Ultimate Fitness" },
      {
        name: "description",
        content:
          "Termos de Serviço da Ultimate Fitness — condições de uso do site e das compras realizadas por nossos canais.",
      },
    ],
    links: [{ rel: "canonical", href: "https://ultimate-home-fitness.lovable.app/termos-de-servico" }],
  }),
  component: TermosDeServico,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-[#1d1d1f]">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2 font-medium">{children}</div>
    </div>
  );
}

function TermosDeServico() {
  return (
    <SubpageLayout title="Termos de Serviço">
      {/* Header */}
      <div className="flex items-start gap-4 mb-10 pb-8 border-b border-[#e8e8ed]">
        <div className="w-12 h-12 bg-[#D11919]/8 rounded-2xl flex items-center justify-center shrink-0 mt-1">
          <FileText className="w-6 h-6 text-[#D11919]" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">
            Termos de Serviço
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-2 uppercase tracking-wider">
            Última atualização: Junho de 2025
          </p>
        </div>
      </div>

      <div className="space-y-10 max-w-3xl">
        <p className="text-sm text-gray-500 leading-relaxed font-medium bg-[#f8f8fa] rounded-2xl p-5 border border-[#e8e8ed]">
          Ao acessar e utilizar este site, você concorda com os presentes Termos de Serviço da{" "}
          <strong className="text-[#1d1d1f]">ULTIMATE POWER DO BRASIL LTDA</strong> ("Ultimate Fitness").
          Caso não concorde com qualquer disposição abaixo, por favor não utilize nosso site.
        </p>

        <Section title="1. Sobre a Empresa">
          <p>
            A Ultimate Fitness é uma marca registrada da <strong>ULTIMATE POWER DO BRASIL LTDA</strong>,
            pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 57.491.644/0001-47, com sede
            em Florianópolis/SC. Atuamos no comércio varejista de artigos esportivos e equipamentos
            fitness para uso residencial.
          </p>
        </Section>

        <Section title="2. Uso do Site">
          <p>Ao utilizar este site, você concorda em:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Utilizar o conteúdo exclusivamente para fins pessoais e não comerciais;</li>
            <li>Não reproduzir, distribuir ou modificar qualquer conteúdo sem autorização prévia;</li>
            <li>Não utilizar mecanismos automatizados (bots, scrapers) para acessar o site;</li>
            <li>Não praticar atos que comprometam a segurança ou integridade do site.</li>
          </ul>
        </Section>

        <Section title="3. Produtos e Compras">
          <p>
            As compras dos nossos produtos são realizadas exclusivamente pela plataforma do{" "}
            <strong>Mercado Livre</strong>. Este site funciona como vitrine institucional e não processa
            diretamente pedidos ou pagamentos.
          </p>
          <p>
            Ao clicar em qualquer botão de compra, você será redirecionado ao Mercado Livre, onde os
            termos, condições, prazos de entrega, políticas de devolução e garantias são regidos
            integralmente pelas regras daquela plataforma.
          </p>
          <p>
            As informações de preço e disponibilidade exibidas neste site são meramente informativas e
            podem variar. Os preços definitivos e vinculantes são os apresentados no Mercado Livre no
            momento da compra.
          </p>
        </Section>

        <Section title="4. Propriedade Intelectual">
          <p>
            Todo o conteúdo deste site — incluindo textos, logotipos, imagens, marca "Ultimate Fitness"
            e elementos gráficos — são de propriedade exclusiva da Ultimate Power do Brasil LTDA e
            estão protegidos pela legislação de propriedade intelectual brasileira.
          </p>
          <p>
            É vedada a reprodução, cópia, distribuição ou uso comercial de qualquer elemento sem
            autorização expressa e por escrito.
          </p>
        </Section>

        <Section title="5. Limitação de Responsabilidade">
          <p>
            A Ultimate Fitness não se responsabiliza por:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Problemas de entrega, pagamento ou garantia processados pelo Mercado Livre;</li>
            <li>Danos decorrentes do uso inadequado dos equipamentos adquiridos;</li>
            <li>Interrupções temporárias no acesso ao site por razões técnicas;</li>
            <li>Conteúdo de sites de terceiros acessados por links presentes neste site.</li>
          </ul>
        </Section>

        <Section title="6. Política de Envio e Logística">
          <p>
            Trabalhamos com o serviço <strong>Mercado Livre Full</strong>, que garante estoque
            centralizado, envio expresso e rastreamento em tempo real. Os prazos e condições de envio
            são determinados inteiramente pelo Mercado Livre e podem variar conforme a localização do
            destinatário e disponibilidade de estoque.
          </p>
        </Section>

        <Section title="7. Política de Trocas e Devoluções">
          <p>
            Trocas e devoluções são processadas diretamente pela plataforma do Mercado Livre, seguindo
            as regras e prazos estabelecidos por eles. O Mercado Livre oferece proteção ao comprador
            com garantia de reembolso em casos previstos em suas políticas.
          </p>
          <p>
            Para assistência adicional, o cliente pode entrar em contato conosco via WhatsApp.
          </p>
        </Section>

        <Section title="8. Lei Aplicável e Foro">
          <p>
            Estes Termos de Serviço são regidos pela legislação brasileira. Fica eleito o foro da
            Comarca de Florianópolis/SC para dirimir quaisquer controvérsias decorrentes deste
            instrumento, exceto nos casos em que a lei disponha de foro específico em favor do
            consumidor.
          </p>
        </Section>

        <Section title="9. Alterações nos Termos">
          <p>
            Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações
            entram em vigor imediatamente após a publicação nesta página. O uso continuado do site
            após as alterações implica a aceitação dos novos termos.
          </p>
        </Section>

        <Section title="10. Contato">
          <p>Para dúvidas sobre estes Termos, entre em contato:</p>
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
