'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Loader2, Copy, Download, Image as ImageIcon, CheckCheck } from 'lucide-react'

const CONTENT_TYPES = [
  { id: 'post_feed', label: 'Post Feed', desc: 'Post padrão com hook + corpo + CTA' },
  { id: 'stories', label: 'Stories', desc: 'Sequência de stories (5-7)' },
  { id: 'carousel', label: 'Carrossel', desc: 'Slides educativos (7-10)' },
  { id: 'reels_script', label: 'Roteiro Reels', desc: 'Script de 30-60 seg' },
  { id: 'blog_seo', label: 'Blog SEO', desc: 'Artigo otimizado para Google' },
  { id: 'ad_copy', label: 'Copy Ads', desc: '3 variações para anúncios' },
]

export default function StudioPage() {
  const searchParams = useSearchParams()
  const [type, setType] = useState('post_feed')
  const [topic, setTopic] = useState('')
  const [generateImage, setGenerateImage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = searchParams.get('topic')
    const s = searchParams.get('suggestion')
    if (t) setTopic(s ? `${t} — ${s}` : t)
  }, [searchParams])

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          topic: topic.trim(),
          generateImage,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao gerar conteúdo')
        return
      }

      setResult(data)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    const text = result.full_text || `${result.copy_hook}\n\n${result.copy_body}\n\n${result.copy_cta}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Criar conteúdo</h2>
      <p className="text-zinc-400 text-sm mb-6">A IA vai gerar copy + imagem personalizados para o seu nicho</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Tipo de conteúdo</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map(ct => (
                <button
                  key={ct.id}
                  type="button"
                  onClick={() => setType(ct.id)}
                  className={`p-3 rounded-lg border text-left transition ${
                    type === ct.id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <p className={`text-sm font-medium ${type === ct.id ? 'text-violet-300' : 'text-zinc-300'}`}>{ct.label}</p>
                  <p className="text-xs text-zinc-500">{ct.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tema / Tópico</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Ex: Lua Cheia em Escorpião — transformação e soltar o que não serve. Ou: benefícios da meditação matinal..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none resize-none"
              required
            />
          </div>

          <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
            <input
              type="checkbox"
              checked={generateImage}
              onChange={e => setGenerateImage(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900 text-violet-500 focus:ring-violet-500"
            />
            <div>
              <p className="text-sm text-zinc-300">Gerar imagem junto</p>
              <p className="text-xs text-zinc-500">Imagem alinhada com seu estilo visual</p>
            </div>
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar conteúdo
              </>
            )}
          </button>
        </form>

        {/* Result */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* Image */}
              {result.image_url && (
                <div className="relative group">
                  <img
                    src={result.image_url}
                    alt={topic}
                    className="rounded-xl w-full object-cover border border-zinc-800 max-h-64"
                  />
                  <a
                    href={result.image_url}
                    download
                    target="_blank"
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <Download size={16} />
                  </a>
                </div>
              )}

              {/* Copy */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-zinc-500 font-medium">COPY GERADA</p>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white transition">
                    {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">
                  {result.full_text}
                </div>
              </div>

              {/* Hashtags */}
              {result.hashtags && result.hashtags.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 font-medium mb-2">HASHTAGS</p>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 rounded bg-violet-500/10 text-violet-300 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Keywords */}
              {result.seo_keywords && result.seo_keywords.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 font-medium mb-2">PALAVRAS-CHAVE SEO</p>
                  <div className="flex flex-wrap gap-2">
                    {result.seo_keywords.map((kw: string) => (
                      <span key={kw} className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-zinc-600">
                <Sparkles size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Seu conteúdo aparecerá aqui</p>
                <p className="text-xs mt-1">Copy + imagem + hashtags + SEO</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
