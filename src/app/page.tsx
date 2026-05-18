import Link from 'next/link'
import { Sparkles, Moon, Sun, Star, Check, Crown, Calendar, Feather, Eye, Palette } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Moon size={20} className="text-violet-400" />
            OráculoAI
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition">
              Entrar
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition">
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-20">
        {/* Hero */}
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <Sparkles size={14} />
            IA especializada no nicho holístico
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Conteúdo estratégico para<br />
            <span className="text-violet-400">terapeutas holísticos</span>
          </h2>

          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
            Gere posts, carrosséis, stories e copies alinhados com o calendário astral.
            A IA que entende astrologia, tarot e terapias energéticas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="px-6 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition">
              Começar grátis — 5 conteúdos/dia
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-lg border border-zinc-800 text-zinc-300 font-medium hover:border-zinc-700 transition">
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Who is it for */}
        <div className="max-w-4xl w-full mt-20">
          <h3 className="text-xl font-bold text-white text-center mb-8">Para quem é o OráculoAI?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Star, label: 'Astrólogos' },
              { icon: Eye, label: 'Tarólogos' },
              { icon: Sun, label: 'Reikistas' },
              { icon: Feather, label: 'Terapeutas holísticos' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="border border-zinc-800 rounded-xl p-4 text-center hover:border-violet-500/30 transition">
                <Icon size={24} className="text-violet-400 mx-auto mb-2" />
                <p className="text-zinc-300 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-16">
          <div className="border border-zinc-800 rounded-xl p-5">
            <Calendar size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Calendário Astral</h3>
            <p className="text-zinc-500 text-sm">Sugestões de conteúdo baseadas em luas, trânsitos e retrogradações. Nunca mais fique sem ideia.</p>
          </div>
          <div className="border border-zinc-800 rounded-xl p-5">
            <Feather size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Copy Especializada</h3>
            <p className="text-zinc-500 text-sm">Hook, corpo e CTA escritos com a linguagem do seu nicho. Hashtags e SEO incluídos.</p>
          </div>
          <div className="border border-zinc-800 rounded-xl p-5">
            <Palette size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Visual Alinhado</h3>
            <p className="text-zinc-500 text-sm">Imagens geradas por IA no estilo visual da sua marca — místico, etéreo, terroso ou cósmico.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-3xl w-full mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Como funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-violet-300 font-bold">1</span>
              </div>
              <h4 className="text-white font-medium mb-1">Configure seu perfil</h4>
              <p className="text-zinc-500 text-sm">Escolha seu sub-nicho, tom de voz e estilo visual. A IA se adapta à sua marca.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-violet-300 font-bold">2</span>
              </div>
              <h4 className="text-white font-medium mb-1">Escolha o momento</h4>
              <p className="text-zinc-500 text-sm">Use o calendário astral ou crie conteúdo sobre qualquer tema do universo holístico.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-violet-300 font-bold">3</span>
              </div>
              <h4 className="text-white font-medium mb-1">Receba tudo pronto</h4>
              <p className="text-zinc-500 text-sm">Copy + imagem + hashtags + sugestão de horário. É só publicar.</p>
            </div>
          </div>
        </div>

        {/* Content types */}
        <div className="max-w-4xl w-full mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-2">Tipos de conteúdo</h3>
          <p className="text-zinc-500 text-center mb-8">Tudo que você precisa para manter suas redes ativas</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Post Feed',
              'Stories',
              'Carrossel',
              'Roteiro Reels',
              'Blog SEO',
              'Copy para Ads',
            ].map(type => (
              <div key={type} className="border border-zinc-800 rounded-lg p-3 text-center">
                <p className="text-zinc-300 text-sm font-medium">{type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-5xl w-full mt-20" id="pricing">
          <h3 className="text-2xl font-bold text-white text-center mb-2">Planos</h3>
          <p className="text-zinc-500 text-center mb-8">Comece grátis, evolua quando sentir o chamado</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Gratuito */}
            <div className="border border-zinc-800 rounded-2xl p-5">
              <h4 className="text-base font-semibold text-white mb-1">Gratuito</h4>
              <p className="text-2xl font-bold text-white mb-3">R$ 0</p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2"><Check size={14} className="text-zinc-500 mt-0.5 shrink-0" /> 5 conteúdos/dia</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-zinc-500 mt-0.5 shrink-0" /> Calendário astral</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-zinc-500 mt-0.5 shrink-0" /> 1 estilo visual</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-zinc-500 mt-0.5 shrink-0" /> Marca d&apos;água</li>
              </ul>
            </div>

            {/* Essencial */}
            <div className="border border-zinc-800 rounded-2xl p-5">
              <h4 className="text-base font-semibold text-white mb-1">Essencial</h4>
              <p className="text-2xl font-bold text-white mb-3">R$ 47<span className="text-sm text-zinc-400">/mês</span></p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> 30 conteúdos/mês</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Todos os estilos</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Sem marca d&apos;água</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Hashtags + SEO</li>
              </ul>
            </div>

            {/* Profissional */}
            <div className="border border-violet-500/50 rounded-2xl p-5 bg-violet-500/5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium flex items-center gap-1">
                <Crown size={12} /> Popular
              </div>
              <h4 className="text-base font-semibold text-white mb-1">Profissional</h4>
              <p className="text-2xl font-bold text-white mb-3">R$ 97<span className="text-sm text-zinc-400">/mês</span></p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> 100 conteúdos/mês</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Agendamento</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Voz personalizada</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Suporte prioritário</li>
              </ul>
            </div>

            {/* Iluminada */}
            <div className="border border-zinc-800 rounded-2xl p-5">
              <h4 className="text-base font-semibold text-white mb-1">Iluminada</h4>
              <p className="text-2xl font-bold text-white mb-3">R$ 197<span className="text-sm text-zinc-400">/mês</span></p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Ilimitado</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Multi-plataforma</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> Consultoria IA</li>
                <li className="flex items-start gap-2"><Check size={14} className="text-violet-400 mt-0.5 shrink-0" /> White-label</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <p className="text-zinc-400 mb-4">Mais de 200 terapeutas já usam OráculoAI para criar conteúdo</p>
          <Link href="/register" className="px-8 py-3.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition text-lg">
            Criar conta grátis
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
          <span>OráculoAI © 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-zinc-400 transition">Planos</Link>
            <Link href="/privacidade" className="hover:text-zinc-400 transition">Privacidade</Link>
            <Link href="/termos" className="hover:text-zinc-400 transition">Termos de Uso</Link>
            <Link href="/register" className="hover:text-zinc-400 transition">Criar conta</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
