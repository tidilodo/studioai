import Link from 'next/link'
import { Moon, Star, Sparkles, Heart, ShoppingBag, ArrowRight } from 'lucide-react'

const MODULES = [
  {
    icon: Star,
    name: 'Akasha Mapa',
    tagline: 'Descubra seus números',
    description: 'Mapa numerológico Pitagórico completo com interpretações, cristal do seu número e PDF para guardar.',
    cta: 'Fazer meu mapa grátis',
    href: 'https://numerologia-rosy.vercel.app/captacao.html?utm_source=akasha&utm_medium=landing',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    status: 'Ativo',
  },
  {
    icon: Moon,
    name: 'Akasha Cosmos',
    tagline: 'O céu da semana',
    description: 'Resumos astrológicos semanais por signo, baseados em conteúdo real de tarólogos brasileiros. Briefing Pro para terapeutas.',
    cta: 'Em breve',
    href: '#',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    status: 'Em breve',
  },
  {
    icon: Sparkles,
    name: 'Akasha Cria',
    tagline: 'Conteúdo com alma',
    description: 'IA que gera posts, carrosséis, stories e copies alinhados com o calendário astral e a identidade da sua marca.',
    cta: 'Começar grátis',
    href: '/register',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10 border-violet-500/20',
    status: 'Ativo',
  },
  {
    icon: Heart,
    name: 'Akasha Cuida',
    tagline: 'Gestão holística',
    description: 'Prontuário holístico, agenda, sessões e IA que entende o histórico energético dos seus clientes.',
    cta: 'Lista de espera',
    href: '#',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
    status: 'Em breve',
  },
  {
    icon: ShoppingBag,
    name: 'Akasha Vitrine',
    tagline: 'Monetize além das consultas',
    description: 'Venda workshops, cursos, cristais e kits holísticos. Doações PIX com intenção. Perfil público do terapeuta.',
    cta: 'Conhecer',
    href: '#',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    status: 'Em breve',
  },
]

const PLANS = [
  {
    name: 'Semente',
    price: 'Grátis',
    description: 'Conheça o ecossistema',
    features: ['Mapa Numerológico completo', 'Cosmos — 1 signo', 'Cria — 5 conteúdos/dia'],
  },
  {
    name: 'Terapeuta',
    price: 'R$ 147/mês',
    description: 'Para terapeutas ativos',
    features: ['Tudo do Semente', 'Cosmos Pro (12 signos + briefing)', 'Cria — 30 posts/mês', 'Vitrine (5% comissão)'],
    highlight: true,
  },
  {
    name: 'Mestre',
    price: 'R$ 247/mês',
    description: 'Para terapeutas estabelecidos',
    features: ['Tudo do Terapeuta', 'Cuida (prontuário + agenda)', 'Cria ilimitado', 'Vitrine (2% comissão)', 'White-label do Mapa'],
  },
]

export default function AkashaLanding() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Moon size={20} className="text-violet-400" />
            Akasha
          </h1>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition">
            Entrar no ecossistema
          </Link>
        </div>
      </header>

      <main className="px-6 py-20">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-violet-400 text-sm font-medium mb-4">O sistema operacional do terapeuta holístico</p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Tudo que você precisa<br />
            <span className="text-violet-400">num só lugar</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            5 ferramentas integradas para criar conteúdo, atender clientes,
            entender os astros e monetizar seu trabalho holístico.
          </p>
        </div>

        {/* Modules */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {MODULES.map(mod => {
            const Icon = mod.icon
            return (
              <div key={mod.name} className="border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition flex flex-col">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${mod.bgColor}`}>
                  <Icon size={20} className={mod.color} />
                </div>
                <h3 className="text-white font-semibold mb-0.5">{mod.name}</h3>
                <p className={`text-sm mb-2 ${mod.color}`}>{mod.tagline}</p>
                <p className="text-zinc-500 text-sm flex-1 mb-4">{mod.description}</p>
                <div className="flex items-center justify-between">
                  {mod.href !== '#' ? (
                    <Link href={mod.href} className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition">
                      {mod.cta} <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span className="text-sm text-zinc-600">{mod.cta}</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${mod.status === 'Ativo' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {mod.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* How it connects */}
        <div className="max-w-3xl mx-auto mb-20">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Como tudo se conecta</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-300 text-sm font-bold">1</span>
              </div>
              <p className="text-zinc-300 text-sm"><strong className="text-white">Mapa</strong> atrai leads — pessoa faz mapa numerológico grátis e descobre o ecossistema</p>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-300 text-sm font-bold">2</span>
              </div>
              <p className="text-zinc-300 text-sm"><strong className="text-white">Cosmos</strong> dá contexto astral em tempo real — alimenta o Cria e o Cuida automaticamente</p>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-300 text-sm font-bold">3</span>
              </div>
              <p className="text-zinc-300 text-sm"><strong className="text-white">Cria</strong> gera conteúdo com alma — posts alinhados com trânsitos + identidade do terapeuta</p>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-300 text-sm font-bold">4</span>
              </div>
              <p className="text-zinc-300 text-sm"><strong className="text-white">Cuida</strong> gerencia clientes — prontuário holístico com IA que entende padrões energéticos</p>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-300 text-sm font-bold">5</span>
              </div>
              <p className="text-zinc-300 text-sm"><strong className="text-white">Vitrine</strong> monetiza — venda workshops, cursos e produtos sem sair do ecossistema</p>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-2xl font-bold text-white text-center mb-2">Planos</h3>
          <p className="text-zinc-500 text-center mb-8">Um login, todas as ferramentas</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-6 ${plan.highlight ? 'border border-violet-500/50 bg-violet-500/5' : 'border border-zinc-800'}`}>
                <h4 className="text-lg font-semibold text-white mb-1">{plan.name}</h4>
                <p className="text-2xl font-bold text-white mb-1">{plan.price}</p>
                <p className="text-xs text-zinc-500 mb-4">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-violet-400 mt-0.5">-</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/register" className="px-8 py-3.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition text-lg">
            Começar grátis
          </Link>
          <p className="text-zinc-600 text-sm mt-3">Sem cartão de crédito. Acesso imediato ao Mapa e ao Cria.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
          <span>Akasha 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-400 transition">Akasha Cria</Link>
            <a href="https://numerologia-rosy.vercel.app" className="hover:text-zinc-400 transition">Akasha Mapa</a>
            <Link href="/privacidade" className="hover:text-zinc-400 transition">Privacidade</Link>
            <Link href="/termos" className="hover:text-zinc-400 transition">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
