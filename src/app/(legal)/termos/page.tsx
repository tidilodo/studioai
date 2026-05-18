import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">Termos de Uso</h1>
        <p className="text-zinc-500 text-sm mb-8">Última atualização: 18 de maio de 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Aceitação</h2>
            <p>Ao utilizar o StudioAI, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Descrição do serviço</h2>
            <p>O StudioAI é uma plataforma de geração de imagens com inteligência artificial. O serviço oferece planos gratuitos e pagos com diferentes limites de uso.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Conta e acesso</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Você é responsável por manter a segurança da sua conta</li>
              <li>Cada pessoa pode ter apenas uma conta</li>
              <li>Contas que violem estes termos podem ser suspensas sem aviso prévio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Uso aceitável</h2>
            <p>É proibido usar o StudioAI para gerar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conteúdo ilegal ou que viole direitos de terceiros</li>
              <li>Material de exploração ou abuso infantil</li>
              <li>Desinformação ou deepfakes com intenção de enganar</li>
              <li>Spam ou conteúdo automatizado em massa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Propriedade das imagens</h2>
            <p>As imagens geradas pertencem ao usuário que as criou. Você pode usá-las para fins pessoais e comerciais sem restrições, exceto para os usos proibidos acima.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Planos e pagamento</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Plano Free: 10 gerações por dia, renovadas automaticamente</li>
              <li>Plano PRO: R$ 29/mês, gerações ilimitadas</li>
              <li>Pagamentos processados pelo Mercado Pago</li>
              <li>Cancelamento pode ser solicitado a qualquer momento</li>
              <li>Não há reembolso para períodos já utilizados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Disponibilidade</h2>
            <p>O serviço é oferecido "como está". Não garantimos disponibilidade ininterrupta. Podemos alterar, suspender ou descontinuar funcionalidades a qualquer momento.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. Limitação de responsabilidade</h2>
            <p>O StudioAI não se responsabiliza por danos indiretos, perdas de lucro ou prejuízos decorrentes do uso ou impossibilidade de uso do serviço.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">9. Alterações</h2>
            <p>Podemos atualizar estes termos a qualquer momento. Alterações significativas serão comunicadas por email ou aviso na plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">10. Foro</h2>
            <p>Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Brasília/DF para dirimir quaisquer controvérsias.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
