'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Download, Loader2, ImageIcon } from 'lucide-react'

const MODELS = [
  { id: 'stable-diffusion-xl', name: 'SDXL', description: 'Qualidade alta, versátil' },
  { id: 'flux-schnell', name: 'Flux Schnell', description: 'Ultra rápido' },
  { id: 'dall-e-style', name: 'Artístico', description: 'Estilo ilustração' },
]

const SIZES = [
  { id: '1024x1024', label: '1:1', w: 1024, h: 1024 },
  { id: '1024x768', label: '4:3', w: 1024, h: 768 },
  { id: '768x1024', label: '3:4', w: 768, h: 1024 },
  { id: '1280x720', label: '16:9', w: 1280, h: 720 },
]

export default function StudioPage() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('stable-diffusion-xl')
  const [size, setSize] = useState('1024x1024')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError('')
    setImageUrl(null)

    const selectedSize = SIZES.find(s => s.id === size)!

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negative_prompt: negativePrompt.trim() || undefined,
          model,
          width: selectedSize.w,
          height: selectedSize.h,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao gerar imagem')
        return
      }

      setImageUrl(data.image_url)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Criar Imagem</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Descreva a imagem que quer criar... Ex: um gato astronauta flutuando no espaço, estilo digital art"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Prompt negativo <span className="text-zinc-600">(opcional)</span></label>
            <input
              type="text"
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              placeholder="O que NÃO quer na imagem: blur, low quality..."
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Modelo</label>
            <div className="grid grid-cols-3 gap-2">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={`p-3 rounded-lg border text-left transition ${
                    model === m.id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <p className="text-sm text-white font-medium">{m.name}</p>
                  <p className="text-xs text-zinc-500">{m.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Proporção</label>
            <div className="flex gap-2">
              {SIZES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    size === s.id
                      ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar Imagem
              </>
            )}
          </button>
        </form>

        {/* Preview */}
        <div className="flex items-center justify-center">
          {imageUrl ? (
            <div className="relative group">
              <img
                src={imageUrl}
                alt={prompt}
                className="rounded-xl max-h-[500px] w-full object-contain border border-zinc-800"
              />
              <a
                href={imageUrl}
                download
                target="_blank"
                className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
              >
                <Download size={18} />
              </a>
            </div>
          ) : (
            <div className="w-full aspect-square max-w-md rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600">
              <ImageIcon size={48} className="mb-3 opacity-40" />
              <p className="text-sm">Sua imagem aparecerá aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
