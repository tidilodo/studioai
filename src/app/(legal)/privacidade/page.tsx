import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">Política de Privacidade</h1>
        <p className="text-zinc-500 text-sm mb-8">Última atualização: 18 de maio de 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Dados coletados</h2>
            <p>Coletamos apenas os dados necessários para o funcionamento do serviço:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email e nome (cadastro)</li>
              <li>Prompts e imagens geradas (histórico do usuário)</li>
              <li>Dados de pagamento processados pelo Mercado Pago (não armazenamos dados de cartão)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Uso dos dados</h2>
            <p>Seus dados são usados exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Autenticação e acesso à plataforma</li>
              <li>Geração e armazenamento de imagens</li>
              <li>Processamento de pagamentos</li>
              <li>Comunicações essenciais sobre o serviço</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Armazenamento</h2>
            <p>Os dados são armazenados em servidores seguros da Supabase (AWS). As imagens geradas ficam armazenadas enquanto a conta estiver ativa.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Compartilhamento</h2>
            <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mercado Pago (processamento de pagamentos)</li>
              <li>HuggingFace (processamento dos prompts para geração — sem dados pessoais)</li>
              <li>Obrigação legal ou ordem judicial</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Seus direitos (LGPD)</h2>
            <p>Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar exclusão dos seus dados</li>
              <li>Revogar consentimento a qualquer momento</li>
              <li>Portabilidade dos dados</li>
            </ul>
            <p>Para exercer esses direitos, entre em contato pelo email abaixo.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Cookies</h2>
            <p>Utilizamos cookies essenciais para autenticação e manutenção da sessão. Não utilizamos cookies de rastreamento ou publicidade.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Contato</h2>
            <p>Para dúvidas sobre privacidade: <strong>contato@studioai.com.br</strong></p>
          </section>
        </div>
      </div>
    </div>
  )
}
