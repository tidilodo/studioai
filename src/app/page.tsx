import Link from 'next/link'
import { Sparkles, Zap, Shield, Image as ImageIcon, Check, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: showcaseImages } = await supabase
    .from('generations')
    .select('id, prompt, image_url')
    .eq('status', 'completed')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(8)

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

      <main className="flex-1 flex flex-col items-center px-6 py-20">
        {/* Hero */}
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
            <Sparkles size={14} />
            Geração com FLUX — o modelo mais avançado
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Crie imagens incríveis<br />
            <span className="text-violet-400">com inteligência artificial</span>
          </h2>

          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
            Transforme suas ideias em imagens profissionais em segundos.
            Powered by FLUX — sem instalação, sem complicação.
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

        {/* Showcase */}
        <div className="max-w-4xl w-full mt-16">
          <p className="text-center text-zinc-500 text-sm mb-6">
            {showcaseImages?.length ? 'Criado pela comunidade:' : 'Exemplos do que você pode criar:'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {showcaseImages?.length ? (
              showcaseImages.map(img => (
                <div key={img.id} className="group relative rounded-xl overflow-hidden border border-zinc-800">
                  <img src={img.image_url} alt={img.prompt} className="w-full aspect-square object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <p className="text-white text-[10px] line-clamp-2">{img.prompt}</p>
                  </div>
                </div>
              ))
            ) : (
              ['Gato astronauta no espaço', 'Logo minimalista tech', 'Paisagem cyberpunk', 'Retrato estilo oil painting'].map(prompt => (
                <div key={prompt} className="border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-violet-900/20 to-zinc-900 mb-2 flex items-center justify-center">
                    <Sparkles size={20} className="text-violet-500/50" />
                  </div>
                  <p className="text-zinc-400 text-xs">&ldquo;{prompt}&rdquo;</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-16">
          <div className="border border-zinc-800 rounded-xl p-5">
            <ImageIcon size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">FLUX.1 Schnell</h3>
            <p className="text-zinc-500 text-sm">O modelo mais rápido e avançado do momento. Resultados de alta qualidade em segundos.</p>
          </div>
          <div className="border border-zinc-800 rounded-xl p-5">
            <Zap size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Rápido e simples</h3>
            <p className="text-zinc-500 text-sm">Descreva o que quer, clique em gerar. Sem configuração, sem instalação.</p>
          </div>
          <div className="border border-zinc-800 rounded-xl p-5">
            <Shield size={24} className="text-violet-400 mb-3" />
            <h3 className="text-white font-semibold mb-1">Seus direitos</h3>
            <p className="text-zinc-500 text-sm">Todas as imagens geradas são suas. Use comercialmente sem restrições.</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-3xl w-full mt-20" id="pricing">
          <h3 className="text-2xl font-bold text-white text-center mb-2">Planos</h3>
          <p className="text-zinc-500 text-center mb-8">Comece grátis, escale quando precisar</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-800 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-1">Free</h4>
              <p className="text-3xl font-bold text-white mb-4">R$ 0</p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2"><Check size={14} className="text-zinc-500" /> 10 gerações por dia</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-zinc-500" /> Modelo FLUX.1</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-zinc-500" /> Resolução até 1024px</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-zinc-500" /> Download das imagens</li>
              </ul>
            </div>
            <div className="border border-violet-500/50 rounded-2xl p-6 bg-violet-500/5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium flex items-center gap-1">
                <Crown size={12} /> Recomendado
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">PRO</h4>
              <p className="text-3xl font-bold text-white mb-4">R$ 29<span className="text-lg text-zinc-400">/mês</span></p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Gerações ilimitadas</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Sem marca d'água</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Alta resolução</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Prioridade na fila</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-violet-400" /> Suporte prioritário</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <Link href="/register" className="px-8 py-3.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition text-lg">
            Criar conta grátis
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-600 text-sm">
          <span>StudioAI © 2026</span>
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
