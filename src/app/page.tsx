import Link from 'next/link'
import { Sparkles, Zap, Shield, Image as ImageIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Zap size={20} className="text-violet-400" />
            StudioAI
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

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <Sparkles size={14} />
            200+ modelos de IA disponíveis
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Crie imagens incríveis<br />
            <span className="text-violet-400">com inteligência artificial</span>
          </h2>

          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
            Transforme suas ideias em imagens profissionais em segundos.
            Stable Diffusion, Flux e mais — tudo em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="px-6 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition">
              Começar grátis — 10 imagens/dia
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-lg border border-zinc-800 text-zinc-300 font-medium hover:border-zinc-700 transition">
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-20">
          <div className="border border-zinc-800 rounded-xl p-5">
            <ImageIcon size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Múltiplos modelos</h3>
            <p className="text-zinc-500 text-sm">SDXL, Flux, OpenJourney e mais. Escolha o estilo perfeito para cada projeto.</p>
          </div>
          <div className="border border-zinc-800 rounded-xl p-5">
            <Zap size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Rápido</h3>
            <p className="text-zinc-500 text-sm">Geração em segundos. Sem fila de espera no plano PRO.</p>
          </div>
          <div className="border border-zinc-800 rounded-xl p-5">
            <Shield size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Seus direitos</h3>
            <p className="text-zinc-500 text-sm">Todas as imagens geradas são suas. Use comercialmente sem restrições.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-4 text-center text-zinc-600 text-sm">
        StudioAI © 2026 · Geração de imagens com IA
      </footer>
    </div>
  )
}
