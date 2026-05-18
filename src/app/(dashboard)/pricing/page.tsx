'use client'

import { useState } from 'react'
import { Check, Moon, Star, Crown, Sparkles } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: 'Para sempre',
    icon: Moon,
    highlight: false,
    features: [
      { text: '5 conteúdos por dia', included: true },
      { text: 'Calendário astral', included: true },
      { text: '1 estilo visual', included: true },
      { text: 'Marca d\'água nas imagens', included: true },
      { text: 'Todos os estilos visuais', included: false },
      { text: 'Suporte prioritário', included: false },
    ],
  },
  {
    id: 'essencial',
    name: 'Essencial',
    price: 'R$ 47',
    period: '/mês',
    icon: Star,
    highlight: false,
    features: [
      { text: '30 conteúdos por mês', included: true },
      { text: 'Calendário astral completo', included: true },
      { text: 'Todos os estilos visuais', included: true },
      { text: 'Sem marca d\'água', included: true },
      { text: 'Hashtags + SEO otimizados', included: true },
      { text: 'Suporte por email', included: true },
    ],
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: 'R$ 97',
    period: '/mês',
    icon: Crown,
    highlight: true,
    features: [
      { text: '100 conteúdos por mês', included: true },
      { text: 'Tudo do Essencial', included: true },
      { text: 'Voz 100% personalizada', included: true },
      { text: 'Agendamento de posts', included: true },
      { text: 'Análise de performance', included: true },
      { text: 'Suporte prioritário', included: true },
    ],
  },
  {
    id: 'iluminada',
    name: 'Iluminada',
    price: 'R$ 197',
    period: '/mês',
    icon: Sparkles,
    highlight: false,
    features: [
      { text: 'Conteúdos ilimitados', included: true },
      { text: 'Tudo do Profissional', included: true },
      { text: 'Multi-plataforma (IG, TikTok, Blog)', included: true },
      { text: 'Consultoria IA personalizada', included: true },
      { text: 'White-label (sua marca)', included: true },
      { text: 'Onboarding dedicado', included: true },
    ],
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(planId: string) {
    if (planId === 'free') return
    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Erro ao criar pagamento. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">Escolha seu plano</h2>
        <p className="text-zinc-500">Evolua quando sentir o chamado. Cancele quando quiser.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map(plan => {
          const Icon = plan.icon
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-5 relative ${
                plan.highlight
                  ? 'border border-violet-500/50 bg-violet-500/5'
                  : 'border border-zinc-800'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium flex items-center gap-1">
                  <Crown size={12} /> Popular
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className={plan.highlight ? 'text-violet-400' : 'text-zinc-400'} />
                <h3 className="text-base font-semibold text-white">{plan.name}</h3>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {plan.price}
                {plan.period !== 'Para sempre' && <span className="text-sm text-zinc-400">{plan.period}</span>}
              </p>
              {plan.period === 'Para sempre' && <p className="text-zinc-500 text-xs mb-4">{plan.period}</p>}
              {plan.period !== 'Para sempre' && <p className="text-zinc-500 text-xs mb-4">Cancele quando quiser</p>}

              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f.text} className={`flex items-start gap-2 text-xs ${f.included ? 'text-zinc-300' : 'text-zinc-600 line-through'}`}>
                    <Check size={12} className={`mt-0.5 shrink-0 ${f.included ? (plan.highlight ? 'text-violet-400' : 'text-zinc-500') : 'text-zinc-700'}`} />
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.id === 'free' ? (
                <div className="py-2 rounded-lg border border-zinc-800 text-center text-zinc-500 text-xs font-medium">
                  Plano atual
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-2 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                    plan.highlight
                      ? 'bg-violet-600 text-white hover:bg-violet-500'
                      : 'border border-zinc-700 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  {loading === plan.id ? 'Processando...' : `Assinar ${plan.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
