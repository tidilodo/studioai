'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'threads', label: 'Threads' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google_business', label: 'Google Business' },
]

const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  queued: 'Na fila',
  scheduled: 'Agendado',
  published: 'Publicado',
  failed: 'Falhou',
}

export function PublishActions({
  contentId,
  initialStatus,
}: {
  contentId: string
  initialStatus?: string | null
}) {
  const [platform, setPlatform] = useState('instagram')
  const [status, setStatus] = useState(initialStatus || 'draft')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function publishNow() {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/publish/zernio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, platforms: [platform] }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar')
      }

      setStatus(data.status)
      setMessage(data.configured ? 'Enviado para Zernio.' : 'Salvo na fila. Configure Zernio para publicar.')
    } catch (error: unknown) {
      setStatus('failed')
      setMessage(error instanceof Error ? error.message : 'Erro ao publicar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className={`px-2 py-1 rounded text-[10px] font-medium ${status === 'failed' ? 'bg-red-500/10 text-red-300' : status === 'published' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
        {STATUS_LABELS[status] || status}
      </span>
      <select
        value={platform}
        onChange={(event) => setPlatform(event.target.value)}
        className="h-8 rounded-lg border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-300 outline-none focus:border-violet-500"
      >
        {PLATFORM_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={publishNow}
        disabled={loading}
        className="inline-flex h-8 items-center gap-1 rounded-lg bg-violet-600 px-3 text-xs font-medium text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={13} />
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
      {message && <span className="text-[11px] text-zinc-500">{message}</span>}
    </div>
  )
}

