'use client'

import { useState } from 'react'
import { Check, Zap, Crown } from 'lucide-react'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Erro ao criar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">Escolha seu plano</h2>
        <p className="text-zinc-500">Desbloqueie o poder total da IA generativa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free */}
        <div className="border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-zinc-400" />
            <h3 className="text-lg font-semibold text-white">Free</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">R$ 0</p>
          <p className="text-zinc-500 text-sm mb-6">Para sempre</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-zinc-500" /> 10 gerações por dia
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-zinc-500" /> 3 modelos disponíveis
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-zinc-500" /> Resolução até 1024px
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-400 line-through">
              Sem marca d'água
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-400 line-through">
              Download em alta resolução
            </li>
          </ul>
          <div className="py-2.5 rounded-lg border border-zinc-800 text-center text-zinc-500 text-sm font-medium">
            Plano atual
          </div>
        </div>

        {/* Pro */}
        <div className="border border-violet-500/50 rounded-2xl p-6 bg-violet-500/5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium">
            Mais popular
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Crown size={20} className="text-violet-400" />
            <h3 className="text-lg font-semibold text-white">PRO</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-1">R$ 29<span className="text-lg text-zinc-400">/mês</span></p>
          <p className="text-zinc-500 text-sm mb-6">Cancele quando quiser</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-violet-400" /> Gerações ilimitadas
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-violet-400" /> Todos os modelos
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-violet-400" /> Resolução até 2048px
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-violet-400" /> Sem marca d'água
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-violet-400" /> Download em alta resolução
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <Check size={16} className="text-violet-400" /> Prioridade na fila
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Fazer upgrade — R$ 29/mês'}
          </button>
        </div>
      </div>
    </div>
  )
}
