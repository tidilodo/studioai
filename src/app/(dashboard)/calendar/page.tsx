import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Moon, Sun, Star, ArrowRight, Zap } from 'lucide-react'

const EVENT_ICONS: Record<string, typeof Moon> = {
  lunar: Moon,
  planetary: Star,
  eclipse: Sun,
  retrograde: Zap,
  seasonal: Sun,
}

const EVENT_COLORS: Record<string, string> = {
  lunar: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  planetary: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  eclipse: 'text-red-400 bg-red-500/10 border-red-500/20',
  retrograde: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  seasonal: 'text-green-400 bg-green-500/10 border-green-500/20',
}

export default async function CalendarPage() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  const { data: events } = await supabase
    .from('astro_events')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(20)

  const { data: pastEvents } = await supabase
    .from('astro_events')
    .select('*')
    .lt('date', today)
    .order('date', { ascending: false })
    .limit(3)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Calendário Astral</h1>
        <p className="text-zinc-400 text-sm">Eventos cósmicos e sugestões de conteúdo alinhadas com as energias</p>
      </div>

      {/* Next event highlight */}
      {events && events[0] && (
        <div className="mb-8 p-6 rounded-2xl border border-violet-500/30 bg-violet-500/5">
          <p className="text-xs text-violet-400 font-medium mb-2">PRÓXIMO EVENTO</p>
          <h2 className="text-xl font-bold text-white mb-1">{events[0].title}</h2>
          <p className="text-sm text-zinc-400 mb-3">{formatDate(events[0].date)} — {events[0].description}</p>
          <div className="bg-zinc-900/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-zinc-500 mb-1">Energia: <span className="text-violet-300">{events[0].energy}</span></p>
            <p className="text-sm text-zinc-300">{events[0].content_suggestion}</p>
          </div>
          <Link
            href={`/studio?topic=${encodeURIComponent(events[0].title)}&suggestion=${encodeURIComponent(events[0].content_suggestion || '')}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition"
          >
            Criar conteúdo sobre isso <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Upcoming events */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Próximos eventos</h3>
        {events?.slice(1).map(event => {
          const Icon = EVENT_ICONS[event.event_type] || Moon
          const colorClass = EVENT_COLORS[event.event_type] || EVENT_COLORS.lunar
          return (
            <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition">
              <div className={`p-2 rounded-lg border ${colorClass}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-sm font-medium text-white">{event.title}</h4>
                  <span className="text-xs text-zinc-600">{formatDate(event.date)}</span>
                </div>
                <p className="text-xs text-zinc-500 mb-2">{event.description}</p>
                {event.content_suggestion && (
                  <p className="text-xs text-zinc-400 italic">&ldquo;{event.content_suggestion}&rdquo;</p>
                )}
              </div>
              <Link
                href={`/studio?topic=${encodeURIComponent(event.title)}&suggestion=${encodeURIComponent(event.content_suggestion || '')}`}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition"
              >
                Criar
              </Link>
            </div>
          )
        })}
      </div>

      {/* Past events */}
      {pastEvents && pastEvents.length > 0 && (
        <div className="mt-10 space-y-3">
          <h3 className="text-sm font-medium text-zinc-500 mb-4">Eventos recentes (ainda relevantes para conteúdo)</h3>
          {pastEvents.map(event => {
            const Icon = EVENT_ICONS[event.event_type] || Moon
            return (
              <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800/50 opacity-70">
                <div className="p-2 rounded-lg border border-zinc-800 text-zinc-500">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-sm font-medium text-zinc-400">{event.title}</h4>
                    <span className="text-xs text-zinc-700">{formatDate(event.date)}</span>
                  </div>
                  <p className="text-xs text-zinc-600">{event.content_suggestion}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}
