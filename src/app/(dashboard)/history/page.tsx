import { createClient } from '@/lib/supabase/server'
import { Clock, Copy } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  post_feed: 'Post Feed',
  stories: 'Stories',
  carousel: 'Carrossel',
  reels_script: 'Roteiro Reels',
  blog_seo: 'Blog SEO',
  ad_copy: 'Copy Ads',
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pieces } = await supabase
    .from('content_pieces')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-1">Meus conteúdos</h2>
      <p className="text-zinc-400 text-sm mb-6">Todos os conteúdos que você gerou</p>

      {!pieces?.length ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center">
          <Clock size={48} className="mx-auto mb-3 text-zinc-700" />
          <p className="text-zinc-500">Nenhum conteúdo criado ainda</p>
          <p className="text-zinc-600 text-sm mt-1">Vá ao Studio para criar seu primeiro conteúdo!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pieces.map(piece => (
            <div key={piece.id} className="border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition">
              <div className="flex items-start gap-4">
                {piece.image_url && (
                  <img
                    src={piece.image_url}
                    alt={piece.topic}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-zinc-800"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 text-xs font-medium">
                      {TYPE_LABELS[piece.type] || piece.type}
                    </span>
                    <span className="text-xs text-zinc-600">
                      {new Date(piece.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium truncate">{piece.topic}</p>
                  {piece.copy_hook && (
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{piece.copy_hook}</p>
                  )}
                  {piece.hashtags && piece.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {piece.hashtags.slice(0, 5).map((tag: string) => (
                        <span key={tag} className="text-[10px] text-violet-400">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
